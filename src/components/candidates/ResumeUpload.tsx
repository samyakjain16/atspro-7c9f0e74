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
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CandidateFormData } from "@/hooks/useCandidates";

interface ParsedCandidate {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  skills?: string[];
  notes?: string;
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
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setParsing(true);
    setUploadProgress(0);
    setFilename(file.name);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const formData = new FormData();
      formData.append('file', file);

      const { data, error: functionError } = await supabase.functions.invoke('parse-resume', {
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (functionError) {
        throw new Error(functionError.message || 'Failed to parse resume');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      setParsedData(data.candidate);
      
    } catch (err) {
      console.error('Resume parsing error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSaveCandidate = () => {
    if (!parsedData) return;

    const candidateData: CandidateFormData = {
      first_name: parsedData.first_name,
      last_name: parsedData.last_name,
      email: parsedData.email,
      phone: parsedData.phone,
      linkedin_url: parsedData.linkedin_url,
      skills: parsedData.skills,
      notes: parsedData.notes,
      status: 'sourced',
    };

    onSaveCandidate(candidateData);
  };

  const resetUpload = () => {
    setParsedData(null);
    setError(null);
    setUploadProgress(0);
    setFilename('');
    setParsing(false);
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Parse Resume with AI</DialogTitle>
        <DialogDescription>
          Upload a PDF, DOCX, DOC or TXT file to extract candidate details automatically.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {!parsedData && !parsing && !error && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop your resume here' : 'Upload Resume'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your resume, or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="secondary">PDF</Badge>
              <Badge variant="secondary">DOCX</Badge>
              <Badge variant="secondary">DOC</Badge>
              <Badge variant="secondary">TXT</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum file size: 10MB
            </p>
          </div>
        )}

        {parsing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Processing: {filename}</p>
                <p className="text-sm text-muted-foreground">
                  AI is analyzing your resume...
                </p>
              </div>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {parsedData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Resume parsed successfully!</span>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Extracted Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    {parsedData.first_name} {parsedData.last_name}
                  </span>
                </div>

                {parsedData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{parsedData.email}</span>
                  </div>
                )}

                {parsedData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{parsedData.phone}</span>
                  </div>
                )}

                {parsedData.linkedin_url && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={parsedData.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              {parsedData.skills && parsedData.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {parsedData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {parsedData.notes && (
                <div>
                  <p className="text-sm font-medium mb-2">Summary:</p>
                  <p className="text-sm text-muted-foreground bg-background rounded p-3">
                    {parsedData.notes}
                  </p>
                </div>
              )}
            </div>

            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                Review the extracted information and save the candidate to your database.
                You can edit the details later if needed.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {parsedData && (
            <>
              <Button variant="ghost" onClick={resetUpload}>
                <X className="w-4 h-4 mr-2" />
                Try Another
              </Button>
              <Button 
                onClick={handleSaveCandidate} 
                disabled={isLoading}
                className="bg-gradient-neon"
              >
                {isLoading ? 'Saving...' : 'Save Candidate'}
              </Button>
            </>
          )}
        </div>
      </div>
    </DialogContent>
  );
};