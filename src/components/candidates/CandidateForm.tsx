import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Star } from "lucide-react";
import { Candidate, CandidateFormData } from "@/hooks/useCandidates";

const candidateSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  resume_url: z.string().url("Invalid resume URL").optional().or(z.literal("")),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(['sourced', 'contacted', 'interview', 'offer', 'hired', 'rejected']).default('sourced'),
  notes: z.string().optional(),
});

interface CandidateFormProps {
  candidate?: Candidate;
  onSubmit: (data: CandidateFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const CandidateForm = ({ candidate, onSubmit, onCancel, isLoading }: CandidateFormProps) => {
  const [skills, setSkills] = useState<string[]>(candidate?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [rating, setRating] = useState<number | undefined>(candidate?.rating);

  const form = useForm<z.infer<typeof candidateSchema>>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      first_name: candidate?.first_name || '',
      last_name: candidate?.last_name || '',
      email: candidate?.email || '',
      phone: candidate?.phone || '',
      linkedin_url: candidate?.linkedin_url || '',
      resume_url: candidate?.resume_url || '',
      rating: candidate?.rating,
      status: candidate?.status || 'sourced',
      notes: candidate?.notes || '',
    },
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: z.infer<typeof candidateSchema>) => {
    const formData: CandidateFormData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      linkedin_url: data.linkedin_url || undefined,
      resume_url: data.resume_url || undefined,
      rating,
      status: data.status,
      skills: skills.length > 0 ? skills : undefined,
      notes: data.notes || undefined,
    };
    onSubmit(formData);
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              rating && star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground hover:text-yellow-400'
            }`}
            onClick={() => setRating(rating === star ? undefined : star)}
          />
        ))}
        {rating && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-5 px-2 ml-2 text-xs"
            onClick={() => setRating(undefined)}
          >
            Clear
          </Button>
        )}
      </div>
    );
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{candidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...form.register('first_name')}
              placeholder="John"
            />
            {form.formState.errors.first_name && (
              <p className="text-sm text-destructive">{form.formState.errors.first_name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...form.register('last_name')}
              placeholder="Doe"
            />
            {form.formState.errors.last_name && (
              <p className="text-sm text-destructive">{form.formState.errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="john.doe@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            {...form.register('linkedin_url')}
            placeholder="https://linkedin.com/in/johndoe"
          />
          {form.formState.errors.linkedin_url && (
            <p className="text-sm text-destructive">{form.formState.errors.linkedin_url.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume_url">Resume URL</Label>
          <Input
            id="resume_url"
            {...form.register('resume_url')}
            placeholder="https://example.com/resume.pdf"
          />
          {form.formState.errors.resume_url && (
            <p className="text-sm text-destructive">{form.formState.errors.resume_url.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStarRating()}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sourced">Sourced</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" onClick={addSkill} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeSkill(index)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            placeholder="Add any notes about this candidate..."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-gradient-neon">
            {isLoading ? 'Saving...' : (candidate ? 'Update Candidate' : 'Add Candidate')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};