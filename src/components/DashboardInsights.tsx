import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, Lightbulb, AlertTriangle, Trophy, 
  Zap, Clock, CheckCircle, TrendingUp
} from "lucide-react";

const DashboardInsights = () => {
  const insights = [
    {
      type: "success",
      icon: Trophy,
      title: "Performance exceptionnelle",
      message: "Votre taux de réponse est 30% au-dessus de la moyenne",
      action: "Voir détails",
      gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
      iconColor: "text-emerald-600"
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Attention recommandée",
      message: "3 candidatures sans suivi depuis plus de 7 jours",
      action: "Relancer maintenant",
      gradient: "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
      iconColor: "text-amber-600"
    },
    {
      type: "tip",
      icon: Lightbulb,
      title: "Conseil personnalisé",
      message: "Optimisez vos candidatures le mardi matin pour +25% de réponses",
      action: "En savoir plus",
      gradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      iconColor: "text-blue-600"
    }
  ];

  const goals = [
    {
      title: "Objectif hebdomadaire",
      current: 12,
      target: 15,
      unit: "candidatures",
      progress: 80,
      color: "bg-blue-600",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      title: "Entretiens ce mois",
      current: 4,
      target: 6,
      unit: "entretiens",
      progress: 67,
      color: "bg-emerald-600",
      textColor: "text-emerald-700 dark:text-emerald-300"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* AI Insights */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Brain className="h-5 w-5 text-purple-600" />
            Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg bg-gradient-to-r ${insight.gradient} border border-opacity-20`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-white/50 dark:bg-black/20">
                  <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${insight.iconColor}`}>
                      {insight.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.type === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {insight.type === "warning" && <Clock className="h-3 w-3 mr-1" />}
                      {insight.type === "tip" && <Zap className="h-3 w-3 mr-1" />}
                      {insight.type === "success" ? "Succès" : insight.type === "warning" ? "Action" : "Conseil"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {insight.message}
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress Goals */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Objectifs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-semibold ${goal.textColor}`}>
                  {goal.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {goal.current}/{goal.target}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>{goal.current} {goal.unit}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2">
                  <div 
                    className={`${goal.color} h-2 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plus que {goal.target - goal.current} {goal.unit} pour atteindre votre objectif
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardInsights;