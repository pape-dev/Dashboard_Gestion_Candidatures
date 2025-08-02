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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* AI Insights */}
      <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            Insights IA
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Alimenté par IA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {insights.map((insight, index) => (
            <div key={index} className={`p-6 rounded-2xl bg-gradient-to-r ${insight.gradient} border border-opacity-20 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-black/30 shadow-lg">
                  <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-lg ${insight.iconColor}`}>
                      {insight.title}
                    </h4>
                    <Badge variant="outline" className="text-xs shadow-sm">
                      {insight.type === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {insight.type === "warning" && <Clock className="h-3 w-3 mr-1" />}
                      {insight.type === "tip" && <Zap className="h-3 w-3 mr-1" />}
                      {insight.type === "success" ? "Succès" : insight.type === "warning" ? "Action" : "Conseil"}
                    </Badge>
                  </div>
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {insight.message}
                  </p>
                  <Button variant="outline" size="sm" className="text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300">
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress Goals */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            Objectifs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <h4 className={`text-base font-bold ${goal.textColor}`}>
                  {goal.title}
                </h4>
                <Badge variant="outline" className="text-sm font-semibold shadow-sm">
                  {goal.current}/{goal.target}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span>{goal.current} {goal.unit}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/80 dark:bg-black/30 rounded-full h-3 shadow-inner">
                  <div 
                    className={`${goal.color} h-3 rounded-full transition-all duration-700 ease-out shadow-sm`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
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