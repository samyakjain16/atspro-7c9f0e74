import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  User,
  Mail,
  Phone,
  Linkedin,
  Star,
  Brain,
  RefreshCw,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CandidateFormData } from "@/hooks/useCandidates";

interface ParsedCandidate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  skills?: string[];
  notes?: string;
  current_role?: string;
  education?: string;
  location?: string;
  experience_years?: number;
}

interface ResumeParseResponse {
  success: boolean;
  candidate?: ParsedCandidate;
  error?: string;
  found_fields?: string[];
  message?: string;
}

interface ResumeUploadProps {
  onCancel: () => void;
  onSaveCandidate: (candidate: CandidateFormData) => void;
  isLoading: boolean;
}

export const ResumeUpload = ({ onCancel, onSaveCandidate, isLoading }: ResumeUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCandidate | null>(null);
  const [foundFields, setFoundFields] = useState<string[]>([]);
  const [parseMessage, setParseMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 2;

  const resetState = () => {
    setParsedData(null);
    setFoundFields([]);
    setParseMessage('');
    setError(null);
    setUploadProgress(0);
    setFilename('');
    setParsing(false);
    setRetryCount(0);
  };

  const parseResumeWithRetry = async (file: File, attempt: number = 1): Promise<ResumeParseResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('parse-resume', {
        body: formData,
      });

      if (functionError) {
        throw new Error(functionError.message || `Parse attempt ${attempt} failed`);
      }

      if (!data) {
        throw new Error('No data received from parsing service');
      }

      return data as ResumeParseResponse;
    } catch (error) {
      console.error(`Parse attempt ${attempt} failed:`, error);
      
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying parse attempt ${attempt + 1}/${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        return parseResumeWithRetry(file, attempt + 1);
      }
      
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    resetState();
    setParsing(true);
    setFilename(file.name);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      // Parse with retry logic
      const result = await parseResumeWithRetry(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!result.success) {
        throw new Error(result.error || 'Failed to parse resume');
      }

      if (!result.candidate) {
        throw new Error('No candidate data extracted from resume');
      }

      // Additional validation - check if we have at least some basic info
      if (!result.candidate.first_name && !result.candidate.last_name) {
        throw new Error('No candidate name found in resume. Please ensure the resume contains clear name information.');
      }

      setParsedData(result.candidate);
      setFoundFields(result.found_fields || []);
      setParseMessage(result.message || `Successfully extracted ${Object.keys(result.candidate).length} fields`);
      
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Resume parsing error:', err);
      
      let errorMessage = 'An unexpected error occurred while parsing the resume.';
      
      if (err instanceof Error) {
        if (err.message.includes('File size exceeds')) {
          errorMessage = 'File is too large. Please use a PDF smaller than 10MB.';
        } else if (err.message.includes('insufficient text')) {
          errorMessage = 'Could not extract text from PDF. Please ensure the PDF contains selectable text (not a scanned image).';
        } else if (err.message.includes('Only PDF files are supported')) {
          errorMessage = 'Please upload a PDF file only.';
        } else if (err.message.includes('does not appear to contain a resume')) {
          errorMessage = 'The PDF does not appear to contain resume information.';
        } else if (err.message.includes('OpenAI API') || err.message.includes('AI parsing') || err.message.includes('Resume analysis')) {
          errorMessage = 'AI analysis service temporarily unavailable. Please try again in a moment.';
        } else if (err.message.includes('candidate name') || err.message.includes('No candidate information')) {
          errorMessage = err.message;
        } else {
          errorMessage = `Parsing failed: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB for PDFs
    disabled: parsing
  });

  const handleSaveCandidate = () => {
    if (!parsedData) return;

    const candidateData: CandidateFormData = {
      first_name: parsedData.first_name || '',
      last_name: parsedData.last_name || '',
      email: parsedData.email,
      phone: parsedData.phone,
      linkedin_url: parsedData.linkedin_url,
      skills: parsedData.skills,
      notes: parsedData.notes,
      status: 'sourced',
    };

    // Only include fields that have values
    Object.keys(candidateData).forEach(key => {
      const value = candidateData[key as keyof CandidateFormData];
      if (value === undefined || value === '') {
        delete candidateData[key as keyof CandidateFormData];
      }
    });

    onSaveCandidate(candidateData);
  };

  const handleRetry = () => {
    resetState();
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-neon-blue" />
          PDF Resume Parser
        </DialogTitle>
        <DialogDescription>
          Upload a PDF resume to automatically extract candidate details using AI.
          <br />
          <span className="text-sm text-muted-foreground mt-1 block">
            <strong>Supported format:</strong> PDF only • <strong>Max size:</strong> 10MB • <strong>Processing time:</strong> 10-30 seconds
          </span>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {!parsedData && !parsing && !error && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-border hover:border-primary/50 hover:bg-muted/20'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-neon rounded-full flex items-center justify-center shadow-neon-md">
                <Upload className="w-8 h-8 text-background" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? 'Drop your PDF here' : 'Upload PDF for AI Analysis'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our AI will automatically extract candidate information from your PDF resume
                </p>
                <div className="flex justify-center mb-4">
                  <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">PDF Only</Badge>
                </div>
                <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
                  Choose PDF to Parse
                </Button>
              </div>
            </div>
          </div>
        )}

        {parsing && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-neon-blue/20 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-neon-blue animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Processing PDF</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our advanced AI is analyzing "{filename}" and extracting candidate information...
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Parsing Progress</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                <span>Extracting text from PDF...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
                <span>Analyzing content with AI...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                <span>Extracting candidate information...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Parsing Failed
              </AlertDescription>
            </Alert>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-foreground mb-3">{error}</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Troubleshooting tips:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Ensure the PDF contains selectable text (not scanned images)</li>
                  <li>Check that candidate information is clearly visible</li>
                  <li>Try using a different PDF if the current one is corrupted</li>
                  <li>For scanned PDFs, use OCR software to convert to searchable text first</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {parsedData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle className="w-5 h-5" />
              <div>
                <span className="font-medium">Resume Successfully Parsed!</span>
                <p className="text-sm text-muted-foreground">{parseMessage}</p>
              </div>
            </div>

            {/* Found Fields Summary */}
            <div className="bg-neon-green/5 border border-neon-green/20 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span className="text-sm font-medium text-neon-green">
                  Found Information ({foundFields.length} fields detected)
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {foundFields.map((field, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-neon-green/10 text-neon-green border-neon-green/20">
                    {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-gradient-subtle rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-neon-blue" />
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Extracted Information
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {(parsedData.first_name || parsedData.last_name) && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {[parsedData.first_name, parsedData.last_name].filter(Boolean).join(' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                    </div>
                  </div>
                )}

                {parsedData.email && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{parsedData.email}</p>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                    </div>
                  </div>
                )}

                {parsedData.phone && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{parsedData.phone}</p>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                    </div>
                  </div>
                )}

                {parsedData.linkedin_url && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <a 
                        href={parsedData.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                      <p className="text-xs text-muted-foreground">Professional Network</p>
                    </div>
                  </div>
                )}

                {parsedData.current_role && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{parsedData.current_role}</p>
                      <p className="text-xs text-muted-foreground">Current Role</p>
                    </div>
                  </div>
                )}

                {parsedData.location && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{parsedData.location}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                  </div>
                )}

                {parsedData.education && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{parsedData.education}</p>
                      <p className="text-xs text-muted-foreground">Education</p>
                    </div>
                  </div>
                )}

                {parsedData.experience_years !== undefined && (
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{parsedData.experience_years} years</p>
                      <p className="text-xs text-muted-foreground">Experience</p>
                    </div>
                  </div>
                )}
              </div>

              {parsedData.skills && parsedData.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-neon-purple" />
                    <p className="text-sm font-medium">Extracted Skills & Technologies</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-neon-purple/10 text-neon-purple border-neon-purple/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {parsedData.notes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-neon-cyan" />
                    <p className="text-sm font-medium">Professional Summary</p>
                  </div>
                  <div className="bg-background/70 rounded-lg p-3 border border-border/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {parsedData.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Alert className="bg-neon-blue/5 border-neon-blue/20">
              <Brain className="h-4 w-4 text-neon-blue" />
              <AlertDescription className="text-sm">
                <strong>Parsing Complete!</strong> Only the information found in the resume has been extracted. 
                You can edit or add any missing details after saving the candidate.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onCancel} disabled={parsing}>
            Cancel
          </Button>
          
          {error && (
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="hover:shadow-neon-sm transition-shadow"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {parsedData && (
            <Button 
              onClick={handleSaveCandidate} 
              disabled={isLoading}
              className="bg-gradient-neon hover:shadow-neon-md transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Candidate
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
};