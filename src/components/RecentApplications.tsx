
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Calendar, ExternalLink, TrendingUp, Sparkles, ArrowRight, Clock } from "lucide-react";

const RecentApplications = () => {
  const { applications } = useAppContext();
  
  // Prendre les 5 candidatures les plus récentes
  const recentApplications = applications
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5)
    .map(app => ({
      ...app,
      companyLogo: app.logo,
      progress: getProgressFromStatus(app.status),
      nextAction: app.nextStep || "En attente"
    }));

  function getProgressFromStatus(status: string): number {
    switch (status) {
      case "En cours": return 25;
      case "Entretien": return 75;
      case "Accepté": return 100;
      case "Refusé": return 15;
      case "En attente": return 50;
      default: return 0;
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950";
      case "medium":
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-950";
      default:
        return "border-l-slate-500 bg-slate-50 dark:bg-slate-950";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-amber-500";
    return "bg-slate-400";
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl">
              <Building className="h-6 w-6 text-white" />
            </div>
            Candidatures récentes
            <Badge className="bg-blue-100/80 text-blue-800 border-blue-200 dark:bg-blue-900/80 dark:text-blue-200 shadow-sm">
              {applications.length} candidatures
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" className="border-blue-200/50 text-blue-700 hover:bg-blue-50/80 dark:border-blue-700/50 dark:text-blue-300 shadow-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {applications.map((app) => (
          <div key={app.id} className={`p-6 border-l-4 ${getPriorityColor(app.priority)} rounded-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 group hover:shadow-xl hover:scale-[1.02]`}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <Avatar className="h-14 w-14 ring-2 ring-white dark:ring-slate-700 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <AvatarImage src={app.companyLogo} alt={app.company} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                    {app.company[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-xl text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      {app.company}
                    </h4>
                    <Badge className={`${app.statusColor} shadow-sm`}>
                      {app.status}
                    </Badge>
                    {app.priority === "high" && (
                      <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    {app.position}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(app.appliedDate).toLocaleDateString("fr-FR", { 
                        day: "numeric", 
                        month: "short" 
                      })}
                    </div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {app.salary}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">
                <span>Progression</span>
                <span>{app.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 shadow-inner">
                <div 
                  className={`h-3 rounded-full transition-all duration-700 ease-out shadow-sm ${getProgressColor(app.progress)}`}
                  style={{ width: `${app.progress}%` }}
                />
              </div>
            </div>
            
            {/* Bottom section */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">Prochaine étape:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{app.nextAction}</span>
              </div>
              
              <div className="flex gap-2">
                {app.status === "En cours" || app.status === "En attente" ? (
                  <Button size="sm" className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    Suivre
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="text-sm border-slate-200/50 text-slate-600 hover:bg-slate-100/80 dark:border-slate-600/50 dark:text-slate-400 shadow-sm">
                    Détails
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Quick insights footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{applications.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Cette semaine</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-emerald-600">{applications.filter(app => ['En cours', 'Entretien'].includes(app.status)).length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">En cours</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-amber-600">{Math.round((applications.filter(app => app.status !== 'En attente').length / Math.max(applications.length, 1)) * 100)}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Taux de progression</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

        {recentApplications.map((app) => (
