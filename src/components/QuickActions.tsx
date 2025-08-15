import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, FileText, Users, Target, Zap, Sparkles } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "@/components/ApplicationForm";
import InterviewForm from "@/components/InterviewForm";
import TaskForm from "@/components/TaskForm";
import ContactForm from "@/components/ContactForm";

const QuickActions = () => {
  const navigate = useNavigate();
  const { getStatistics } = useAppContext();
  const stats = getStatistics();
  
  const actions = [
    {
      title: "Nouvelle candidature",
      description: "Ajouter une candidature",
      icon: Plus,
      gradient: "from-blue-500 to-blue-600",
      component: ApplicationForm,
      badge: "Rapide",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      title: "Planifier entretien",
      description: "Ajouter au calendrier",
      icon: Calendar,
      gradient: "from-purple-500 to-purple-600",
      component: InterviewForm,
      badge: "Urgent",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    {
      title: "Ajouter contact",
      description: "Nouveau contact réseau",
      icon: Users,
      gradient: "from-pink-500 to-pink-600",
      component: ContactForm,
      badge: "Réseau",
      badgeColor: "bg-pink-100 text-pink-700"
    },
    {
      title: "Créer tâche",
      description: "Nouvelle tâche de suivi",
      icon: Target,
      gradient: "from-indigo-500 to-indigo-600",
      component: TaskForm,
      badge: "Suivi",
      badgeColor: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Chercher emplois",
      description: "Explorer les offres",
      icon: Search,
      gradient: "from-emerald-500 to-emerald-600",
      action: () => navigate("/job-search"),
      badge: "IA",
      badgeColor: "bg-emerald-100 text-emerald-700"
    },
    {
      title: "Mettre à jour CV",
      description: "Modifier le profil",
      icon: FileText,
      gradient: "from-amber-500 to-amber-600",
      action: () => navigate("/profile"),
      badge: "Pro",
      badgeColor: "bg-amber-100 text-amber-700"
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
          {actions.map((action, index) => {
            const ActionComponent = action.component;
            
            if (ActionComponent) {
              return (
                <div key={index} className="group relative">
                  <ActionComponent>
                    <Button
                      variant="outline"
                      className="w-full h-auto p-0 border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden rounded-2xl"
                    >
                      <div className="w-full p-8 relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                        
                        <div className="absolute top-4 right-4">
                          <Badge className={`text-xs px-3 py-1 ${action.badgeColor} border-0 shadow-lg`}>
                            {action.badge}
                          </Badge>
                        </div>
                        
                        <div className={`mb-6 mx-auto w-16 h-16 rounded-3xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <action.icon className="h-8 w-8 text-white" />
                        </div>
                        
                        <div className="text-center space-y-3">
                          <div className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                            {action.title}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors leading-relaxed">
                            {action.description}
                          </div>
                        </div>
                        
                        <div className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r ${action.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
                      </div>
                    </Button>
                  </ActionComponent>
                </div>
              );
            } else {
              return (
                <div key={index} className="group relative">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-0 border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden rounded-2xl"
                    onClick={action.action}
                  >
                    <div className="w-full p-8 relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                      
                      <div className="absolute top-4 right-4">
                        <Badge className={`text-xs px-3 py-1 ${action.badgeColor} border-0 shadow-lg`}>
                          {action.badge}
                        </Badge>
                      </div>
                      
                      <div className={`mb-6 mx-auto w-16 h-16 rounded-3xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="text-center space-y-3">
                        <div className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                          {action.title}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors leading-relaxed">
                          {action.description}
                        </div>
                      </div>
                      
                      <div className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r ${action.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
                    </div>
                  </Button>
                </div>
              );
            }
          })}
        </div>
        
        {/* Bottom stats */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{stats.totalApplications}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Candidatures</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">{stats.activeApplications}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Actives</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-blue-600">{stats.responseRate}%</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Taux réponse</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;