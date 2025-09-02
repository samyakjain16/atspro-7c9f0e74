import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location?: string;
  salary_range?: string;
  description?: string;
  requirements?: string[];
  status: 'active' | 'paused' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface JobFormData {
  title: string;
  company: string;
  location?: string;
  salary_range?: string;
  description?: string;
  requirements?: string[];
  status: 'active' | 'paused' | 'closed';
}

export const useJobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
    enabled: !!user,
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: JobFormData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .insert([{ ...jobData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: 'Job Created',
        description: 'Job posting has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Creating Job',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, ...jobData }: Partial<Job> & { id: string }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: 'Job Updated',
        description: 'Job posting has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Updating Job',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: 'Job Deleted',
        description: 'Job posting has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Deleting Job',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    jobs,
    isLoading,
    error,
    createJob: createJobMutation.mutate,
    updateJob: updateJobMutation.mutate,
    deleteJob: deleteJobMutation.mutate,
    isCreating: createJobMutation.isPending,
    isUpdating: updateJobMutation.isPending,
    isDeleting: deleteJobMutation.isPending,
  };
};