import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Download, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  MapPin, 
  Globe,
  BarChart3,
  Activity,
  Target,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ProfileAnalytics = () => {
  const { analytics, profile, experiences, skills, documents } = useProfile();

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionVariant = (percentage: number) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const getExperienceLevel = (years: number) => {
    if (years < 2) return { label: 'Junior', color: 'bg-blue-100 text-blue-800' };
    if (years < 5) return { label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' };
    if (years < 10) return { label: 'Senior', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Expert', color: 'bg-red-100 text-red-800' };
  };

  const getSkillCategories = () => {
    const categories = skills?.reduce((acc, skill) => {
      const category = skill.category || 'Autre';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
    return acc;
    }, {} as Record<string, any[]>);
    
    return categories || {};
  };

  const getTopSkills = () => {
    return skills
      ?.sort((a, b) => b.level - a.level)
      .slice(0, 5) || [];
  };

  const getRecentExperiences = () => {
    return experiences
      ?.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      .slice(0, 3) || [];
  };

  const getDocumentStats = () => {
    const stats = {
      total: documents?.length || 0,
      cv: documents?.filter(d => d.type === 'cv').length || 0,
      portfolio: documents?.filter(d => d.type === 'portfolio').length || 0,
      certificates: documents?.filter(d => d.type === 'certificate').length || 0,
    };
    return stats;
  };

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues du profil</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{analytics?.profile_views || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
        </CardContent>
      </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Téléchargements CV</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.cv_downloads || 0}</div>
            <p className="text-xs text-muted-foreground">
              +8% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expériences</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{experiences?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {getRecentExperiences().length} récentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compétences</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {getTopSkills().length} principales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Complétion du profil */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Complétion du profil
          </CardTitle>
          <CardDescription>
            Améliorez votre profil pour augmenter vos chances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${getCompletionColor(analytics?.profile_completion_percentage || 0)}`}>
                {analytics?.profile_completion_percentage || 0}%
              </div>
              <Badge variant={getCompletionVariant(analytics?.profile_completion_percentage || 0)}>
                {analytics?.profile_completion_percentage >= 80 ? 'Excellent' : 
                 analytics?.profile_completion_percentage >= 60 ? 'Bon' : 'À améliorer'}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Dernière mise à jour: {analytics?.last_profile_update ? 
                formatDistanceToNow(new Date(analytics.last_profile_update), { 
                  addSuffix: true, 
                  locale: fr 
                }) : 'Jamais'}
            </div>
          </div>
          <Progress value={analytics?.profile_completion_percentage || 0} className="h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Informations manquantes</h4>
              <div className="space-y-1">
                {!profile?.bio && <div className="text-sm text-red-600">• Bio</div>}
                {!profile?.phone && <div className="text-sm text-red-600">• Téléphone</div>}
                {!profile?.location && <div className="text-sm text-red-600">• Localisation</div>}
                {!profile?.linkedin_url && <div className="text-sm text-red-600">• LinkedIn</div>}
                {!profile?.github_url && <div className="text-sm text-red-600">• GitHub</div>}
                {!profile?.portfolio_url && <div className="text-sm text-red-600">• Portfolio</div>}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Suggestions d'amélioration</h4>
              <div className="space-y-1">
                {experiences?.length < 2 && <div className="text-sm text-blue-600">• Ajouter plus d'expériences</div>}
                {skills?.length < 5 && <div className="text-sm text-blue-600">• Compléter vos compétences</div>}
                {getDocumentStats().total < 2 && <div className="text-sm text-blue-600">• Ajouter des documents</div>}
                {!profile?.availability && <div className="text-sm text-blue-600">• Spécifier votre disponibilité</div>}
              </div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compétences par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Compétences par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(getSkillCategories()).map(([category, skillsList]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">{skillsList.length} compétences</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skillsList.slice(0, 3).map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-xs">
                        {skill.skill_name} (Niveau {skill.level}/5)
                      </Badge>
                    ))}
                    {skillsList.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{skillsList.length - 3} autres
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getDocumentStats().cv}</div>
                  <div className="text-sm text-blue-600">CV</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getDocumentStats().portfolio}</div>
                  <div className="text-sm text-green-600">Portfolios</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{getDocumentStats().certificates}</div>
                  <div className="text-sm text-yellow-600">Certificats</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{getDocumentStats().total}</div>
                  <div className="text-sm text-purple-600">Total</div>
                </div>
              </div>
              
              {documents?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Documents récents</h4>
                  {documents.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expériences récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Expériences récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecentExperiences().map((experience) => (
              <div key={experience.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{experience.title}</h4>
                    {experience.is_current && (
                      <Badge variant="default" className="text-xs">Actuel</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{experience.company}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(experience.start_date).toLocaleDateString('fr-FR')} - 
                      {experience.end_date ? new Date(experience.end_date).toLocaleDateString('fr-FR') : 'Présent'}
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {experience.location}
                      </div>
                    )}
                  </div>
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {experience.technologies.slice(0, 5).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {experience.technologies.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{experience.technologies.length - 5} autres
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {getRecentExperiences().length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune expérience ajoutée</p>
                <p className="text-sm">Ajoutez vos expériences pour améliorer votre profil</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Award className="h-6 w-6" />
              <span>Ajouter une expérience</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Target className="h-6 w-6" />
              <span>Ajouter des compétences</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Uploader un document</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileAnalytics;