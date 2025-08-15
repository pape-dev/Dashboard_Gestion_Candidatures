import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { profileSchema, experienceSchema, skillSchema, documentSchema, socialLinkSchema } from '@/lib/validation';
import type { ProfileFormData, ExperienceFormData, SkillFormData, DocumentFormData, SocialLinkFormData } from '@/lib/validation';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  cv_url: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  years_of_experience: number | null;
  preferred_work_type: string[] | null;
  salary_expectations_min: number | null;
  salary_expectations_max: number | null;
  currency: string;
  availability: string | null;
  languages: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[] | null;
  technologies: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  level: number;
  category: string | null;
  years_of_experience: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserDocument {
  id: string;
  user_id: string;
  name: string;
  type: 'cv' | 'portfolio' | 'certificate' | 'other';
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSocialLink {
  id: string;
  user_id: string;
  platform: 'linkedin' | 'github' | 'twitter' | 'website' | 'portfolio';
  url: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileAnalytics {
  id: string;
  user_id: string;
  profile_views: number;
  cv_downloads: number;
  last_profile_update: string | null;
  profile_completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query Keys
  const profileKey = ['profile', user?.id];
  const experiencesKey = ['experiences', user?.id];
  const skillsKey = ['skills', user?.id];
  const documentsKey = ['documents', user?.id];
  const socialLinksKey = ['social-links', user?.id];
  const analyticsKey = ['analytics', user?.id];

  // Fetch Profile
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: profileKey,
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          return await createProfile();
        }
        throw error;
      }

      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch Experiences
  const {
    data: experiences = [],
    isLoading: experiencesLoading,
    error: experiencesError,
    refetch: refetchExperiences
  } = useQuery({
    queryKey: experiencesKey,
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch Skills
  const {
    data: skills = [],
    isLoading: skillsLoading,
    error: skillsError,
    refetch: refetchSkills
  } = useQuery({
    queryKey: skillsKey,
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch Documents
  const {
    data: documents = [],
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: documentsKey,
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch Social Links
  const {
    data: socialLinks = [],
    isLoading: socialLinksLoading,
    error: socialLinksError,
    refetch: refetchSocialLinks
  } = useQuery({
    queryKey: socialLinksKey,
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_social_links')
        .select('*')
        .eq('user_id', user.id)
        .order('platform', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch Analytics
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: analyticsKey,
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profile_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Create Profile Mutation
  const createProfile = async (): Promise<UserProfile> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        currency: 'EUR',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error('User not authenticated');

      // Validate the data
      const validatedData = profileSchema.partial().parse(updates);

      const { data, error } = await supabase
        .from('user_profiles')
        .update(validatedData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKey, data);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    },
  });

  // Add Experience Mutation
  const addExperienceMutation = useMutation({
    mutationFn: async (experience: Omit<Experience, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      // Validate the data
      const validatedData = experienceSchema.parse(experience);

      const { data, error } = await supabase
        .from('experiences')
        .insert({ ...validatedData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(experiencesKey, (old: Experience[] = []) => [data, ...old]);
      toast({
        title: "Succès",
        description: "Expérience ajoutée avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error adding experience:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'expérience",
        variant: "destructive",
      });
    },
  });

  // Update Experience Mutation
  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Experience> }) => {
      // Validate the data
      const validatedData = experienceSchema.partial().parse(updates);

      const { data, error } = await supabase
        .from('experiences')
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(experiencesKey, (old: Experience[] = []) => 
        old.map(exp => exp.id === data.id ? data : exp)
      );
      toast({
        title: "Succès",
        description: "Expérience mise à jour avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating experience:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'expérience",
        variant: "destructive",
      });
    },
  });

  // Delete Experience Mutation
  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(experiencesKey, (old: Experience[] = []) => 
        old.filter(exp => exp.id !== id)
      );
      toast({
        title: "Succès",
        description: "Expérience supprimée avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting experience:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'expérience",
        variant: "destructive",
      });
    },
  });

  // Add Skill Mutation
  const addSkillMutation = useMutation({
    mutationFn: async (skill: Omit<UserSkill, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      // Validate the data
      const validatedData = skillSchema.parse(skill);

      const { data, error } = await supabase
        .from('user_skills')
        .insert({ ...validatedData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(skillsKey, (old: UserSkill[] = []) => [...old, data]);
      toast({
        title: "Succès",
        description: "Compétence ajoutée avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error adding skill:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la compétence",
        variant: "destructive",
      });
    },
  });

  // Update Skill Mutation
  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserSkill> }) => {
      // Validate the data
      const validatedData = skillSchema.partial().parse(updates);

      const { data, error } = await supabase
        .from('user_skills')
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(skillsKey, (old: UserSkill[] = []) => 
        old.map(skill => skill.id === data.id ? data : skill)
      );
      toast({
        title: "Succès",
        description: "Compétence mise à jour avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating skill:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la compétence",
        variant: "destructive",
      });
    },
  });

  // Delete Skill Mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(skillsKey, (old: UserSkill[] = []) => 
        old.filter(skill => skill.id !== id)
      );
      toast({
        title: "Succès",
        description: "Compétence supprimée avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting skill:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    },
  });

  // Upload File Mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, path, bucket }: { file: File; path: string; bucket: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return publicUrl;
    },
    onSuccess: (publicUrl) => {
      toast({
        title: "Succès",
        description: "Fichier téléchargé avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    },
  });

  // Upload Avatar Mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    },
    onSuccess: async (publicUrl) => {
      await updateProfileMutation.mutateAsync({ avatar_url: publicUrl });
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour avec succès",
      });
    },
    onError: (error: Error) => {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la photo de profil",
        variant: "destructive",
      });
    },
  });

  // Loading states
  const loading = profileLoading || experiencesLoading || skillsLoading || documentsLoading || socialLinksLoading || analyticsLoading;

  // Error states
  const error = profileError || experiencesError || skillsError || documentsError || socialLinksError || analyticsError;

  return {
    // Data
    profile,
    experiences,
    skills,
    documents,
    socialLinks,
    analytics,
    
    // Loading states
    loading,
    profileLoading,
    experiencesLoading,
    skillsLoading,
    documentsLoading,
    socialLinksLoading,
    analyticsLoading,
    
    // Error states
    error,
    profileError,
    experiencesError,
    skillsError,
    documentsError,
    socialLinksError,
    analyticsError,
    
    // Mutations
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    addExperience: addExperienceMutation.mutate,
    addExperienceAsync: addExperienceMutation.mutateAsync,
    updateExperience: updateExperienceMutation.mutate,
    updateExperienceAsync: updateExperienceMutation.mutateAsync,
    deleteExperience: deleteExperienceMutation.mutate,
    deleteExperienceAsync: deleteExperienceMutation.mutateAsync,
    addSkill: addSkillMutation.mutate,
    addSkillAsync: addSkillMutation.mutateAsync,
    updateSkill: updateSkillMutation.mutate,
    updateSkillAsync: updateSkillMutation.mutateAsync,
    deleteSkill: deleteSkillMutation.mutate,
    deleteSkillAsync: deleteSkillMutation.mutateAsync,
    uploadFile: uploadFileMutation.mutate,
    uploadFileAsync: uploadFileMutation.mutateAsync,
    uploadAvatar: uploadAvatarMutation.mutate,
    uploadAvatarAsync: uploadAvatarMutation.mutateAsync,
    
    // Refetch functions
    refetchProfile,
    refetchExperiences,
    refetchSkills,
    refetchDocuments,
    refetchSocialLinks,
    refetchAnalytics,
    
    // Mutation states
    isUpdatingProfile: updateProfileMutation.isPending,
    isAddingExperience: addExperienceMutation.isPending,
    isUpdatingExperience: updateExperienceMutation.isPending,
    isDeletingExperience: deleteExperienceMutation.isPending,
    isAddingSkill: addSkillMutation.isPending,
    isUpdatingSkill: updateSkillMutation.isPending,
    isDeletingSkill: deleteSkillMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
};