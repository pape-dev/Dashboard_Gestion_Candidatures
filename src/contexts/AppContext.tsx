import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  updated_at: string | null;
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
  updated_at: string | null;
}

export interface Task {
  id: string;
  user_id: string;
  application_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
  category: string | null;
  completed: boolean | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position: string | null;
  notes: string | null;
  linkedin_url: string | null;
  last_contact_date: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string | null;
}

interface AppContextType {
  applications: Application[];
  interviews: Interview[];
  tasks: Task[];
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  addApplication: (data: Partial<Application>) => Promise<void>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addInterview: (data: Partial<Interview>) => Promise<void>;
  updateInterview: (id: string, data: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  addTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  addContact: (data: Partial<Contact>) => Promise<void>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getStatistics: () => {
    totalApplications: number;
    activeApplications: number;
    interviewsScheduled: number;
    responseRate: number;
    tasksCompleted: number;
    contactsCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fonction pour charger toutes les données
  const loadAllData = useCallback(async () => {
    if (!user || !isSupabaseConfigured || dataLoaded) return;

    try {
      setLoading(true);
      setError(null);

      const [applicationsRes, interviewsRes, tasksRes, contactsRes] = await Promise.all([
        supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('interviews').select('*').eq('user_id', user.id).order('interview_date', { ascending: true }),
        supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').eq('user_id', user.id).order('name', { ascending: true })
      ]);

      setApplications(applicationsRes.data || []);
      setInterviews(interviewsRes.data || []);
      setTasks(tasksRes.data || []);
      setContacts(contactsRes.data || []);
      setDataLoaded(true);

    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  }, [user, dataLoaded]);

  // Charger les données au montage
  useEffect(() => {
    if (user && isSupabaseConfigured && !dataLoaded) {
      loadAllData();
    }
  }, [user, loadAllData]);

  // Reset des données à la déconnexion
  useEffect(() => {
    if (!user) {
      setApplications([]);
      setInterviews([]);
      setTasks([]);
      setContacts([]);
      setDataLoaded(false);
      setError(null);
    }
  }, [user]);

  // Applications CRUD
  const addApplication = useCallback(async (data: Partial<Application>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: newApp, error } = await supabase
        .from('applications')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Erreur ajout candidature:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la candidature",
          variant: "destructive",
        });
        return;
      }

      setApplications(prev => [newApp, ...prev]);
      toast({
        title: "Candidature ajoutée",
        description: `Candidature pour ${data.position} chez ${data.company} ajoutée avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const updateApplication = useCallback(async (id: string, data: Partial<Application>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: updatedApp, error } = await supabase
        .from('applications')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour candidature:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la candidature",
          variant: "destructive",
        });
        return;
      }

      setApplications(prev => prev.map(app => app.id === id ? updatedApp : app));
      toast({
        title: "Candidature mise à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const deleteApplication = useCallback(async (id: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression candidature:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la candidature",
          variant: "destructive",
        });
        return;
      }

      setApplications(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Candidature supprimée",
        description: "La candidature a été supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Interviews CRUD
  const addInterview = useCallback(async (data: Partial<Interview>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: newInterview, error } = await supabase
        .from('interviews')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Erreur ajout entretien:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'entretien",
          variant: "destructive",
        });
        return;
      }

      setInterviews(prev => [newInterview, ...prev]);
      toast({
        title: "Entretien planifié",
        description: `Entretien chez ${data.company} ajouté avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const updateInterview = useCallback(async (id: string, data: Partial<Interview>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: updatedInterview, error } = await supabase
        .from('interviews')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour entretien:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'entretien",
          variant: "destructive",
        });
        return;
      }

      setInterviews(prev => prev.map(interview => interview.id === id ? updatedInterview : interview));
      toast({
        title: "Entretien mis à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const deleteInterview = useCallback(async (id: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression entretien:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'entretien",
          variant: "destructive",
        });
        return;
      }

      setInterviews(prev => prev.filter(interview => interview.id !== id));
      toast({
        title: "Entretien supprimé",
        description: "L'entretien a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Tasks CRUD
  const addTask = useCallback(async (data: Partial<Task>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Erreur ajout tâche:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la tâche",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => [newTask, ...prev]);
      toast({
        title: "Tâche créée",
        description: `Tâche "${data.title}" ajoutée avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour tâche:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la tâche",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast({
        title: "Tâche mise à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const deleteTask = useCallback(async (id: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression tâche:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la tâche",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const toggleTaskStatus = useCallback(async (id: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newCompleted = !task.completed;
      const updateData = {
        completed: newCompleted,
        status: newCompleted ? 'completed' : 'todo',
        completed_at: newCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur toggle tâche:', error);
        toast({
          title: "Erreur",
          description: "Impossible de changer le statut de la tâche",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast({
        title: newCompleted ? "Tâche terminée" : "Tâche réactivée",
        description: newCompleted ? "Félicitations !" : "Tâche remise en cours",
      });
    } catch (error) {
      console.error('Erreur lors du toggle:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, tasks, toast]);

  // Contacts CRUD
  const addContact = useCallback(async (data: Partial<Contact>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Erreur ajout contact:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le contact",
          variant: "destructive",
        });
        return;
      }

      setContacts(prev => [newContact, ...prev]);
      toast({
        title: "Contact ajouté",
        description: `Contact ${data.name} ajouté avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const updateContact = useCallback(async (id: string, data: Partial<Contact>) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data: updatedContact, error } = await supabase
        .from('contacts')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour contact:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le contact",
          variant: "destructive",
        });
        return;
      }

      setContacts(prev => prev.map(contact => contact.id === id ? updatedContact : contact));
      toast({
        title: "Contact mis à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const deleteContact = useCallback(async (id: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression contact:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le contact",
          variant: "destructive",
        });
        return;
      }

      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Statistiques
  const getStatistics = useCallback(() => {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(app => 
      app.status === "En cours" || app.status === "Entretien"
    ).length;
    const interviewsScheduled = interviews.filter(interview => 
      new Date(interview.interview_date) >= new Date()
    ).length;
    const responseRate = totalApplications > 0 
      ? Math.round((applications.filter(app => 
          app.status === "Entretien" || app.status === "Accepté" || app.status === "Refusé"
        ).length / totalApplications) * 100)
      : 0;
    const tasksCompleted = tasks.filter(task => task.completed).length;
    const contactsCount = contacts.length;

    return {
      totalApplications,
      activeApplications,
      interviewsScheduled,
      responseRate,
      tasksCompleted,
      contactsCount,
    };
  }, [applications, interviews, tasks, contacts]);

  const value: AppContextType = {
    applications,
    interviews,
    tasks,
    contacts,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    addInterview,
    updateInterview,
    deleteInterview,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addContact,
    updateContact,
    deleteContact,
    getStatistics,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};