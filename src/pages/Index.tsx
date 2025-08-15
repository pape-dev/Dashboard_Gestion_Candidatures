import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Target, Sparkles, Crown, ArrowUpRight, Activity, 
  Users, Calendar, Briefcase, CheckCircle, Clock, AlertTriangle
} from "lucide-react";
import QuickActions from "@/components/QuickActions";
import RecentApplications from "@/components/RecentApplications";
import UpcomingInterviews from "@/components/UpcomingInterviews";
import StatsCards from "@/components/StatsCards";
import DashboardInsights from "@/components/DashboardInsights";
import WeeklyActivity from "@/components/WeeklyActivity";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const { applications, interviews, tasks, getStatistics, loading } = useAppContext();
  const { user } = useAuth();
  const stats = getStatistics();
  
  console.log('🔍 Index: Rendu avec applications:', applications?.length, 'interviews:', interviews?.length, 'tasks:', tasks?.length);
  console.log('🔍 Index: Stats calculées:', stats);
  
  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Chargement...</h2>
            <p className="text-slate-600 dark:text-slate-400">Préparation de vos données...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Données pour les graphiques avec calculs réels
  const applicationData = [
    { month: "Jan", sent: 0, responses: 0, interviews: 0, efficiency: 0 },
    { month: "Fév", sent: 0, responses: 0, interviews: 0, efficiency: 0 },
    { month: "Mar", sent: 0, responses: 0, interviews: 0, efficiency: 0 },
    { month: "Avr", sent: 0, responses: 0, interviews: 0, efficiency: 0 },
    { month: "Mai", sent: 0, responses: 0, interviews: 0, efficiency: 0 },
    { month: "Juin", sent: applications.length, responses: stats.activeApplications, interviews: stats.interviewsScheduled, efficiency: stats.responseRate }
  ];

  const trendData = [
    { week: "S1", success: 0 },
    { week: "S2", success: 0 },
    { week: "S3", success: 0 },
    { week: "S4", success: 0 },
    { week: "S5", success: 0 },
    { week: "S6", success: stats.responseRate }
  ];

  const statusData = [
    { name: "En attente", value: applications.filter(app => app.status === "En attente").length, color: "#f59e0b" },
    { name: "Entretien", value: applications.filter(app => app.status === "Entretien").length, color: "#3b82f6" },
    { name: "Refusé", value: applications.filter(app => app.status === "Refusé").length, color: "#ef4444" },
    { name: "Accepté", value: applications.filter(app => app.status === "Accepté").length, color: "#10b981" }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Premium avec design amélioré */}
        <div className="relative overflow-hidden">
          {/* Background avec pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50" />
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-20" />
          
          <div className="relative p-8 lg:p-12">
            <div className="flex items-start justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-2xl ring-4 ring-blue-500/20">
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent leading-tight">
                      Bonjour {user?.user_metadata?.first_name || 'Professionnel'}
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                      Pilotez votre recherche d'emploi avec intelligence
                    </p>
                  </div>
                </div>
                
                {/* KPIs en temps réel */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalApplications}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Candidatures</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.interviewsScheduled}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Entretiens</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.responseRate}%</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Taux réponse</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.activeApplications}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Actives</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Badge Premium */}
              <div className="hidden lg:block">
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 dark:from-amber-900 dark:via-amber-800 dark:to-amber-900 rounded-2xl border border-amber-300 dark:border-amber-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Crown className="h-6 w-6 text-amber-600" />
                  <div>
                    <div className="text-base font-bold text-amber-800 dark:text-amber-200">JobTracker Pro</div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">Tableau de bord professionnel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques principales */}
        <StatsCards />

        {/* Insights IA et objectifs */}
        <DashboardInsights />

        {/* Actions rapides */}
        <QuickActions />

        {/* Section graphiques avec design professionnel */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Graphique principal - Performance */}
          <Card className="xl:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Performance des candidatures
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Évolution mensuelle de votre activité
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 px-3 py-1 shadow-lg">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +18% ce mois
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={applicationData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sent" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorSent)"
                  strokeWidth={4}
                  name="Candidatures envoyées"
                />
                <Area 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorResponses)"
                  strokeWidth={4}
                  name="Réponses reçues"
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Métriques en bas du graphique */}
            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{applicationData[applicationData.length - 1].sent}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Candidatures ce mois</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{applicationData[applicationData.length - 1].responses}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Réponses obtenues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{applicationData[applicationData.length - 1].efficiency}%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Taux d'efficacité</div>
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Sidebar avec métriques et statuts */}
          <div className="space-y-6">
            {/* Statuts des candidatures */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  Répartition
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3 mt-4">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full shadow-sm" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Tendance de réussite */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  Tendance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis 
                      dataKey="week" 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="success" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2 }}
                      name="Score de réussite"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Progression excellente</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      +25% cette semaine
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activité hebdomadaire */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklyActivity />
          </div>
          <div>
            {/* Actions rapides compactes */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                  <Briefcase className="h-4 w-4 mr-3" />
                  Nouvelle candidature
                </Button>
                <Button variant="outline" className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Calendar className="h-4 w-4 mr-3" />
                  Planifier entretien
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Users className="h-4 w-4 mr-3" />
                  Ajouter contact
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section candidatures récentes et entretiens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentApplications />
          <UpcomingInterviews />
        </div>
      </div>
    </Layout>
  );
};

export default Index;