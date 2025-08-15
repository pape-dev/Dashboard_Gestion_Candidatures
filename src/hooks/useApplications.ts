import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Application {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location: string | null;
  status: string | null;
  applied_date: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  description: string | null;
  priority: string | null;
  contact_person: string | null;
  contact_email: string | null;
  next_step: string | null;
  job_url: string | null;
  company_logo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  application_id: string | null;
  company: string;
  position: string;
  interview_date: string;
  interview_time: string;
  type: string | null;
  location: string | null;
  interviewer: string | null;
  duration: string | null;
  status: string | null;
  notes: string | null;
  meeting_link: string | null;
  created_at: string;
  updated_at: string;
}

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchInterviews();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Impossible de charger les candidatures');
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async (application: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({ ...application, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setApplications(prev => [data, ...prev]);
      
      toast({
        title: "Succès",
        description: "Candidature ajoutée avec succès",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la candidature",
        variant: "destructive",
      });
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setApplications(prev => prev.map(app => app.id === id ? data : app));
      
      toast({
        title: "Succès",
        description: "Candidature mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la candidature",
        variant: "destructive",
      });
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setApplications(prev => prev.filter(app => app.id !== id));
      
      toast({
        title: "Succès",
        description: "Candidature supprimée avec succès",
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la candidature",
        variant: "destructive",
      });
    }
  };

  const fetchInterviews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('interview_date', { ascending: true });

      if (error) throw error;
      setInterviews(data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const addInterview = async (interview: Omit<Interview, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert({ ...interview, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setInterviews(prev => [...prev, data]);
      
      toast({
        title: "Succès",
        description: "Entretien ajouté avec succès",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding interview:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'entretien",
        variant: "destructive",
      });
    }
  };

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setInterviews(prev => prev.map(interview => interview.id === id ? data : interview));
      
      toast({
        title: "Succès",
        description: "Entretien mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating interview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'entretien",
        variant: "destructive",
      });
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInterviews(prev => prev.filter(interview => interview.id !== id));
      
      toast({
        title: "Succès",
        description: "Entretien supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entretien",
        variant: "destructive",
      });
    }
  };

  const getStatistics = () => {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(app => 
      ['En cours', 'Entretien', 'En attente'].includes(app.status || '')
    ).length;
    const interviewsScheduled = interviews.filter(interview => 
      ['confirmé', 'à confirmer'].includes(interview.status || '')
    ).length;
    const responseRate = totalApplications > 0 
      ? Math.round((applications.filter(app => app.status !== 'En attente').length / totalApplications) * 100)
      : 0;

    return {
      totalApplications,
      activeApplications,
      interviewsScheduled,
      responseRate,
    };
  };

  return {
    applications,
    interviews,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    addInterview,
    updateInterview,
    deleteInterview,
    getStatistics,
    refetch: () => {
      fetchApplications();
      fetchInterviews();
    }
  };
};