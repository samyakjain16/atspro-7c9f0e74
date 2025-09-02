import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Star } from "lucide-react";
import { Candidate } from "@/hooks/useCandidates";

interface CandidateFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: Candidate['status'] | 'all';
  onStatusFilterChange: (value: Candidate['status'] | 'all') => void;
  ratingFilter: number | 'all';
  onRatingFilterChange: (value: number | 'all') => void;
  skillFilter: string;
  onSkillFilterChange: (value: string) => void;
  availableSkills: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const CandidateFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  ratingFilter,
  onRatingFilterChange,
  skillFilter,
  onSkillFilterChange,
  availableSkills,
  onClearFilters,
  hasActiveFilters,
}: CandidateFiltersProps) => {
  const renderStarOption = (rating: number) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
      <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sourced':
        return 'bg-muted text-muted-foreground';
      case 'contacted':
        return 'bg-blue-500/10 text-blue-500';
      case 'interview':
        return 'bg-amber-500/10 text-amber-500';
      case 'offer':
        return 'bg-purple-500/10 text-purple-500';
      case 'hired':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/20 border-border focus:border-primary"
          />
        </div>
        
        <div className="flex gap-2 items-center flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sourced">Sourced</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ratingFilter.toString()} onValueChange={(value) => onRatingFilterChange(value === 'all' ? 'all' : parseInt(value))}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {renderStarOption(rating)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {availableSkills.length > 0 && (
            <Select value={skillFilter} onValueChange={onSkillFilterChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Skills</SelectItem>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchTerm}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge className={`flex items-center gap-1 ${getStatusColor(statusFilter)}`}>
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onStatusFilterChange('all')}
              />
            </Badge>
          )}
          {ratingFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {ratingFilter} Star{ratingFilter !== 1 ? 's' : ''}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onRatingFilterChange('all')}
              />
            </Badge>
          )}
          {skillFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Skill: {skillFilter}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onSkillFilterChange('')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};