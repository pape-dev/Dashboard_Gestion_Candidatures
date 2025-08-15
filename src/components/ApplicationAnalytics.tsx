import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Target, Calendar, MapPin, DollarSign, 
  Users, Award, Clock, Sparkles, Building
} from "lucide-react";

import { Application } from "@/contexts/AppContext";

interface ApplicationAnalyticsProps {
  applications: Application[];
  trigger: React.ReactNode;
}

const ApplicationAnalytics = ({ applications, trigger }: ApplicationAnalyticsProps) => {
  // Analytics calculations
  const statusData = applications.reduce((acc, app) => {
    const status = app.status || 'Non défini';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
    color: status === "En cours" ? "#3b82f6" : 
           status === "Entretien" ? "#10b981" :
           status === "Accepté" ? "#22c55e" :
           status === "Refusé" ? "#ef4444" : "#f59e0b"
  }));

  const locationData = applications.reduce((acc, app) => {
    const city = app.location ? app.location.split(',')[0].trim() : 'Non spécifié';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationChartData = Object.entries(locationData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([location, count]) => ({ location, count }));

  const monthlyData = applications.reduce((acc, app) => {
    const date = app.applied_date ? new Date(app.applied_date) : new Date(app.created_at);
    const month = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, count]) => ({ month, candidatures: count }));

  const priorityData = applications.reduce((acc, app) => {
    const priority = app.priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const salaryRanges = applications
    .filter(app => app.salary_min && app.salary_max)
    .map(app => ({
      min: app.salary_min!,
      max: app.salary_max!,
      company: app.company
    }));

  const avgSalaryMin = salaryRanges.length > 0 
    ? salaryRanges.reduce((sum, range) => sum + range.min, 0) / salaryRanges.length 
    : 0;
  const avgSalaryMax = salaryRanges.length > 0 
    ? salaryRanges.reduce((sum, range) => sum + range.max, 0) / salaryRanges.length 
    : 0;

  const responseRate = applications.filter(app => 
    app.status === "Entretien" || app.status === "Accepté"
  ).length / applications.length * 100;

  const successRate = applications.filter(app => app.status === "Accepté").length / applications.length * 100;

  // Remplacer les tags par les types d'entretiens ou autres métriques
  const companyData = applications.reduce((acc, app) => {
    acc[app.company] = (acc[app.company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCompaniesData = Object.entries(companyData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([company, count]) => ({ company, count }));
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Analytics des candidatures
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
              {applications.length} candidatures analysées
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Insights détaillés sur vos candidatures et performances
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-800">{responseRate.toFixed(1)}%</div>
                    <div className="text-sm text-blue-600">Taux de réponse</div>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-emerald-800">{successRate.toFixed(1)}%</div>
                    <div className="text-sm text-emerald-600">Taux de succès</div>
                  </div>
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-800">
                      {avgSalaryMin > 0 ? `${avgSalaryMin.toFixed(0)}-${avgSalaryMax.toFixed(0)}k€` : 'N/A'}
                    </div>
                    <div className="text-sm text-amber-600">Salaire moyen</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-800">{Object.keys(locationData).length}</div>
                    <div className="text-sm text-purple-600">Villes ciblées</div>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Répartition par statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {statusChartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Évolution temporelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyChartData}>
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="candidatures" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorApplications)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Répartition géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-amber-600" />
                  Entreprises ciblées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topCompaniesData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="company" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights Section */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-slate-600" />
                Insights personnalisés
              </CardTitle>
              <CardDescription>
                Recommandations basées sur vos données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {responseRate > 20 && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      <div className="font-semibold text-emerald-800">Excellent taux de réponse!</div>
                    </div>
                    <div className="text-sm text-emerald-700">
                      Votre taux de {responseRate.toFixed(1)}% est excellent. Continuez sur cette lancée!
                    </div>
                  </div>
                )}
                
                {Object.entries(priorityData).find(([priority]) => priority === "high")?.[1]! > applications.length * 0.5 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div className="font-semibold text-amber-800">Priorisez vos candidatures</div>
                    </div>
                    <div className="text-sm text-amber-700">
                      Beaucoup de candidatures haute priorité. Concentrez-vous sur les plus importantes.
                    </div>
                  </div>
                )}

                {Object.keys(locationData).length > 3 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div className="font-semibold text-blue-800">Diversification géographique</div>
                    </div>
                    <div className="text-sm text-blue-700">
                      Vous candidatez dans {Object.keys(locationData).length} villes différentes. Bonne stratégie!
                    </div>
                  </div>
                )}

                {applications.length === 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <div className="font-semibold text-blue-800">Commencez votre recherche</div>
                    </div>
                    <div className="text-sm text-blue-700">
                      Ajoutez votre première candidature pour commencer à analyser vos performances.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationAnalytics;