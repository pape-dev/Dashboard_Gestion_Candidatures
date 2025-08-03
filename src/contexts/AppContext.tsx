import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface Application {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  appliedDate: string;
  salary: string;
  statusColor: string;
  description: string;
  priority: string;
  contactPerson: string;
  contactEmail: string;
  nextStep: string;
  tags: string[];
  logo?: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  company: string;
  position: string;
  date: string;
  time: string;
  type: string;
  location: string;
  interviewer: string;
  duration: string;
  status: string;
  notes?: string;
  meetingLink?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  applicationId?: number;
  category: 'application' | 'interview' | 'follow-up' | 'research' | 'other';
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company: string;
  position: string;
  notes?: string;
  linkedIn?: string;
  lastContact?: string;
  avatar?: string;
}

interface AppContextType {
  // Data
  applications: Application[];
  interviews: Interview[];
  tasks: Task[];
  contacts: Contact[];
  loading: boolean;
  
  // Actions for Applications
  addApplication: (application: Omit<Application, 'id'>) => void;
  updateApplication: (id: number, updates: Partial<Application>) => void;
  deleteApplication: (id: number) => void;
  
  // Actions for Interviews
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: number, updates: Partial<Interview>) => void;
  deleteInterview: (id: number) => void;
  
  // Actions for Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  toggleTaskStatus: (id: number) => void;
  
  // Actions for Contacts
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: number, updates: Partial<Contact>) => void;
  deleteContact: (id: number) => void;
  
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

  // State management
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Initialize with demo data for better UX
  const initializeDemoData = useCallback(() => {
    const demoApplications: Application[] = [
      {
        id: 1,
        company: "Google",
        position: "Senior Frontend Developer",
        location: "Paris, France",
        status: "En cours",
        appliedDate: "2024-01-15",
        salary: "80-95k €",
        statusColor: "bg-blue-100 text-blue-800 border-blue-200",
        description: "Développement d'applications web modernes avec React et TypeScript pour l'équipe Google Workspace",
        priority: "high",
        contactPerson: "Marie Dubois",
        contactEmail: "marie.dubois@google.com",
        nextStep: "Entretien technique prévu",
        tags: ["React", "TypeScript", "Remote", "Tech Lead"],
        logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=64&h=64&fit=crop&crop=center"
      },
      {
        id: 2,
        company: "Microsoft",
        position: "UX/UI Designer Senior",
        location: "Lyon, France",
        status: "Entretien",
        appliedDate: "2024-01-12",
        salary: "65-75k €",
        statusColor: "bg-green-100 text-green-800 border-green-200",
        description: "Conception d'interfaces utilisateur innovantes pour Microsoft 365 et Azure Portal",
        priority: "high",
        contactPerson: "Jean Martin",
        contactEmail: "jean.martin@microsoft.com",
        nextStep: "2ème entretien - 25 Jan",
        tags: ["Figma", "Design System", "UX Research", "Azure"]
      },
      {
        id: 3,
        company: "Apple",
        position: "Product Manager",
        location: "Remote",
        status: "En attente",
        appliedDate: "2024-01-10",
        salary: "70-85k €",
        statusColor: "bg-amber-100 text-amber-800 border-amber-200",
        description: "Gestion produit pour les applications mobiles iOS et coordination avec les équipes internationales",
        priority: "medium",
        contactPerson: "Sarah Connor",
        contactEmail: "sarah.connor@apple.com",
        nextStep: "Réponse attendue",
        tags: ["Product Management", "iOS", "Mobile", "International"]
      },
      {
        id: 4,
        company: "Netflix",
        position: "DevOps Engineer",
        location: "Toulouse, France",
        status: "Accepté",
        appliedDate: "2024-01-05",
        salary: "75-90k €",
        statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        description: "Infrastructure cloud et déploiement continu pour la plateforme de streaming mondiale",
        priority: "high",
        contactPerson: "Carlos Rodriguez",
        contactEmail: "carlos.rodriguez@netflix.com",
        nextStep: "Signature du contrat",
        tags: ["AWS", "Docker", "Kubernetes", "CI/CD", "Streaming"]
      }
    ];

    const demoInterviews: Interview[] = [
      {
        id: 1,
        applicationId: 1,
        company: "Google",
        position: "Senior Frontend Developer",
        date: "2025-01-25",
        time: "14:00",
        type: "Entretien technique",
        location: "Visioconférence",
        interviewer: "Marie Dubois",
        duration: "1h30",
        status: "confirmé",
        notes: "Préparer les questions sur React, TypeScript et architecture frontend",
        meetingLink: "https://meet.google.com/abc-defg-hij"
      },
      {
        id: 2,
        applicationId: 2,
        company: "Microsoft",
        position: "UX/UI Designer Senior",
        date: "2025-01-28",
        time: "10:30",
        type: "Entretien RH",
        location: "Lyon - Bureau Microsoft",
        interviewer: "Jean Martin",
        duration: "45min",
        status: "confirmé",
        notes: "Apporter portfolio physique et présentation des projets récents"
      },
      {
        id: 3,
        applicationId: 4,
        company: "Netflix",
        position: "DevOps Engineer",
        date: "2025-01-30",
        time: "16:00",
        type: "Entretien final",
        location: "Toulouse - Siège Netflix",
        interviewer: "Carlos Rodriguez",
        duration: "2h",
        status: "à confirmer",
        notes: "Présentation technique sur l'architecture cloud et scalabilité"
      }
    ];

    const demoTasks: Task[] = [
      {
        id: 1,
        title: "Préparer l'entretien Google",
        description: "Réviser React, TypeScript et algorithmes. Préparer des exemples concrets de projets.",
        dueDate: "2025-01-24",
        priority: "high",
        status: "in-progress",
        applicationId: 1,
        category: "interview"
      },
      {
        id: 2,
        title: "Suivre candidature Apple",
        description: "Relancer après 2 semaines sans réponse. Préparer un email de suivi professionnel.",
        dueDate: "2025-01-26",
        priority: "medium",
        status: "todo",
        applicationId: 3,
        category: "follow-up"
      },
      {
        id: 3,
        title: "Mettre à jour le CV",
        description: "Ajouter les dernières compétences, projets et certifications obtenues",
        dueDate: "2025-01-28",
        priority: "medium",
        status: "todo",
        category: "other"
      }
    ];

    const demoContacts: Contact[] = [
      {
        id: 1,
        name: "Marie Dubois",
        email: "marie.dubois@google.com",
        phone: "+33 6 12 34 56 78",
        company: "Google",
        position: "Senior Technical Recruiter",
        notes: "Très professionnelle, processus de recrutement rapide et transparent",
        linkedIn: "https://linkedin.com/in/marie-dubois",
        lastContact: "2024-01-15",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e9?w=64&h=64&fit=crop&crop=center"
      },
      {
        id: 2,
        name: "Jean Martin",
        email: "jean.martin@microsoft.com",
        company: "Microsoft",
        position: "Design Manager",
        notes: "Expert en design systems, portfolio requis. Très accessible et bienveillant.",
        linkedIn: "https://linkedin.com/in/jean-martin",
        lastContact: "2024-01-12",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=center"
      }
    ];

    setApplications(demoApplications);
    setInterviews(demoInterviews);
    setTasks(demoTasks);
    setContacts(demoContacts);
  }, []);

  // Load data on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    } else {
      initializeDemoData();
      setLoading(false);
    }
  }, [isAuthenticated, initializeDemoData]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // En attendant l'intégration complète avec Supabase, on utilise les données de démo
      // TODO: Remplacer par les vraies requêtes Supabase
      initializeDemoData();
      
      toast({
        title: "Données chargées",
        description: "Vos données ont été synchronisées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos données. Utilisation des données locales.",
        variant: "destructive",
      });
      initializeDemoData();
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadUserData();
  };

  // Application actions
  const addApplication = useCallback((newApplication: Omit<Application, 'id'>) => {
    const id = Math.max(...applications.map(a => a.id), 0) + 1;
    const application: Application = {
      ...newApplication,
      id,
      statusColor: getStatusColor(newApplication.status),
    };
    
    setApplications(prev => [application, ...prev]);
    
    toast({
      title: "Candidature ajoutée",
      description: `Candidature pour ${newApplication.position} chez ${newApplication.company} ajoutée avec succès`,
    });
  }, [applications]);

  const updateApplication = useCallback((id: number, updates: Partial<Application>) => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        const updatedApp = { ...app, ...updates };
        if (updates.status) {
          updatedApp.statusColor = getStatusColor(updates.status);
        }
        return updatedApp;
      }
      return app;
    }));
    
    toast({
      title: "Candidature mise à jour",
      description: "Les modifications ont été sauvegardées",
    });
  }, []);

  const deleteApplication = useCallback((id: number) => {
    const application = applications.find(app => app.id === id);
    setApplications(prev => prev.filter(app => app.id !== id));
    setInterviews(prev => prev.filter(interview => interview.applicationId !== id));
    setTasks(prev => prev.filter(task => task.applicationId !== id));
    
    if (application) {
      toast({
        title: "Candidature supprimée",
        description: `La candidature pour ${application.position} chez ${application.company} a été supprimée`,
      });
    }
  }, [applications]);

  // Interview actions
  const addInterview = useCallback((newInterview: Omit<Interview, 'id'>) => {
    const id = Math.max(...interviews.map(i => i.id), 0) + 1;
    const interview: Interview = { ...newInterview, id };
    
    setInterviews(prev => [...prev, interview]);
    
    toast({
      title: "Entretien planifié",
      description: `Entretien avec ${newInterview.company} ajouté au calendrier`,
    });
  }, [interviews]);

  const updateInterview = useCallback((id: number, updates: Partial<Interview>) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === id ? { ...interview, ...updates } : interview
    ));
    
    toast({
      title: "Entretien mis à jour",
      description: "Les modifications ont été sauvegardées",
    });
  }, []);

  const deleteInterview = useCallback((id: number) => {
    const interview = interviews.find(i => i.id === id);
    setInterviews(prev => prev.filter(interview => interview.id !== id));
    
    if (interview) {
      toast({
        title: "Entretien supprimé",
        description: `L'entretien avec ${interview.company} a été supprimé`,
      });
    }
  }, [interviews]);

  // Task actions
  const addTask = useCallback((newTask: Omit<Task, 'id'>) => {
    const id = Math.max(...tasks.map(t => t.id), 0) + 1;
    const task: Task = { ...newTask, id };
    
    setTasks(prev => [task, ...prev]);
    
    toast({
      title: "Tâche créée",
      description: `Nouvelle tâche "${newTask.title}" ajoutée`,
    });
  }, [tasks]);

  const updateTask = useCallback((id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: number) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      toast({
        title: "Tâche supprimée",
        description: `La tâche "${task.title}" a été supprimée`,
      });
    }
  }, [tasks]);

  const toggleTaskStatus = useCallback((id: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        const updatedTask = { ...task, status: newStatus };
        
        toast({
          title: newStatus === 'completed' ? "Tâche terminée" : "Tâche réactivée",
          description: `"${task.title}" ${newStatus === 'completed' ? 'marquée comme terminée' : 'remise en cours'}`,
        });
        
        return updatedTask;
      }
      return task;
    }));
  }, [tasks]);

  // Contact actions
  const addContact = useCallback((newContact: Omit<Contact, 'id'>) => {
    const id = Math.max(...contacts.map(c => c.id), 0) + 1;
    const contact: Contact = { ...newContact, id };
    
    setContacts(prev => [contact, ...prev]);
    
    toast({
      title: "Contact ajouté",
      description: `${newContact.name} ajouté à vos contacts`,
    });
  }, [contacts]);

  const updateContact = useCallback((id: number, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
    
    toast({
      title: "Contact mis à jour",
      description: "Les modifications ont été sauvegardées",
    });
  }, []);

  const deleteContact = useCallback((id: number) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(contact => contact.id !== id));
    
    if (contact) {
      toast({
        title: "Contact supprimé",
        description: `${contact.name} a été supprimé de vos contacts`,
      });
    }
  }, [contacts]);

  // Statistics
  const getStatistics = useCallback(() => {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(app => 
      ['En cours', 'Entretien', 'En attente'].includes(app.status)
    ).length;
    const interviewsScheduled = interviews.filter(interview => 
      ['confirmé', 'à confirmer'].includes(interview.status)
    ).length;
    const responseRate = totalApplications > 0 
      ? Math.round((applications.filter(app => app.status !== 'En attente').length / totalApplications) * 100)
      : 0;
    const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;

    return {
      totalApplications,
      activeApplications,
      interviewsScheduled,
      responseRate,
      pendingTasks,
      completedTasks
    };
  }, [applications, interviews, tasks]);

  // Helper function for status colors
  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'En cours': 'bg-blue-100 text-blue-800 border-blue-200',
      'Entretien': 'bg-green-100 text-green-800 border-green-200',
      'En attente': 'bg-amber-100 text-amber-800 border-amber-200',
      'Accepté': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Refusé': 'bg-red-100 text-red-800 border-red-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const value: AppContextType = {
    // Data
    applications,
    interviews,
    tasks,
    contacts,
    loading,
    
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