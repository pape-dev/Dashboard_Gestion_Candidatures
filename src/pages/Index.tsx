
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  TrendingUp, Target
} from "lucide-react";
import QuickActions from "@/components/QuickActions";
import RecentApplications from "@/components/RecentApplications";
import UpcomingInterviews from "@/components/UpcomingInterviews";
import StatsCards from "@/components/StatsCards";

const Index = () => {
  // Données de démonstration pour les graphiques
  const applicationData = [
    { month: "Jan", sent: 15, responses: 3, interviews: 1 },
    { month: "Fév", sent: 22, responses: 7, interviews: 2 },
    { month: "Mar", sent: 18, responses: 5, interviews: 3 },
    { month: "Avr", sent: 25, responses: 8, interviews: 4 },
    { month: "Mai", sent: 30, responses: 12, interviews: 6 },
    { month: "Juin", sent: 28, responses: 10, interviews: 5 }
  ];

  const statusData = [
    { name: "En attente", value: 45, color: "#f59e0b" },
    { name: "Entretien", value: 12, color: "#3b82f6" },
    { name: "Refusé", value: 28, color: "#ef4444" },
    { name: "Accepté", value: 5, color: "#10b981" }
  ];

  return (
    <Layout>
      {/* En-tête du dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Gérez efficacement vos candidatures et suivez vos progrès
        </p>
      </div>

      {/* Cartes de statistiques */}
      <StatsCards />

      {/* Actions rapides */}
      <QuickActions />

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique des candidatures */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Évolution des candidatures
            </CardTitle>
            <CardDescription>
              Suivi mensuel de vos candidatures et réponses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3b82f6" name="Envoyées" />
                <Bar dataKey="responses" fill="#10b981" name="Réponses" />
                <Bar dataKey="interviews" fill="#f59e0b" name="Entretiens" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des statuts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Statut des candidatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section candidatures récentes et entretiens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentApplications />
        <UpcomingInterviews />
      </div>
    </Layout>
  );
};

export default Index;
