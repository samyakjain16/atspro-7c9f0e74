import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Users, Upload } from "lucide-react";
import { useCandidates, Candidate, CandidateFormData } from "@/hooks/useCandidates";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { CandidateForm } from "@/components/candidates/CandidateForm";
import { CandidateFilters } from "@/components/candidates/CandidateFilters";
import { ResumeUpload } from "@/components/candidates/ResumeUpload";

const Candidates = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResumeUploadOpen, setIsResumeUploadOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Candidate['status'] | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState('');
  
  const { 
    candidates, 
    isLoading, 
    createCandidate, 
    updateCandidate, 
    deleteCandidate, 
    isCreating, 
    isUpdating 
  } = useCandidates();

  // Extract all unique skills from candidates
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    candidates.forEach(candidate => {
      candidate.skills?.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = !searchTerm || 
        candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      const matchesRating = ratingFilter === 'all' || candidate.rating === ratingFilter;
      const matchesSkill = !skillFilter || candidate.skills?.includes(skillFilter);
      
      return matchesSearch && matchesStatus && matchesRating && matchesSkill;
    });
  }, [candidates, searchTerm, statusFilter, ratingFilter, skillFilter]);

  const handleCreateCandidate = () => {
    setEditingCandidate(null);
    setIsFormOpen(true);
  };

  const handleResumeUpload = () => {
    setIsResumeUploadOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: CandidateFormData) => {
    if (editingCandidate) {
      updateCandidate({ id: editingCandidate.id, ...data });
    } else {
      createCandidate(data);
    }
    setIsFormOpen(false);
    setEditingCandidate(null);
  };

  const handleResumeFormSubmit = (data: CandidateFormData) => {
    createCandidate(data);
    setIsResumeUploadOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCandidate(null);
  };

  const handleResumeUploadCancel = () => {
    setIsResumeUploadOpen(false);
  };

  const handleStatusChange = (candidateId: string, status: Candidate['status']) => {
    updateCandidate({ id: candidateId, status });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRatingFilter('all');
    setSkillFilter('');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || ratingFilter !== 'all' || skillFilter !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              Candidate Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your candidate pipeline
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleResumeUpload} 
              variant="outline" 
              className="hover:shadow-neon-sm transition-shadow"
            >
              <Upload className="w-4 h-4 mr-2" />
              Parse Resume
            </Button>
            <Button onClick={handleCreateCandidate} className="bg-gradient-neon">
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <CandidateFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            ratingFilter={ratingFilter}
            onRatingFilterChange={setRatingFilter}
            skillFilter={skillFilter}
            onSkillFilterChange={setSkillFilter}
            availableSkills={availableSkills}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-subtle rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {candidates.length === 0 ? 'No candidates added yet' : 'No candidates match your filters'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {candidates.length === 0 
                ? 'Start building your talent pipeline by adding your first candidate.'
                : 'Try adjusting your search terms or filters to find what you\'re looking for.'
              }
            </p>
            {candidates.length === 0 && (
              <div className="flex gap-4">
                <Button onClick={handleCreateCandidate} className="bg-gradient-neon">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Candidate
                </Button>
                <Button onClick={handleResumeUpload} variant="outline" className="hover:shadow-neon-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Parse Resume
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onEdit={handleEditCandidate}
                onDelete={deleteCandidate}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <CandidateForm
            candidate={editingCandidate}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isCreating || isUpdating}
          />
        </Dialog>

        <Dialog open={isResumeUploadOpen} onOpenChange={setIsResumeUploadOpen}>
          <ResumeUpload
            onCancel={handleResumeUploadCancel}
            onSaveCandidate={handleResumeFormSubmit}
            isLoading={isCreating}
          />
        </Dialog>
      </main>
    </div>
  );
};

export default Candidates;