
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, FileText, Users, Target, Zap, Sparkles } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getStatistics } = useAppContext();
  const stats = getStatistics();
  
  const actions = [
    {
      title: "Nouvelle candidature",
      description: "Ajouter une candidature",
      icon: Plus,
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
      action: () => navigate("/applications"),
      badge: "Rapide",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      title: "Chercher emplois",
      description: "Explorer les offres",
      icon: Search,
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
      action: () => navigate("/job-search"),
      badge: "IA",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
    },
    {
      title: "Planifier entretien",
      description: "Ajouter au calendrier",
      icon: Calendar,
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700",
      action: () => navigate("/calendar"),
      badge: "Urgent",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    },
    {
      title: "Mettre à jour CV",
      description: "Modifier le profil",
      icon: FileText,
      gradient: "from-amber-500 to-amber-600",
      hoverGradient: "hover:from-amber-600 hover:to-amber-700",
      action: () => navigate("/profile"),
      badge: "Pro",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    },
    {
      title: "Ajouter contact",
      description: "Nouveau contact réseau",
      icon: Users,
      gradient: "from-pink-500 to-pink-600",
      hoverGradient: "hover:from-pink-600 hover:to-pink-700",
      action: () => navigate("/contacts"),
      badge: "Réseau",
      badgeColor: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
    },
    {
      title: "Créer tâche",
      description: "Nouvelle tâche de suivi",
      icon: Target,
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
      action: () => navigate("/tasks"),
      badge: "Suivi",
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
    }
  ];

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 shadow-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          Actions rapides
          <div className="flex items-center gap-1 ml-auto">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Optimisé IA</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <div key={index} className="group relative">
              <Button
                variant="outline"
                className="w-full h-auto p-0 border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden rounded-2xl"
                onClick={action.action}
              >
                <div className="w-full p-8 relative">
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`text-xs px-3 py-1 ${action.badgeColor} border-0 shadow-lg`}>
                      {action.badge}
                    </Badge>
                  </div>
                  
                  {/* Icon */}
                  <div className={`mb-6 mx-auto w-16 h-16 rounded-3xl bg-gradient-to-r ${action.gradient} ${action.hoverGradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center space-y-3">
                    <div className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      {action.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors leading-relaxed">
                      {action.description}
                    </div>
                  </div>
                  
                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r ${action.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
                </div>
              </Button>
            </div>
          ))}
        </div>
        
        {/* Bottom stats */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{stats.totalApplications}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Actions cette semaine</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">{stats.activeApplications}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Objectifs atteints</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-blue-600">{stats.responseRate}%</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Taux de réalisation</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
