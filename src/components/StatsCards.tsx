
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, Calendar, TrendingUp, Target,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Candidatures envoyées",
      value: "142",
      change: "+12%",
      changeType: "positive",
      icon: Briefcase,
      description: "Ce mois-ci"
    },
    {
      title: "Entretiens planifiés",
      value: "8",
      change: "+25%",
      changeType: "positive",
      icon: Calendar,
      description: "Cette semaine"
    },
    {
      title: "Taux de réponse",
      value: "18%",
      change: "+3%",
      changeType: "positive",
      icon: TrendingUp,
      description: "Moyenne mensuelle"
    },
    {
      title: "Objectif mensuel",
      value: "75%",
      change: "-5%",
      changeType: "negative",
      icon: Target,
      description: "28/40 candidatures"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
              <Badge 
                variant={stat.changeType === "positive" ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
