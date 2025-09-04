import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfjsLib from "https://esm.sh/pdfjs-dist@4.6.82/legacy/build/pdf.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Robust PDF text extraction using pdfjs-dist (serverless-friendly)
async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('Starting PDF text extraction with pdfjs-dist...');

    // Configure pdf.js for serverless usage (no separate worker file required)
    try {
      // @ts-ignore - types not available in this environment
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
        'https://esm.sh/pdfjs-dist@4.6.82/legacy/build/pdf.worker.js';
    } catch (e) {
      console.warn('pdfjs GlobalWorkerOptions config failed (continuing):', e);
    }

    const uint8Array = new Uint8Array(arrayBuffer);

    // Load PDF document
    // @ts-ignore - pdfjs types not available in this environment
    const loadingTask = (pdfjsLib as any).getDocument({
      data: uint8Array,
      // Serverless-safe flags
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    console.log(`PDF loaded with ${pdf.numPages} pages`);

    let extractedText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = (content.items as any[])
        .map((item: any) => (item && typeof item.str === 'string' ? item.str : ''))
        .join(' ');

      extractedText += pageText + '\n';
    }

    // Clean and normalize the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s@.:,;\-()\/+]/g, ' ')
      .trim();

    console.log(`Successfully extracted ${extractedText.length} characters from PDF`);
    console.log('First 200 characters:', extractedText.substring(0, 200));

    // Validate extracted text quality
    if (extractedText.length < 50) {
      throw new Error('Insufficient text extracted. The PDF might be image-based or corrupted.');
    }

    const letterCount = (extractedText.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 20) {
      throw new Error('PDF appears to contain mostly non-text content. OCR may be required.');
    }

    return extractedText;
  } catch (error) {
    console.error('PDF extraction error:', error);

    const msg = (error as Error)?.message || String(error);
    if (msg.includes('password') || msg.includes('encrypted')) {
      throw new Error('PDF is password-protected or encrypted. Please provide an unlocked PDF.');
    }
    if (msg.includes('damaged') || msg.includes('corrupt')) {
      throw new Error('PDF file appears to be corrupted or damaged.');
    }

    throw new Error(`Failed to extract text from PDF: ${msg}`);
  }
}

// OpenAI structured output schema
const candidateSchema = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      description: "Whether candidate information was found"
    },
    candidate: {
      type: "object",
      properties: {
        first_name: { type: "string", description: "First name if found" },
        last_name: { type: "string", description: "Last name if found" },
        email: { type: "string", description: "Email address if found" },
        phone: { type: "string", description: "Phone number if found" },
        linkedin_url: { type: "string", description: "LinkedIn URL if found" },
        skills: { 
          type: "array", 
          items: { type: "string" },
          description: "Technical skills if found" 
        },
        experience_years: { type: "number", description: "Years of experience if determinable" },
        current_role: { type: "string", description: "Current job title if found" },
        education: { type: "string", description: "Education details if found" },
        location: { type: "string", description: "Location if found" },
        summary: { type: "string", description: "Professional summary if creatable from content" }
      },
      required: [],
      additionalProperties: false
    },
    error: { type: "string", description: "Error message if parsing failed" }
  },
  required: ["success"],
  additionalProperties: false
};

// Parse with OpenAI
async function parseResumeContent(resumeText: string): Promise<any> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `You are a resume parser that extracts candidate information from resume text.

RULES:
- Extract ONLY information that is clearly present in the text
- If a field is not found or unclear, omit it from the response
- Return success=true if you find at least some candidate information (name, email, or clear professional content)
- Return success=false only if the text contains no candidate information at all

FIELD GUIDELINES:
- first_name/last_name: Extract if name is clearly visible
- email: Extract if valid email format found  
- phone: Extract if phone number found (any format)
- linkedin_url: Extract if LinkedIn profile URL found
- skills: Extract technical skills, programming languages, tools mentioned
- experience_years: Calculate from work history dates if available
- current_role: Extract most recent job title if found
- education: Extract degree/school information if present
- location: Extract current location if mentioned
- summary: Create brief 1-2 sentence summary if sufficient information available

Only include fields where you found actual information.`;

  const userPrompt = `Extract candidate information from this resume text:

${resumeText}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "candidate_extraction",
            schema: candidateSchema,
            strict: true
          }
        },
        max_completion_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI parsing error:', error);
    throw error;
  }
}

// Main handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only PDF files are supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: 'File size exceeds 10MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    console.log(`Processing PDF: ${file.name}, size: ${file.size} bytes`);

    // Extract text from PDF
    let resumeText: string;
    try {
      const arrayBuffer = await file.arrayBuffer();
      resumeText = await extractPdfText(arrayBuffer);
      console.log(`Extracted text length: ${resumeText.length} characters`);
    } catch (extractError) {
      console.error('PDF extraction failed:', extractError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `PDF processing failed: ${extractError.message}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Validate extracted content
    if (!resumeText || resumeText.trim().length < 50) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'PDF contains insufficient text. Please ensure the PDF is text-based (not a scanned image).' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Parse with OpenAI
    let parseResult: any;
    try {
      parseResult = await parseResumeContent(resumeText);
    } catch (parseError) {
      console.error('OpenAI parsing failed:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Resume analysis failed: ${parseError.message}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Check parsing result
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: parseResult.error || 'No candidate information found in the resume' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Clean and prepare response data
    const candidate: any = {};
    const foundFields: string[] = [];

    if (parseResult.candidate.first_name) {
      candidate.first_name = parseResult.candidate.first_name.trim();
      foundFields.push('first_name');
    }

    if (parseResult.candidate.last_name) {
      candidate.last_name = parseResult.candidate.last_name.trim();
      foundFields.push('last_name');
    }

    if (parseResult.candidate.email) {
      candidate.email = parseResult.candidate.email.trim();
      foundFields.push('email');
    }

    if (parseResult.candidate.phone) {
      candidate.phone = parseResult.candidate.phone.trim();
      foundFields.push('phone');
    }

    if (parseResult.candidate.linkedin_url) {
      candidate.linkedin_url = parseResult.candidate.linkedin_url.trim();
      foundFields.push('linkedin_url');
    }

    if (parseResult.candidate.skills && Array.isArray(parseResult.candidate.skills)) {
      const validSkills = parseResult.candidate.skills.filter(skill => 
        skill && typeof skill === 'string' && skill.trim().length > 0
      );
      if (validSkills.length > 0) {
        candidate.skills = validSkills.map(skill => skill.trim());
        foundFields.push('skills');
      }
    }

    if (parseResult.candidate.current_role) {
      candidate.current_role = parseResult.candidate.current_role.trim();
      foundFields.push('current_role');
    }

    if (parseResult.candidate.education) {
      candidate.education = parseResult.candidate.education.trim();
      foundFields.push('education');
    }

    if (parseResult.candidate.location) {
      candidate.location = parseResult.candidate.location.trim();
      foundFields.push('location');
    }

    if (parseResult.candidate.summary) {
      candidate.notes = parseResult.candidate.summary.trim();
      foundFields.push('summary');
    }

    if (typeof parseResult.candidate.experience_years === 'number' && parseResult.candidate.experience_years >= 0) {
      candidate.experience_years = parseResult.candidate.experience_years;
      foundFields.push('experience_years');
    }

    console.log(`Successfully parsed candidate with ${foundFields.length} fields:`, foundFields);

    return new Response(
      JSON.stringify({ 
        success: true, 
        candidate,
        found_fields: foundFields,
        message: `Successfully extracted ${foundFields.length} fields from resume`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred during processing' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});