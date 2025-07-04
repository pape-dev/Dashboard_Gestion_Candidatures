
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, FileText, Users, Target, Zap, Sparkles } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Nouvelle candidature",
      description: "Ajouter une candidature",
      icon: Plus,
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
      action: () => console.log("Nouvelle candidature"),
      badge: "Rapide",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      title: "Chercher emplois",
      description: "Explorer les offres",
      icon: Search,
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
      action: () => console.log("Chercher emplois"),
      badge: "IA",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
    },
    {
      title: "Planifier entretien",
      description: "Ajouter au calendrier",
      icon: Calendar,
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700",
      action: () => console.log("Planifier entretien"),
      badge: "Urgent",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    },
    {
      title: "Mettre à jour CV",
      description: "Modifier le profil",
      icon: FileText,
      gradient: "from-amber-500 to-amber-600",
      hoverGradient: "hover:from-amber-600 hover:to-amber-700",
      action: () => console.log("Mettre à jour CV"),
      badge: "Pro",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    },
    {
      title: "Ajouter contact",
      description: "Nouveau contact réseau",
      icon: Users,
      gradient: "from-pink-500 to-pink-600",
      hoverGradient: "hover:from-pink-600 hover:to-pink-700",
      action: () => console.log("Ajouter contact"),
      badge: "Réseau",
      badgeColor: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
    },
    {
      title: "Créer tâche",
      description: "Nouvelle tâche de suivi",
      icon: Target,
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
      action: () => console.log("Créer tâche"),
      badge: "Suivi",
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
    }
  ];

  return (
    <Card className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          Actions rapides
          <div className="flex items-center gap-1 ml-auto">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Optimisé IA</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <div key={index} className="group relative">
              <Button
                variant="outline"
                className="w-full h-auto p-0 border-0 bg-white dark:bg-slate-800 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
                onClick={action.action}
              >
                <div className="w-full p-6 relative">
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`text-xs px-2 py-1 ${action.badgeColor} border-0`}>
                      {action.badge}
                    </Badge>
                  </div>
                  
                  {/* Icon */}
                  <div className={`mb-4 mx-auto w-14 h-14 rounded-2xl bg-gradient-to-r ${action.gradient} ${action.hoverGradient} flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center space-y-2">
                    <div className="font-bold text-base text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      {action.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      {action.description}
                    </div>
                  </div>
                  
                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${action.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </Button>
            </div>
          ))}
        </div>
        
        {/* Bottom stats */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">47</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Actions cette semaine</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-emerald-600">12</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Objectifs atteints</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Taux de réalisation</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
