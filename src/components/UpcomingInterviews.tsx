import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Interview {
  id: string;
  position: string;
  company: string;
  interview_date: string;
  interview_time: string;
  location: string;
  meeting_link: string;
  type: string;
  status: string;
  interviewer: string;
  duration: string;
}

const UpcomingInterviews = () => {
  const { user } = useAuth();

  const { data: interviews = [], isLoading: loading, error } = useQuery({
    queryKey: ['upcoming-interviews', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .gte('interview_date', new Date().toISOString().split('T')[0])
        .order('interview_date', { ascending: true })
        .order('interview_time', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as Interview[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

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
    switch (status.toLowerCase()) {
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
          <p className="text-muted-foreground">Aucun entretien programmé</p>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{interview.position}</h4>
                    <Badge variant={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {interview.company} • {interview.type}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(interview.interview_date), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {interview.interview_time} ({interview.duration})
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