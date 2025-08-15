import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";


const UpcomingInterviews = () => {
  const { interviews, loading, error } = useAppContext();

  // Filtrer les entretiens à venir
  const upcomingInterviews = interviews
    .filter(interview => new Date(interview.interview_date) >= new Date())
    .sort((a, b) => new Date(a.interview_date).getTime() - new Date(b.interview_date).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entretiens à venir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entretiens à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Erreur lors du chargement des entretiens</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmé':
        return 'default';
      case 'à confirmer':
        return 'secondary';
      case 'annulé':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entretiens à venir</CardTitle>
      </CardHeader>
      <CardContent>
        {interviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun entretien programmé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{interview.position}</h4>
                    <Badge variant={getStatusColor(interview.status || '')}>
                      {interview.status || 'Non défini'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {interview.company} • {interview.type || 'Type non spécifié'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(interview.interview_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {interview.interview_time} ({interview.duration || '1h'})
                    </div>
                    {interview.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {interview.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {interview.meeting_link && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">
                        <Video className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;