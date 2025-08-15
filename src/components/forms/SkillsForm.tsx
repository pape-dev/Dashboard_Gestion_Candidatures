import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, type SkillFormData } from '@/lib/validation';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  Star, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/lib/security';

interface SkillsFormProps {
  skills: any[];
}

const SkillsForm = ({ skills }: SkillsFormProps) => {
  const { addSkill, updateSkill, deleteSkill, isAddingSkill, isUpdatingSkill, isDeletingSkill } = useProfile();
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: '',
      level: 3,
      category: '',
      years_of_experience: undefined,
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: SkillFormData) => {
    try {
    if (editingSkill) {
        await updateSkill({ id: editingSkill.id, updates: data });
        setEditingSkill(null);
    } else {
        await addSkill(data);
      }
      
      reset();
      setIsDialogOpen(false);
      toast({
        title: "Succès",
        description: editingSkill ? "Compétence mise à jour avec succès" : "Compétence ajoutée avec succès",
      });
    } catch (error) {
      handleSupabaseError(error, 'Compétence');
    }
  };

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    setValue('skill_name', skill.skill_name);
    setValue('level', skill.level);
    setValue('category', skill.category || '');
    setValue('years_of_experience', skill.years_of_experience || undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      toast({
        title: "Succès",
        description: "Compétence supprimée avec succès",
      });
    } catch (error) {
      handleSupabaseError(error, 'Suppression compétence');
    }
  };

  const handleCancel = () => {
    setEditingSkill(null);
    reset();
    clearErrors();
    setIsDialogOpen(false);
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return 'Débutant';
      case 2: return 'Intermédiaire';
      case 3: return 'Avancé';
      case 4: return 'Expert';
      case 5: return 'Maître';
      default: return 'Inconnu';
    }
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

  const getAverageLevel = () => {
    if (!skills || skills.length === 0) return 0;
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / skills.length);
  };

  const predefinedCategories = [
    'Développement Web',
    'Développement Mobile',
    'Base de données',
    'DevOps',
    'Design',
    'Gestion de projet',
    'Langues',
    'Soft Skills',
    'Autre'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compétences</h2>
          <p className="text-muted-foreground">
            Gérez vos compétences techniques et professionnelles
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSkill(null);
              reset();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une compétence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Modifier la compétence' : 'Ajouter une compétence'}
              </DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle compétence à votre profil
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skill_name">Nom de la compétence *</Label>
                <Input
                  id="skill_name"
                  {...register('skill_name')}
                  placeholder="Ex: React, TypeScript, Python..."
                />
                {errors.skill_name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.skill_name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau *</Label>
                  <Select
                    value={watchedValues.level?.toString()}
                    onValueChange={(value) => setValue('level', parseInt(value))}
                  >
                          <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le niveau" />
                          </SelectTrigger>
                        <SelectContent>
                      <SelectItem value="1">1 - Débutant</SelectItem>
                      <SelectItem value="2">2 - Intermédiaire</SelectItem>
                      <SelectItem value="3">3 - Avancé</SelectItem>
                      <SelectItem value="4">4 - Expert</SelectItem>
                      <SelectItem value="5">5 - Maître</SelectItem>
                        </SelectContent>
                      </Select>
                  {errors.level && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.level.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_of_experience">Années d'expérience</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    {...register('years_of_experience', { valueAsNumber: true })}
                    placeholder="Ex: 3"
                    min="0"
                    max="50"
                  />
                  {errors.years_of_experience && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.years_of_experience.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={watchedValues.category || ''}
                  onValueChange={(value) => setValue('category', value)}
                >
                          <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        <SelectContent>
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                        </SelectContent>
                      </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Aperçu du niveau */}
              {watchedValues.level && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Niveau sélectionné :</span>
                    <span className={`text-sm font-semibold ${getLevelColor(watchedValues.level)}`}>
                      {getLevelLabel(watchedValues.level)}
                    </span>
                  </div>
                  <Progress value={(watchedValues.level / 5) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Débutant</span>
                    <span>Maître</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                  </Button>
                  <Button 
                  type="submit"
                  disabled={!isDirty || isAddingSkill || isUpdatingSkill}
                >
                  {isAddingSkill || isUpdatingSkill ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {editingSkill ? 'Mettre à jour' : 'Ajouter'}
                    </>
                  )}
                  </Button>
                </div>
              </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      {skills?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total compétences</p>
                  <p className="text-2xl font-bold">{skills.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Niveau moyen</p>
                  <p className="text-2xl font-bold">{getAverageLevel()}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Expert (4-5)</p>
                  <p className="text-2xl font-bold">
                    {skills.filter(s => s.level >= 4).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compétences par catégorie */}
      {Object.keys(getSkillCategories()).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Compétences par catégorie</h3>
          {Object.entries(getSkillCategories()).map(([category, skillsList]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-base">{category}</CardTitle>
                <CardDescription>
                  {skillsList.length} compétence(s)
                </CardDescription>
      </CardHeader>
      <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skillsList.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.skill_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            Niveau {skill.level}
                        </Badge>
                        </div>
                        {skill.years_of_experience && (
                          <p className="text-xs text-muted-foreground">
                            {skill.years_of_experience} an(s) d'expérience
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(skill)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(skill.id)}
                          disabled={isDeletingSkill}
                        >
                          {isDeletingSkill ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                          <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Top compétences */}
      {getTopSkills().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top 5 des compétences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopSkills().map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.skill_name}</span>
                      <Badge variant="secondary" className="text-xs">
                        Niveau {skill.level}
                      </Badge>
                    </div>
                    <Progress value={(skill.level / 5) * 100} className="h-1 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* État vide */}
      {(!skills || skills.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucune compétence</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez vos compétences pour enrichir votre profil
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre première compétence
            </Button>
      </CardContent>
    </Card>
      )}
    </div>
  );
};

export default SkillsForm;