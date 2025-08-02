
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, Calendar, TrendingUp, Target,
  ArrowUpRight, ArrowDownRight, Sparkles
} from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Candidatures envoyées",
      value: "142",
      change: "+12%",
      changeType: "positive",
      icon: Briefcase,
      description: "Ce mois-ci",
      gradient: "from-blue-50/80 to-blue-100/80 dark:from-blue-950/80 dark:to-blue-900/80",
      iconBg: "bg-blue-600",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      title: "Entretiens planifiés",
      value: "8",
      change: "+25%",
      changeType: "positive",
      icon: Calendar,
      description: "Cette semaine",
      gradient: "from-emerald-50/80 to-emerald-100/80 dark:from-emerald-950/80 dark:to-emerald-900/80",
      iconBg: "bg-emerald-600",
      textColor: "text-emerald-700 dark:text-emerald-300"
    },
    {
      title: "Taux de réponse",
      value: "18%",
      change: "+3%",
      changeType: "positive",
      icon: TrendingUp,
      description: "Moyenne mensuelle",
      gradient: "from-purple-50/80 to-purple-100/80 dark:from-purple-950/80 dark:to-purple-900/80",
      iconBg: "bg-purple-600",
      textColor: "text-purple-700 dark:text-purple-300"
    },
    {
      title: "Objectif mensuel",
      value: "75%",
      change: "-5%",
      changeType: "negative",
      icon: Target,
      description: "28/40 candidatures",
      gradient: "from-amber-50/80 to-amber-100/80 dark:from-amber-950/80 dark:to-amber-900/80",
      iconBg: "bg-amber-600",
      textColor: "text-amber-700 dark:text-amber-300"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:shadow-2xl hover:scale-105 transition-all duration-500 group`}>
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4">
            <div className={`p-3 rounded-2xl ${stat.iconBg} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <CardHeader className="pb-4 pt-6">
            <CardTitle className={`text-sm font-bold ${stat.textColor} uppercase tracking-wider`}>
              {stat.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 pb-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className={`text-4xl font-bold ${stat.textColor} group-hover:scale-110 transition-transform duration-500`}>
                  {stat.value}
                </div>
                <p className={`text-sm ${stat.textColor} opacity-80 font-medium`}>
                  {stat.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3">
              <Badge 
                variant={stat.changeType === "positive" ? "default" : "destructive"}
                className={`flex items-center gap-1 shadow-lg ${
                  stat.changeType === "positive" 
                    ? "bg-green-100/90 text-green-800 border-green-200 dark:bg-green-900/90 dark:text-green-300" 
                    : "bg-red-100/90 text-red-800 border-red-200 dark:bg-red-900/90 dark:text-red-300"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </Badge>
              
              {stat.changeType === "positive" && index === 1 && (
                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span className="font-medium">Excellent!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
