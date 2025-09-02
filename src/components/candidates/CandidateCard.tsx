import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Mail, 
  Phone, 
  Calendar, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Star,
  ExternalLink,
  FileDown
} from "lucide-react";
import { Candidate } from "@/hooks/useCandidates";
import { formatDistanceToNow } from "date-fns";

interface CandidateCardProps {
  candidate: Candidate;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidateId: string) => void;
  onStatusChange: (candidateId: string, status: Candidate['status']) => void;
}

export const CandidateCard = ({ candidate, onEdit, onDelete, onStatusChange }: CandidateCardProps) => {
  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'sourced':
        return 'bg-muted text-muted-foreground';
      case 'contacted':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'interview':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'offer':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'hired':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
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
    );
  };

  const initials = `${candidate.first_name[0]}${candidate.last_name[0]}`.toUpperCase();

  return (
    <Card className="bg-card border-border hover:shadow-card-hover transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt={`${candidate.first_name} ${candidate.last_name}`} />
              <AvatarFallback className="bg-gradient-subtle text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                {candidate.first_name} {candidate.last_name}
              </CardTitle>
              {renderStars(candidate.rating)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(candidate.status)}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(candidate)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {candidate.status !== 'contacted' && (
                  <DropdownMenuItem onClick={() => onStatusChange(candidate.id, 'contacted')}>
                    <Mail className="w-4 h-4 mr-2" />
                    Mark as Contacted
                  </DropdownMenuItem>
                )}
                {candidate.status !== 'interview' && (
                  <DropdownMenuItem onClick={() => onStatusChange(candidate.id, 'interview')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </DropdownMenuItem>
                )}
                {candidate.status !== 'hired' && candidate.status !== 'rejected' && (
                  <>
                    <DropdownMenuItem onClick={() => onStatusChange(candidate.id, 'offer')}>
                      <Star className="w-4 h-4 mr-2" />
                      Make Offer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(candidate.id, 'hired')}>
                      <Star className="w-4 h-4 mr-2" />
                      Mark as Hired
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete(candidate.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {candidate.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${candidate.email}`} className="hover:text-foreground transition-colors">
                {candidate.email}
              </a>
            </div>
          )}
          {candidate.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <a href={`tel:${candidate.phone}`} className="hover:text-foreground transition-colors">
                {candidate.phone}
              </a>
            </div>
          )}
          {candidate.linkedin_url && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="w-4 h-4" />
              <a 
                href={candidate.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
          {candidate.resume_url && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileDown className="w-4 h-4" />
              <a 
                href={candidate.resume_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
        
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{candidate.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {candidate.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {candidate.notes}
          </p>
        )}
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border">
          <Calendar className="w-3 h-3" />
          <span>Added {formatDistanceToNow(new Date(candidate.created_at), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
};