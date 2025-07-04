
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Target, Sparkles, Crown
} from "lucide-react";
import QuickActions from "@/components/QuickActions";
import RecentApplications from "@/components/RecentApplications";
import UpcomingInterviews from "@/components/UpcomingInterviews";
import StatsCards from "@/components/StatsCards";
import DashboardInsights from "@/components/DashboardInsights";
import WeeklyActivity from "@/components/WeeklyActivity";

const Index = () => {
  // Données de démonstration pour les graphiques
  const applicationData = [
    { month: "Jan", sent: 15, responses: 3, interviews: 1, efficiency: 20 },
    { month: "Fév", sent: 22, responses: 7, interviews: 2, efficiency: 32 },
    { month: "Mar", sent: 18, responses: 5, interviews: 3, efficiency: 28 },
    { month: "Avr", sent: 25, responses: 8, interviews: 4, efficiency: 32 },
    { month: "Mai", sent: 30, responses: 12, interviews: 6, efficiency: 40 },
    { month: "Juin", sent: 28, responses: 10, interviews: 5, efficiency: 36 }
  ];

  const trendData = [
    { week: "S1", success: 15 },
    { week: "S2", success: 25 },
    { week: "S3", success: 18 },
    { week: "S4", success: 35 },
    { week: "S5", success: 28 },
    { week: "S6", success: 42 }
  ];

  const statusData = [
    { name: "En attente", value: 45, color: "#f59e0b" },
    { name: "Entretien", value: 12, color: "#3b82f6" },
    { name: "Refusé", value: 28, color: "#ef4444" },
    { name: "Accepté", value: 5, color: "#10b981" }
  ];

  return (
    <Layout>
      {/* En-tête du dashboard premium */}
      <div className="mb-8 relative">
        <div className="absolute top-0 right-0">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-full">
            <Crown className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Premium Dashboard</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-3">
          Tableau de bord
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Gérez efficacement vos candidatures avec une intelligence artificielle avancée
        </p>
      </div>

      {/* Cartes de statistiques améliorées */}
      <StatsCards />

      {/* Insights IA et objectifs */}
      <DashboardInsights />

      {/* Actions rapides */}
      <QuickActions />

      {/* Contenu principal avec graphiques améliorés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique d'évolution des candidatures */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Évolution des candidatures
              <div className="ml-auto">
                <div className="flex items-center gap-1 text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-medium">+18% ce mois</span>
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Suivi intelligent de vos performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={applicationData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sent" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorSent)"
                  strokeWidth={3}
                  name="Candidatures envoyées"
                />
                <Area 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorResponses)"
                  strokeWidth={3}
                  name="Réponses reçues"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendance de réussite */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Target className="h-5 w-5 text-emerald-600" />
              Tendance de réussite
              <div className="ml-auto">
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Excellente progression</span>
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-emerald-600 dark:text-emerald-400">
              Score de réussite hebdomadaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="week" stroke="#047857" />
                <YAxis stroke="#047857" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#065f46',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f0fdf4'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#047857', strokeWidth: 2 }}
                  name="Score de réussite"
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">42</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Score actuel</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">+18%</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Amélioration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">🎯</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Objectif atteint</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité hebdomadaire et statuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <WeeklyActivity />
        
        {/* Répartition des statuts améliorée */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Target className="h-5 w-5 text-indigo-600" />
              Répartition des candidatures
            </CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-400">
              Vue d'ensemble de vos candidatures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1b4b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#e0e7ff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold text-indigo-800 dark:text-indigo-200">{item.value}</span>
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
