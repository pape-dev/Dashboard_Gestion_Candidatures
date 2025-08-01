import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  is_current: boolean | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  level: number | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchExperiences();
      fetchSkills();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create a new profile if it doesn't exist
        await createProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le profil",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const fetchExperiences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const addExperience = async (experience: Omit<Experience, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('experiences')
        .insert({ ...experience, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setExperiences(prev => [data, ...prev]);
      
      toast({
        title: "Succès",
        description: "Expérience ajoutée avec succès",
      });
    } catch (error) {
      console.error('Error adding experience:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'expérience",
        variant: "destructive",
      });
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setExperiences(prev => prev.map(exp => exp.id === id ? data : exp));
      
      toast({
        title: "Succès",
        description: "Expérience mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating experience:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'expérience",
        variant: "destructive",
      });
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      
      toast({
        title: "Succès",
        description: "Expérience supprimée avec succès",
      });
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'expérience",
        variant: "destructive",
      });
    }
  };

  const fetchSkills = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('category', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const addSkill = async (skill: Omit<UserSkill, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .insert({ ...skill, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setSkills(prev => [...prev, data]);
      
      toast({
        title: "Succès",
        description: "Compétence ajoutée avec succès",
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la compétence",
        variant: "destructive",
      });
    }
  };

  const updateSkill = async (id: string, updates: Partial<UserSkill>) => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSkills(prev => prev.map(skill => skill.id === id ? data : skill));
      
      toast({
        title: "Succès",
        description: "Compétence mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating skill:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la compétence",
        variant: "destructive",
      });
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSkills(prev => prev.filter(skill => skill.id !== id));
      
      toast({
        title: "Succès",
        description: "Compétence supprimée avec succès",
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    setUploading(true);
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

      await updateProfile({ avatar_url: publicUrl });
      
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la photo de profil",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    profile,
    experiences,
    skills,
    loading,
    uploading,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    updateSkill,
    deleteSkill,
    uploadAvatar,
  };
};