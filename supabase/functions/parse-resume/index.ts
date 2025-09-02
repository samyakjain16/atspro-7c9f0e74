import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractText } from "jsr:@pdf/pdftext";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedCandidate {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  skills?: string[];
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files.');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Extract text content based on file type
    let textContent = '';
    
    if (file.type === 'text/plain') {
      textContent = await file.text();
    } else if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      try {
        const result: any = await extractText(uint8Array);
        // Some versions return { text }, others return string
        textContent = typeof result === 'string' ? result : (result?.text ?? '');
      } catch (e) {
        console.error('PDF text extraction failed:', e);
        throw new Error('Failed to extract text from PDF');
      }
    } else {
      // For DOCX and DOC files, attempt naive text extraction (may be limited)
      textContent = await file.text();
    }

    if (!textContent.trim()) {
      throw new Error('No text content could be extracted from the file');
    }

    console.log(`Extracted text length: ${textContent.length} characters`);

    // Parse the resume content with OpenAI
    const parseResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content: `You are a resume parsing expert. Extract candidate information from the provided resume text and return it as a JSON object.

Required format:
{
  "first_name": "string (required)",
  "last_name": "string (required)", 
  "email": "string (optional)",
  "phone": "string (optional)",
  "linkedin_url": "string (optional, full URL)",
  "skills": ["array of strings (optional)"],
  "notes": "string (optional, brief summary of experience/background)"
}

Rules:
- Always provide first_name and last_name
- If name is not clear, use "Unknown" for missing parts
- Clean phone numbers to include country code if possible
- Extract LinkedIn URL in full format (https://linkedin.com/in/username)
- Skills should be relevant technical/professional skills only
- Notes should be a brief 1-2 sentence summary
- Return valid JSON only, no additional text`
          },
          {
            role: 'user',
            content: `Parse this resume and extract candidate information:\n\n${textContent}`
          }
        ],
        max_completion_tokens: 800
      }),
    });

    if (!parseResponse.ok) {
      const errorData = await parseResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to parse resume content');
    }

    const parseData = await parseResponse.json();
    const parsedContent = parseData.choices[0]?.message?.content;

    if (!parsedContent) {
      throw new Error('No content returned from OpenAI');
    }

    console.log('OpenAI response:', parsedContent);

    // Parse the JSON response
    let candidateData: ParsedCandidate;
    try {
      candidateData = JSON.parse(parsedContent);
    } catch (jsonError) {
      console.error('Failed to parse JSON:', jsonError);
      console.error('Raw content:', parsedContent);
      throw new Error('Invalid JSON response from AI parser');
    }

    // Validate required fields
    if (!candidateData.first_name || !candidateData.last_name) {
      throw new Error('Could not extract required name information from resume');
    }

    // Clean and validate data
    const cleanedData: ParsedCandidate = {
      first_name: candidateData.first_name.trim(),
      last_name: candidateData.last_name.trim(),
      email: candidateData.email?.trim() || undefined,
      phone: candidateData.phone?.trim() || undefined,
      linkedin_url: candidateData.linkedin_url?.trim() || undefined,
      skills: candidateData.skills?.filter(skill => skill.trim()) || undefined,
      notes: candidateData.notes?.trim() || undefined,
    };

    console.log('Successfully parsed candidate:', cleanedData);

    return new Response(JSON.stringify({
      success: true,
      candidate: cleanedData,
      filename: file.name
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-resume function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});