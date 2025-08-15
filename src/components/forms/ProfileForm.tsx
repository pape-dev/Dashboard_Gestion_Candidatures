import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from '@/lib/validation';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Upload, User, MapPin, Phone, Globe, Linkedin, Github, Twitter, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProfileFormProps {
  profile: any;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
  const { updateProfile, uploadAvatar, isUpdatingProfile, isUploadingAvatar } = useProfile();
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      title: profile?.title || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      website: profile?.website || '',
      linkedin_url: profile?.linkedin_url || '',
      github_url: profile?.github_url || '',
      twitter_url: profile?.twitter_url || '',
      portfolio_url: profile?.portfolio_url || '',
      years_of_experience: profile?.years_of_experience || undefined,
      preferred_work_type: profile?.preferred_work_type || [],
      salary_expectations_min: profile?.salary_expectations_min || undefined,
      salary_expectations_max: profile?.salary_expectations_max || undefined,
      currency: profile?.currency || 'EUR',
      availability: profile?.availability || undefined,
      languages: profile?.languages || [],
    }
  });

  const watchedValues = watch();
  const completionPercentage = calculateCompletionPercentage(watchedValues);

  const onSubmit = async (data: ProfileFormData) => {
    try {
    await updateProfile(data);
      reset(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      toast({
        title: "Erreur",
        description: "Le fichier est trop volumineux. Taille maximum: 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erreur",
        description: "Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadAvatar(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const addLanguage = () => {
    const currentLanguages = watchedValues.languages || [];
    setValue('languages', [...currentLanguages, '']);
  };

  const removeLanguage = (index: number) => {
    const currentLanguages = watchedValues.languages || [];
    setValue('languages', currentLanguages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, value: string) => {
    const currentLanguages = watchedValues.languages || [];
    const updatedLanguages = [...currentLanguages];
    updatedLanguages[index] = value;
    setValue('languages', updatedLanguages);
  };

  const addWorkType = (type: string) => {
    const currentTypes = watchedValues.preferred_work_type || [];
    if (!currentTypes.includes(type)) {
      setValue('preferred_work_type', [...currentTypes, type]);
    }
  };

  const removeWorkType = (type: string) => {
    const currentTypes = watchedValues.preferred_work_type || [];
    setValue('preferred_work_type', currentTypes.filter(t => t !== type));
  };

  return (
    <div className="space-y-6">
      {/* Header avec progression */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Informations personnelles</CardTitle>
              <CardDescription>
                Complétez votre profil pour augmenter vos chances
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Complétion du profil</div>
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo de profil */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Photo de profil
        </CardTitle>
      </CardHeader>
      <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} alt="Photo de profil" />
                <AvatarFallback className="text-lg">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                    Changer la photo
                  </div>
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                <p className="text-sm text-muted-foreground">
                  Formats acceptés: JPEG, PNG, WebP (max 5MB)
                </p>
                {isUploadingAvatar && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Téléchargement en cours...
                  </div>
            )}
          </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  {...register('first_name')}
                  placeholder="Votre prénom"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  {...register('last_name')}
                  placeholder="Votre nom"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre professionnel *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: Développeur Full Stack, Designer UX/UI..."
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Présentez-vous en quelques lignes..."
                rows={4}
              />
              {errors.bio && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+33 6 12 34 56 78"
                    className="pl-10"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Paris, France"
                    className="pl-10"
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Réseaux sociaux */}
        <Card>
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin_url"
                  {...register('linkedin_url')}
                  placeholder="https://linkedin.com/in/votre-profil"
                  className="pl-10"
                />
              </div>
              {errors.linkedin_url && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.linkedin_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub</Label>
              <div className="relative">
                <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github_url"
                  {...register('github_url')}
                  placeholder="https://github.com/votre-username"
                  className="pl-10"
                />
              </div>
              {errors.github_url && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.github_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter_url"
                  {...register('twitter_url')}
                  placeholder="https://twitter.com/votre-username"
                  className="pl-10"
                />
              </div>
              {errors.twitter_url && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.twitter_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="portfolio_url"
                  {...register('portfolio_url')}
                  placeholder="https://votre-portfolio.com"
                  className="pl-10"
                    />
                  </div>
              {errors.portfolio_url && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.portfolio_url.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Préférences professionnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences professionnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_of_experience">Années d'expérience</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  {...register('years_of_experience', { valueAsNumber: true })}
                  placeholder="5"
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
              <div className="space-y-2">
                <Label htmlFor="availability">Disponibilité</Label>
                <Select
                  value={watchedValues.availability}
                  onValueChange={(value) => setValue('availability', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre disponibilité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiate</SelectItem>
                    <SelectItem value="2_weeks">2 semaines</SelectItem>
                    <SelectItem value="1_month">1 mois</SelectItem>
                    <SelectItem value="3_months">3 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type de travail préféré</Label>
              <div className="flex flex-wrap gap-2">
                {['remote', 'hybrid', 'onsite'].map((type) => (
                  <Badge
                    key={type}
                    variant={watchedValues.preferred_work_type?.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => watchedValues.preferred_work_type?.includes(type) 
                      ? removeWorkType(type) 
                      : addWorkType(type)
                    }
                  >
                    {type === 'remote' ? 'Télétravail' : type === 'hybrid' ? 'Hybride' : 'Sur site'}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_expectations_min">Salaire min (€)</Label>
                <Input
                  id="salary_expectations_min"
                  type="number"
                  {...register('salary_expectations_min', { valueAsNumber: true })}
                  placeholder="40000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_expectations_max">Salaire max (€)</Label>
                <Input
                  id="salary_expectations_max"
                  type="number"
                  {...register('salary_expectations_max', { valueAsNumber: true })}
                  placeholder="60000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={watchedValues.currency}
                  onValueChange={(value) => setValue('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Langues</Label>
              <div className="space-y-2">
                {(watchedValues.languages || []).map((lang, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={lang}
                      onChange={(e) => updateLanguage(index, e.target.value)}
                      placeholder="Français"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeLanguage(index)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLanguage}
                >
                  Ajouter une langue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={!isDirty}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Fonction pour calculer le pourcentage de complétion
const calculateCompletionPercentage = (values: any): number => {
  let score = 0;
  const total = 12; // Nombre total de champs importants

  if (values.first_name) score++;
  if (values.last_name) score++;
  if (values.title) score++;
  if (values.bio) score++;
  if (values.phone) score++;
  if (values.location) score++;
  if (values.linkedin_url) score++;
  if (values.github_url) score++;
  if (values.portfolio_url) score++;
  if (values.years_of_experience) score++;
  if (values.availability) score++;
  if (values.preferred_work_type?.length > 0) score++;

  return Math.round((score / total) * 100);
};

export default ProfileForm;