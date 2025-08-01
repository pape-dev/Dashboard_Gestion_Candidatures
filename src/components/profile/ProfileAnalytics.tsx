import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import { 
  TrendingUp, Target, Users, Calendar, 
  Eye, Download, Share2, Award, Briefcase, Star
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useApplications } from "@/hooks/useApplications";

const ProfileAnalytics = () => {
  const { profile, experiences, skills } = useProfile();
  const { applications, interviews, getStatistics } = useApplications();
  const stats = getStatistics();

  // Analytics data
  const profileCompleteness = () => {
    const fields = [
      profile?.first_name,
      profile?.last_name,
      profile?.title,
      profile?.bio,
      profile?.phone,
      profile?.location,
      profile?.avatar_url,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'autre';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const skillsChartData = Object.entries(skillsByCategory).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count,
    color: getSkillCategoryColor(category)
  }));

  const experienceYears = experiences.reduce((total, exp) => {
    const startDate = new Date(exp.start_date);
    const endDate = exp.end_date ? new Date(exp.end_date) : new Date();
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return total + years;
  }, 0);

  const monthlyActivity = [
    { month: "Jan", applications: 5, interviews: 2, responses: 3 },
    { month: "Fév", applications: 8, interviews: 3, responses: 5 },
    { month: "Mar", applications: 12, interviews: 4, responses: 7 },
    { month: "Avr", applications: 15, interviews: 6, responses: 9 },
  ];

  function getSkillCategoryColor(category: string) {
    switch (category) {
      case 'technique': return '#3b82f6';
      case 'soft': return '#10b981';
      case 'langue': return '#8b5cf6';
      case 'outils': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Complétude du profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-muted-foreground">{profileCompleteness()}%</span>
            </div>
            <Progress value={profileCompleteness()} className="w-full" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${profile?.avatar_url ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Photo de profil
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${profile?.bio ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Présentation
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${experiences.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Expérience
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${skills.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Compétences
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${profile?.phone ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Contact
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${profile?.linkedin_url ? 'bg-green-500' : 'bg-gray-300'}`} />
                  LinkedIn
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Expérience</p>
                <p className="text-lg font-semibold">{Math.round(experienceYears)} ans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Compétences</p>
                <p className="text-lg font-semibold">{skills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Candidatures</p>
                <p className="text-lg font-semibold">{stats.totalApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Entretiens</p>
                <p className="text-lg font-semibold">{stats.interviewsScheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Répartition des compétences</CardTitle>
          </CardHeader>
          <CardContent>
            {skillsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={skillsChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {skillsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Aucune compétence ajoutée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#3b82f6" name="Candidatures" />
                <Bar dataKey="interviews" fill="#10b981" name="Entretiens" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Accomplissements récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Profil complété à {profileCompleteness()}%</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {profileCompleteness() >= 80 ? "Excellent! Votre profil est très attractif." : "Continuez pour améliorer votre visibilité."}
                </p>
              </div>
            </div>
            
            {experiences.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    {Math.round(experienceYears)} années d'expérience ajoutées
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Votre expertise est bien documentée.</p>
                </div>
              </div>
            )}
            
            {skills.length >= 5 && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-200">
                    {skills.length} compétences maîtrisées
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Profil très complet et attractif.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileAnalytics;