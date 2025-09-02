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
import { X, Plus } from "lucide-react";
import { Job, JobFormData } from "@/hooks/useJobs";

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  salary_range: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'paused', 'closed']).default('active'),
});

interface JobFormProps {
  job?: Job;
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const JobForm = ({ job, onSubmit, onCancel, isLoading }: JobFormProps) => {
  const [requirements, setRequirements] = useState<string[]>(job?.requirements || []);
  const [newRequirement, setNewRequirement] = useState('');

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      salary_range: job?.salary_range || '',
      description: job?.description || '',
      status: job?.status || 'active',
    },
  });

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: z.infer<typeof jobSchema>) => {
    const formData: JobFormData = {
      title: data.title,
      company: data.company,
      location: data.location || undefined,
      salary_range: data.salary_range || undefined,
      description: data.description || undefined,
      status: data.status,
      requirements: requirements.length > 0 ? requirements : undefined,
    };
    onSubmit(formData);
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{job ? 'Edit Job' : 'Post New Job'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="e.g. Senior Software Engineer"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              {...form.register('company')}
              placeholder="e.g. Tech Corp"
            />
            {form.formState.errors.company && (
              <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...form.register('location')}
              placeholder="e.g. New York, NY"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary_range">Salary Range</Label>
            <Input
              id="salary_range"
              {...form.register('salary_range')}
              placeholder="e.g. $80,000 - $120,000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Requirements</Label>
          <div className="flex gap-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="Add a requirement..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRequirement();
                }
              }}
            />
            <Button type="button" onClick={addRequirement} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {requirements.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {requirements.map((req, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {req}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeRequirement(index)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-gradient-neon">
            {isLoading ? 'Saving...' : (job ? 'Update Job' : 'Post Job')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};