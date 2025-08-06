import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const RecentApplications = () => {
  const { applications, loading, error } = useApplications();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Candidatures récentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
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
          <CardTitle>Candidatures récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Erreur lors du chargement des candidatures</p>
        </CardContent>
      </Card>
    );
  }

  const recentApplications = applications
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepté':
        return 'default';
      case 'rejeté':
        return 'destructive';
      case 'en cours':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidatures récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recentApplications.length === 0 ? (
          <p className="text-muted-foreground">Aucune candidature récente</p>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{application.position}</h4>
                    <Badge variant={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {application.company} • {application.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(application.applied_date), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {application.job_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={application.job_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
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

export default RecentApplications;