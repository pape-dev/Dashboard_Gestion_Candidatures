import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/lib/security';

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
  updated_at: string;
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
  updated_at: string;
}

interface AppContextType {
  // Data
  applications: Application[];
  interviews: Interview[];
  tasks: Task[];
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  
  // Actions for Applications
  addApplication: (application: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  
  // Actions for Interviews
  addInterview: (interview: Omit<Interview, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInterview: (id: string, updates: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  
  // Actions for Tasks
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  
  // Actions for Contacts
  addContact: (contact: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // Statistics & Analytics
  getStatistics: () => {
    totalApplications: number;
    activeApplications: number;
    interviewsScheduled: number;
    responseRate: number;
    pendingTasks: number;
    completedTasks: number;
  };

  // Data refresh
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State management
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load data on mount and user change
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Clear data when not authenticated
      setApplications([]);
      setInterviews([]);
      setTasks([]);
      setContacts([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchApplications(),
        fetchInterviews(),
        fetchTasks(),
        fetchContacts()
      ]);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Impossible de charger vos données');
      handleSupabaseError(error, 'Chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setApplications(data || []);
  };

  const fetchInterviews = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', user.id)
      .order('interview_date', { ascending: true });

    if (error) throw error;
    setInterviews(data || []);
  };

  const fetchTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setTasks(data || []);
  };

  const fetchContacts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setContacts(data || []);
  };

  const refreshData = async () => {
    await loadUserData();
  };

  // Application actions
  const addApplication = useCallback(async (newApplication: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({ ...newApplication, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setApplications(prev => [data, ...prev]);
      
      toast({
        title: "Candidature ajoutée",
        description: `Candidature pour ${newApplication.position} chez ${newApplication.company} ajoutée avec succès`,
      });
    } catch (error) {
      handleSupabaseError(error, 'Ajout candidature');
      throw error;
    }
  }, [user]);

  const updateApplication = useCallback(async (id: string, updates: Partial<Application>) => {
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
        title: "Candidature mise à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      handleSupabaseError(error, 'Mise à jour candidature');
      throw error;
    }
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    try {
      const application = applications.find(app => app.id === id);
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApplications(prev => prev.filter(app => app.id !== id));
      setInterviews(prev => prev.filter(interview => interview.application_id !== id));
      setTasks(prev => prev.filter(task => task.application_id !== id));
      
      if (application) {
        toast({
          title: "Candidature supprimée",
          description: `La candidature pour ${application.position} chez ${application.company} a été supprimée`,
        });
      }
    } catch (error) {
      handleSupabaseError(error, 'Suppression candidature');
      throw error;
    }
  }, [applications]);

  // Interview actions
  const addInterview = useCallback(async (newInterview: Omit<Interview, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert({ ...newInterview, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setInterviews(prev => [...prev, data]);
      
      toast({
        title: "Entretien planifié",
        description: `Entretien avec ${newInterview.company} ajouté au calendrier`,
      });
    } catch (error) {
      handleSupabaseError(error, 'Ajout entretien');
      throw error;
    }
  }, [user]);

  const updateInterview = useCallback(async (id: string, updates: Partial<Interview>) => {
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
        title: "Entretien mis à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      handleSupabaseError(error, 'Mise à jour entretien');
      throw error;
    }
  }, []);

  const deleteInterview = useCallback(async (id: string) => {
    try {
      const interview = interviews.find(i => i.id === id);
      
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInterviews(prev => prev.filter(interview => interview.id !== id));
      
      if (interview) {
        toast({
          title: "Entretien supprimé",
          description: `L'entretien avec ${interview.company} a été supprimé`,
        });
      }
    } catch (error) {
      handleSupabaseError(error, 'Suppression entretien');
      throw error;
    }
  }, [interviews]);

  // Task actions
  const addTask = useCallback(async (newTask: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...newTask, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      
      toast({
        title: "Tâche créée",
        description: `Nouvelle tâche "${newTask.title}" ajoutée`,
      });
    } catch (error) {
      handleSupabaseError(error, 'Ajout tâche');
      throw error;
    }
  }, [user]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      
      toast({
        title: "Tâche mise à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      handleSupabaseError(error, 'Mise à jour tâche');
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      
      if (task) {
        toast({
          title: "Tâche supprimée",
          description: `La tâche "${task.title}" a été supprimée`,
        });
      }
    } catch (error) {
      handleSupabaseError(error, 'Suppression tâche');
      throw error;
    }
  }, [tasks]);

  const toggleTaskStatus = useCallback(async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newCompleted = !task.completed;
      const updates: Partial<Task> = {
        completed: newCompleted,
        status: newCompleted ? 'completed' : 'todo',
        completed_at: newCompleted ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(t => t.id === id ? data : t));
      
      toast({
        title: newCompleted ? "Tâche terminée" : "Tâche réactivée",
        description: `"${task.title}" ${newCompleted ? 'marquée comme terminée' : 'remise en cours'}`,
      });
    } catch (error) {
      handleSupabaseError(error, 'Changement statut tâche');
      throw error;
    }
  }, [tasks]);

  // Contact actions
  const addContact = useCallback(async (newContact: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({ ...newContact, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setContacts(prev => [data, ...prev]);
      
      toast({
        title: "Contact ajouté",
        description: `${newContact.name} ajouté à vos contacts`,
      });
    } catch (error) {
      handleSupabaseError(error, 'Ajout contact');
      throw error;
    }
  }, [user]);

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setContacts(prev => prev.map(contact => contact.id === id ? data : contact));
      
      toast({
        title: "Contact mis à jour",
        description: "Les modifications ont été sauvegardées",
      });
    } catch (error) {
      handleSupabaseError(error, 'Mise à jour contact');
      throw error;
    }
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    try {
      const contact = contacts.find(c => c.id === id);
      
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      if (contact) {
        toast({
          title: "Contact supprimé",
          description: `${contact.name} a été supprimé de vos contacts`,
        });
      }
    } catch (error) {
      handleSupabaseError(error, 'Suppression contact');
      throw error;
    }
  }, [contacts]);

  // Statistics
  const getStatistics = useCallback(() => {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(app => 
      ['En cours', 'Entretien', 'En attente'].includes(app.status || '')
    ).length;
    const interviewsScheduled = interviews.filter(interview => 
      ['confirmé', 'à confirmer'].includes(interview.status || '')
    ).length;
    const responseRate = totalApplications > 0 
      ? Math.round((applications.filter(app => app.status !== 'En attente' && app.status !== null).length / totalApplications) * 100)
      : 0;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;

    return {
      totalApplications,
      activeApplications,
      interviewsScheduled,
      responseRate,
      pendingTasks,
      completedTasks
    };
  }, [applications, interviews, tasks]);

  const value: AppContextType = {
    // Data
    applications,
    interviews,
    tasks,
    contacts,
    loading,
    error,
    
    // Actions
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
    
    // Utilities
    getStatistics,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};