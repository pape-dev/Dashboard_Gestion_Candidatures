import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, type ExperienceFormData } from '@/lib/validation';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Building, 
  Briefcase, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/lib/security';

interface ExperienceFormProps {
  experiences: any[];
}

const ExperienceForm = ({ experiences }: ExperienceFormProps) => {
  const { addExperience, updateExperience, deleteExperience, isAddingExperience, isUpdatingExperience, isDeletingExperience } = useProfile();
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: [],
      technologies: [],
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: ExperienceFormData) => {
    try {
    if (editingExperience) {
        await updateExperience({ id: editingExperience.id, updates: data });
        setEditingExperience(null);
    } else {
        await addExperience(data);
      }
      
      reset();
      setIsDialogOpen(false);
      toast({
        title: "Succès",
        description: editingExperience ? "Expérience mise à jour avec succès" : "Expérience ajoutée avec succès",
      });
    } catch (error) {
      handleSupabaseError(error, 'Expérience');
    }
  };

  const handleEdit = (experience: any) => {
    setEditingExperience(experience);
    setValue('title', experience.title);
    setValue('company', experience.company);
    setValue('location', experience.location || '');
    setValue('start_date', experience.start_date);
    setValue('end_date', experience.end_date || '');
    setValue('is_current', experience.is_current);
    setValue('description', experience.description || '');
    setValue('achievements', experience.achievements || []);
    setValue('technologies', experience.technologies || []);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id);
      toast({
        title: "Succès",
        description: "Expérience supprimée avec succès",
      });
    } catch (error) {
      handleSupabaseError(error, 'Suppression expérience');
    }
  };

  const handleCancel = () => {
    setEditingExperience(null);
    reset();
    clearErrors();
    setIsDialogOpen(false);
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      const currentTechnologies = watchedValues.technologies || [];
      setValue('technologies', [...currentTechnologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    const currentTechnologies = watchedValues.technologies || [];
    setValue('technologies', currentTechnologies.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      const currentAchievements = watchedValues.achievements || [];
      setValue('achievements', [...currentAchievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = watchedValues.achievements || [];
    setValue('achievements', currentAchievements.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getDuration = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : (endDate ? new Date(endDate) : new Date());
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expériences professionnelles</h2>
          <p className="text-muted-foreground">
            Gérez vos expériences professionnelles pour enrichir votre profil
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingExperience(null);
              reset();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une expérience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations de votre expérience professionnelle
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du poste *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Ex: Développeur Full Stack"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise *</Label>
                  <Input
                    id="company"
                    {...register('company')}
                    placeholder="Ex: Google"
                  />
                  {errors.company && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Ex: Paris, France"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register('start_date')}
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.start_date.message}
                    </p>
                  )}
                </div>
                </div>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    {...register('end_date')}
                    disabled={watchedValues.is_current}
                  />
                  {errors.end_date && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.end_date.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="is_current"
                    checked={watchedValues.is_current}
                    onCheckedChange={(checked) => setValue('is_current', checked as boolean)}
                  />
                  <Label htmlFor="is_current">Poste actuel</Label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                        <Textarea 
                  id="description"
                  {...register('description')}
                          placeholder="Décrivez vos responsabilités et réalisations..."
                          rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Technologies */}
              <div className="space-y-4">
                <Label>Technologies utilisées</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Ex: React, TypeScript"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} size="sm">
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(watchedValues.technologies || []).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                    type="button" 
                        onClick={() => removeTechnology(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Réalisations */}
              <div className="space-y-4">
                <Label>Réalisations principales</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Ex: Développement d'une application web"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                  />
                  <Button type="button" onClick={addAchievement} size="sm">
                    Ajouter
                  </Button>
                </div>
                <div className="space-y-2">
                  {(watchedValues.achievements || []).map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="flex-1 text-sm">• {achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || isAddingExperience || isUpdatingExperience}
                >
                  {isAddingExperience || isUpdatingExperience ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {editingExperience ? 'Mettre à jour' : 'Ajouter'}
                    </>
                  )}
                  </Button>
                </div>
              </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des expériences */}
      <div className="space-y-4">
        {experiences?.length > 0 ? (
          experiences.map((experience) => (
            <Card key={experience.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{experience.title}</h3>
                      {experience.is_current && (
                        <Badge variant="default" className="text-xs">Actuel</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {experience.company}
                      </div>
                      {experience.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {experience.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(experience.start_date)} - 
                        {experience.is_current ? 'Présent' : formatDate(experience.end_date || '')}
                        <span className="text-xs">
                          ({getDuration(experience.start_date, experience.end_date, experience.is_current)} an(s))
                        </span>
                      </div>
                    </div>

                    {experience.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {experience.description}
                      </p>
                    )}

                    {experience.technologies && experience.technologies.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
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
                      </div>
                    )}

                    {experience.achievements && experience.achievements.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Réalisations :</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {experience.achievements.slice(0, 3).map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                          {experience.achievements.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{experience.achievements.length - 3} autres réalisations
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(experience.id)}
                      disabled={isDeletingExperience}
                    >
                      {isDeletingExperience ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                      <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucune expérience</h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez vos expériences professionnelles pour enrichir votre profil
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre première expérience
              </Button>
            </CardContent>
          </Card>
          )}
        </div>
    </div>
  );
};

export default ExperienceForm;