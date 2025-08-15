import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  User, Upload, Save, Plus, Edit, Trash2, Download, 
  MapPin, Phone, Globe, Linkedin, Github, Twitter, 
  FileText, Briefcase, Target, Award, Calendar,
  Loader2, CheckCircle, AlertCircle, X, Building
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schémas de validation
const profileSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  title: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  linkedin_url: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
  github_url: z.string().url("URL GitHub invalide").optional().or(z.literal("")),
  twitter_url: z.string().url("URL Twitter invalide").optional().or(z.literal("")),
  portfolio_url: z.string().url("URL Portfolio invalide").optional().or(z.literal("")),
  years_of_experience: z.number().min(0).optional(),
  salary_expectations_min: z.number().min(0).optional(),
  salary_expectations_max: z.number().min(0).optional(),
  currency: z.string().default("EUR"),
  availability: z.string().optional(),
});

const experienceSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  company: z.string().min(1, "L'entreprise est requise"),
  location: z.string().optional(),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

const skillSchema = z.object({
  skill_name: z.string().min(1, "Le nom de la compétence est requis"),
  level: z.number().min(1).max(5),
  category: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type ExperienceFormData = z.infer<typeof experienceSchema>;
type SkillFormData = z.infer<typeof skillSchema>;

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);

  // Formulaire principal du profil
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      title: '',
      bio: '',
      phone: '',
      location: '',
      website: '',
      linkedin_url: '',
      github_url: '',
      twitter_url: '',
      portfolio_url: '',
      years_of_experience: undefined,
      salary_expectations_min: undefined,
      salary_expectations_max: undefined,
      currency: 'EUR',
      availability: '',
    }
  });

  // Formulaire d'expérience
  const experienceForm = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    }
  });

  // Formulaire de compétence
  const skillForm = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: '',
      level: 3,
      category: '',
    }
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Charger le profil
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
        profileForm.reset(profileData);
        setLanguages(profileData.languages || []);
        setWorkTypes(profileData.preferred_work_type || []);
      }

      // Charger les expériences
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (experiencesError) throw experiencesError;
      setExperiences(experiencesData || []);

      // Charger les compétences
      const { data: skillsData, error: skillsError } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('level', { ascending: false });

      if (skillsError) throw skillsError;
      setSkills(skillsData || []);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      const profileData = {
        ...data,
        languages,
        preferred_work_type: workTypes,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profileData,
        });

      if (error) throw error;

      setProfile(profileData);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil",
        variant: "destructive",
      });
    }
  };

  const handleExperienceSubmit = async (data: ExperienceFormData) => {
    if (!user) return;

    try {
      if (editingExperience) {
        const { error } = await supabase
          .from('experiences')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingExperience.id);

        if (error) throw error;
        
        setExperiences(prev => prev.map(exp => 
          exp.id === editingExperience.id ? { ...exp, ...data } : exp
        ));
        
        toast({
          title: "Expérience mise à jour",
          description: "L'expérience a été modifiée avec succès",
        });
      } else {
        const { data: newExperience, error } = await supabase
          .from('experiences')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        
        setExperiences(prev => [newExperience, ...prev]);
        
        toast({
          title: "Expérience ajoutée",
          description: "Nouvelle expérience ajoutée avec succès",
        });
      }

      experienceForm.reset();
      setEditingExperience(null);
      setShowExperienceForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'expérience",
        variant: "destructive",
      });
    }
  };

  const handleSkillSubmit = async (data: SkillFormData) => {
    if (!user) return;

    try {
      if (editingSkill) {
        const { error } = await supabase
          .from('user_skills')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSkill.id);

        if (error) throw error;
        
        setSkills(prev => prev.map(skill => 
          skill.id === editingSkill.id ? { ...skill, ...data } : skill
        ));
        
        toast({
          title: "Compétence mise à jour",
          description: "La compétence a été modifiée avec succès",
        });
      } else {
        const { data: newSkill, error } = await supabase
          .from('user_skills')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        
        setSkills(prev => [newSkill, ...prev]);
        
        toast({
          title: "Compétence ajoutée",
          description: "Nouvelle compétence ajoutée avec succès",
        });
      }

      skillForm.reset();
      setEditingSkill(null);
      setShowSkillForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la compétence",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      
      toast({
        title: "Expérience supprimée",
        description: "L'expérience a été supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'expérience",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSkills(prev => prev.filter(skill => skill.id !== id));
      
      toast({
        title: "Compétence supprimée",
        description: "La compétence a été supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour",
      });
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la photo",
        variant: "destructive",
      });
    }
  };

  const addLanguage = () => {
    setLanguages(prev => [...prev, '']);
  };

  const updateLanguage = (index: number, value: string) => {
    setLanguages(prev => prev.map((lang, i) => i === index ? value : lang));
  };

  const removeLanguage = (index: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleWorkType = (type: string) => {
    setWorkTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const calculateCompletion = () => {
    const fields = [
      profile?.first_name,
      profile?.last_name,
      profile?.title,
      profile?.bio,
      profile?.phone,
      profile?.location,
      profile?.linkedin_url,
      experiences.length > 0,
      skills.length > 0,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return (
      <Layout>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg font-medium">Chargement...</p>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profil & CV</h1>
            <p className="text-muted-foreground mt-1">Gérez vos informations professionnelles</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger CV
            </Button>
          </div>
        </div>

        {/* Progression du profil */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Complétion du profil</h3>
                <p className="text-sm text-muted-foreground">
                  Complétez votre profil pour augmenter vos chances
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{calculateCompletion()}%</div>
                <div className="text-sm text-muted-foreground">Complété</div>
              </div>
            </div>
            <Progress value={calculateCompletion()} className="h-2" />
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="experience">Expériences</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
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
                      <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Changer la photo
                          </span>
                        </Button>
                      </Label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG ou WebP (max 5MB)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom *</Label>
                      <Input
                        id="first_name"
                        {...profileForm.register('first_name')}
                        placeholder="Votre prénom"
                      />
                      {profileForm.formState.errors.first_name && (
                        <p className="text-sm text-red-600">
                          {profileForm.formState.errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom *</Label>
                      <Input
                        id="last_name"
                        {...profileForm.register('last_name')}
                        placeholder="Votre nom"
                      />
                      {profileForm.formState.errors.last_name && (
                        <p className="text-sm text-red-600">
                          {profileForm.formState.errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Titre professionnel</Label>
                    <Input
                      id="title"
                      {...profileForm.register('title')}
                      placeholder="Ex: Développeur Full Stack"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...profileForm.register('bio')}
                      placeholder="Présentez-vous en quelques lignes..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          {...profileForm.register('phone')}
                          placeholder="+33 6 12 34 56 78"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          {...profileForm.register('location')}
                          placeholder="Paris, France"
                          className="pl-10"
                        />
                      </div>
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
                        {...profileForm.register('linkedin_url')}
                        placeholder="https://linkedin.com/in/votre-profil"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="github_url"
                        {...profileForm.register('github_url')}
                        placeholder="https://github.com/votre-username"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">Portfolio</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="portfolio_url"
                        {...profileForm.register('portfolio_url')}
                        placeholder="https://votre-portfolio.com"
                        className="pl-10"
                      />
                    </div>
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
                        {...profileForm.register('years_of_experience', { valueAsNumber: true })}
                        placeholder="5"
                        min="0"
                        max="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Disponibilité</Label>
                      <Select
                        value={profileForm.watch('availability')}
                        onValueChange={(value) => profileForm.setValue('availability', value)}
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
                          variant={workTypes.includes(type) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleWorkType(type)}
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
                        {...profileForm.register('salary_expectations_min', { valueAsNumber: true })}
                        placeholder="40000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary_expectations_max">Salaire max (€)</Label>
                      <Input
                        id="salary_expectations_max"
                        type="number"
                        {...profileForm.register('salary_expectations_max', { valueAsNumber: true })}
                        placeholder="60000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <Select
                        value={profileForm.watch('currency')}
                        onValueChange={(value) => profileForm.setValue('currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Langues</Label>
                    <div className="space-y-2">
                      {languages.map((lang, index) => (
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
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLanguage}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une langue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder le profil
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Expériences professionnelles</h2>
              <Button onClick={() => setShowExperienceForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une expérience
              </Button>
            </div>

            {/* Formulaire d'expérience */}
            {showExperienceForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingExperience ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={experienceForm.handleSubmit(handleExperienceSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="exp_title">Titre du poste *</Label>
                        <Input
                          id="exp_title"
                          {...experienceForm.register('title')}
                          placeholder="Ex: Développeur Full Stack"
                        />
                        {experienceForm.formState.errors.title && (
                          <p className="text-sm text-red-600">
                            {experienceForm.formState.errors.title.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exp_company">Entreprise *</Label>
                        <Input
                          id="exp_company"
                          {...experienceForm.register('company')}
                          placeholder="Ex: Google"
                        />
                        {experienceForm.formState.errors.company && (
                          <p className="text-sm text-red-600">
                            {experienceForm.formState.errors.company.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="exp_location">Localisation</Label>
                        <Input
                          id="exp_location"
                          {...experienceForm.register('location')}
                          placeholder="Paris, France"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exp_start_date">Date de début *</Label>
                        <Input
                          id="exp_start_date"
                          type="date"
                          {...experienceForm.register('start_date')}
                        />
                        {experienceForm.formState.errors.start_date && (
                          <p className="text-sm text-red-600">
                            {experienceForm.formState.errors.start_date.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exp_end_date">Date de fin</Label>
                        <Input
                          id="exp_end_date"
                          type="date"
                          {...experienceForm.register('end_date')}
                          disabled={experienceForm.watch('is_current')}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_current"
                        checked={experienceForm.watch('is_current')}
                        onCheckedChange={(checked) => experienceForm.setValue('is_current', checked as boolean)}
                      />
                      <Label htmlFor="is_current">Poste actuel</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exp_description">Description</Label>
                      <Textarea
                        id="exp_description"
                        {...experienceForm.register('description')}
                        placeholder="Décrivez vos responsabilités et réalisations..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowExperienceForm(false);
                          setEditingExperience(null);
                          experienceForm.reset();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {editingExperience ? 'Modifier' : 'Ajouter'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Liste des expériences */}
            <div className="space-y-4">
              {experiences.map((experience) => (
                <Card key={experience.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">{experience.title}</h3>
                          {experience.is_current && (
                            <Badge>Actuel</Badge>
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
                            {new Date(experience.start_date).toLocaleDateString('fr-FR')} - 
                            {experience.is_current ? 'Présent' : new Date(experience.end_date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        {experience.description && (
                          <p className="text-sm text-muted-foreground">
                            {experience.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingExperience(experience);
                            experienceForm.reset(experience);
                            setShowExperienceForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExperience(experience.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {experiences.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Aucune expérience</h3>
                    <p className="text-muted-foreground mb-4">
                      Ajoutez vos expériences professionnelles
                    </p>
                    <Button onClick={() => setShowExperienceForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter votre première expérience
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Compétences</h2>
              <Button onClick={() => setShowSkillForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une compétence
              </Button>
            </div>

            {/* Formulaire de compétence */}
            {showSkillForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingSkill ? 'Modifier la compétence' : 'Nouvelle compétence'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={skillForm.handleSubmit(handleSkillSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="skill_name">Nom de la compétence *</Label>
                        <Input
                          id="skill_name"
                          {...skillForm.register('skill_name')}
                          placeholder="Ex: React, TypeScript"
                        />
                        {skillForm.formState.errors.skill_name && (
                          <p className="text-sm text-red-600">
                            {skillForm.formState.errors.skill_name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skill_level">Niveau (1-5) *</Label>
                        <Select
                          value={skillForm.watch('level')?.toString()}
                          onValueChange={(value) => skillForm.setValue('level', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Débutant</SelectItem>
                            <SelectItem value="2">2 - Intermédiaire</SelectItem>
                            <SelectItem value="3">3 - Avancé</SelectItem>
                            <SelectItem value="4">4 - Expert</SelectItem>
                            <SelectItem value="5">5 - Maître</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skill_category">Catégorie</Label>
                        <Select
                          value={skillForm.watch('category')}
                          onValueChange={(value) => skillForm.setValue('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technique">Technique</SelectItem>
                            <SelectItem value="langue">Langue</SelectItem>
                            <SelectItem value="soft">Soft Skills</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowSkillForm(false);
                          setEditingSkill(null);
                          skillForm.reset();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {editingSkill ? 'Modifier' : 'Ajouter'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Liste des compétences */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Card key={skill.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{skill.skill_name}</h4>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSkill(skill);
                            skillForm.reset(skill);
                            setShowSkillForm(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Niveau {skill.level}/5</span>
                        <Badge variant="secondary">{skill.category}</Badge>
                      </div>
                      <Progress value={(skill.level / 5) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {skills.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucune compétence</h3>
                  <p className="text-muted-foreground mb-4">
                    Ajoutez vos compétences techniques et professionnelles
                  </p>
                  <Button onClick={() => setShowSkillForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre première compétence
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;