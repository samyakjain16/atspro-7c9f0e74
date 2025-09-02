import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Briefcase } from "lucide-react";
import { useJobs, Job, JobFormData } from "@/hooks/useJobs";
import { JobCard } from "@/components/jobs/JobCard";
import { JobForm } from "@/components/jobs/JobForm";
import { JobFilters } from "@/components/jobs/JobFilters";

const Jobs = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');
  
  const { 
    jobs, 
    isLoading, 
    createJob, 
    updateJob, 
    deleteJob, 
    isCreating, 
    isUpdating 
  } = useJobs();

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: JobFormData) => {
    if (editingJob) {
      updateJob({ id: editingJob.id, ...data });
    } else {
      createJob(data);
    }
    setIsFormOpen(false);
    setEditingJob(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  const handleStatusChange = (jobId: string, status: Job['status']) => {
    updateJob({ id: jobId, status });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
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
              Job Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your job postings and track applications
            </p>
          </div>
          <Button onClick={handleCreateJob} className="bg-gradient-neon">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="mb-6">
          <JobFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-subtle rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {jobs.length === 0 ? 'No jobs posted yet' : 'No jobs match your filters'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {jobs.length === 0 
                ? 'Start by posting your first job opening to attract top talent.'
                : 'Try adjusting your search terms or filters to find what you\'re looking for.'
              }
            </p>
            {jobs.length === 0 && (
              <Button onClick={handleCreateJob} className="bg-gradient-neon">
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEditJob}
                onDelete={deleteJob}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <JobForm
            job={editingJob}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isCreating || isUpdating}
          />
        </Dialog>
      </main>
    </div>
  );
};

export default Jobs;