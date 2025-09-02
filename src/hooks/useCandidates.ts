import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Candidate {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  resume_url?: string;
  skills?: string[];
  rating?: number;
  status: 'sourced' | 'contacted' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  resume_url?: string;
  skills?: string[];
  rating?: number;
  status: 'sourced' | 'contacted' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes?: string;
}

export const useCandidates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: candidates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['candidates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Candidate[];
    },
    enabled: !!user,
  });

  const createCandidateMutation = useMutation({
    mutationFn: async (candidateData: CandidateFormData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('candidates')
        .insert([{ ...candidateData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Candidate Added',
        description: 'New candidate has been added successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Adding Candidate',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateCandidateMutation = useMutation({
    mutationFn: async ({ id, ...candidateData }: Partial<Candidate> & { id: string }) => {
      const { data, error } = await supabase
        .from('candidates')
        .update(candidateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Candidate Updated',
        description: 'Candidate information has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Updating Candidate',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteCandidateMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Candidate Deleted',
        description: 'Candidate has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Deleting Candidate',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    candidates,
    isLoading,
    error,
    createCandidate: createCandidateMutation.mutate,
    updateCandidate: updateCandidateMutation.mutate,
    deleteCandidate: deleteCandidateMutation.mutate,
    isCreating: createCandidateMutation.isPending,
    isUpdating: updateCandidateMutation.isPending,
    isDeleting: deleteCandidateMutation.isPending,
  };
};