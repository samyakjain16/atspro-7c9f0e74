import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Pause,
  Play
} from "lucide-react";
import { Job } from "@/hooks/useJobs";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onStatusChange: (jobId: string, status: Job['status']) => void;
}

export const JobCard = ({ job, onEdit, onDelete, onStatusChange }: JobCardProps) => {
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-warning text-warning-foreground';
      case 'closed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return <Play className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      case 'closed':
        return <Eye className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-card border-border hover:shadow-card-hover transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(job.status)}>
              {getStatusIcon(job.status)}
              <span className="ml-1 capitalize">{job.status}</span>
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(job)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {job.status === 'active' && (
                  <DropdownMenuItem onClick={() => onStatusChange(job.id, 'paused')}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </DropdownMenuItem>
                )}
                {job.status === 'paused' && (
                  <DropdownMenuItem onClick={() => onStatusChange(job.id, 'active')}>
                    <Play className="w-4 h-4 mr-2" />
                    Activate
                  </DropdownMenuItem>
                )}
                {job.status !== 'closed' && (
                  <DropdownMenuItem onClick={() => onStatusChange(job.id, 'closed')}>
                    <Eye className="w-4 h-4 mr-2" />
                    Close
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete(job.id)}
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
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          )}
          {job.salary_range && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary_range}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        
        {job.description && (
          <p className="text-sm text-foreground line-clamp-2">
            {job.description}
          </p>
        )}
        
        {job.requirements && job.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.requirements.slice(0, 3).map((req, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
            {job.requirements.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{job.requirements.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};