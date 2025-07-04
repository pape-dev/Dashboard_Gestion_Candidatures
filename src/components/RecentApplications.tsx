
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Calendar, ExternalLink, TrendingUp, Sparkles, ArrowRight, Clock } from "lucide-react";

const RecentApplications = () => {
  const applications = [
    {
      id: 1,
      company: "TechCorp",
      position: "Développeur Frontend",
      status: "En cours",
      appliedDate: "2024-01-15",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300",
      companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=64&h=64&fit=crop&crop=center",
      salary: "55-65k €",
      progress: 75,
      priority: "high",
      nextAction: "Entretien technique"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "UX Designer",
      status: "Entretien",
      appliedDate: "2024-01-12",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center",
      salary: "45-55k €",
      progress: 90,
      priority: "high",
      nextAction: "2ème tour"
    },
    {
      id: 3,
      company: "DataCorp",
      position: "Data Analyst",
      status: "Refusé",
      appliedDate: "2024-01-10",
      statusColor: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300",
      companyLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=64&h=64&fit=crop&crop=center",
      salary: "40-50k €",
      progress: 25,
      priority: "low",
      nextAction: "Feedback reçu"
    },
    {
      id: 4,
      company: "InnovLab",
      position: "Product Manager",
      status: "En attente",
      appliedDate: "2024-01-08",
      statusColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-300",
      companyLogo: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=64&h=64&fit=crop&crop=center",
      salary: "60-70k €",
      progress: 35,
      priority: "medium",
      nextAction: "Relance prévue"
    },
    {
      id: 5,
      company: "WebAgency",
      position: "Développeur Full Stack",
      status: "En cours",
      appliedDate: "2024-01-05",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300",
      companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=64&h=64&fit=crop&crop=center",
      salary: "50-60k €",
      progress: 60,
      priority: "medium",
      nextAction: "Test technique"
    }
  ];

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
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Building className="h-5 w-5 text-white" />
            </div>
            Candidatures récentes
            <Badge className="bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-800 dark:text-blue-200">
              {applications.length} candidatures
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300">
            <TrendingUp className="h-4 w-4 mr-2" />
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className={`p-5 border-l-4 ${getPriorityColor(app.priority)} rounded-xl backdrop-blur-sm bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 group hover:shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-700 shadow-lg">
                  <AvatarImage src={app.companyLogo} alt={app.company} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                    {app.company[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      {app.company}
                    </h4>
                    <Badge className={app.statusColor}>
                      {app.status}
                    </Badge>
                    {app.priority === "high" && (
                      <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {app.position}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(app.appliedDate).toLocaleDateString("fr-FR", { 
                        day: "numeric", 
                        month: "short" 
                      })}
                    </div>
                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {app.salary}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 transition-opacity">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Progression</span>
                <span>{app.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressColor(app.progress)}`}
                  style={{ width: `${app.progress}%` }}
                />
              </div>
            </div>
            
            {/* Bottom section */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">Prochaine étape:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{app.nextAction}</span>
              </div>
              
              <div className="flex gap-2">
                {app.status === "En cours" || app.status === "En attente" ? (
                  <Button size="sm" className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                    Suivre
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400">
                    Détails
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Quick insights footer */}
        <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">5</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Cette semaine</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-emerald-600">2</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">En cours</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-amber-600">60%</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Taux de progression</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplications;
