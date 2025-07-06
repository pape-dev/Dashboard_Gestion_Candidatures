import React, { createContext, useContext, useState, useCallback } from 'react';

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
  // Initial data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      company: "Google",
      position: "Senior Frontend Developer",
      location: "Paris, France",
      status: "En cours",
      appliedDate: "2024-01-15",
      salary: "80-95k €",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Développement d'applications web modernes avec React et TypeScript",
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
      description: "Conception d'interfaces utilisateur innovantes pour Microsoft 365",
      priority: "high",
      contactPerson: "Jean Martin",
      contactEmail: "jean.martin@microsoft.com",
      nextStep: "2ème entretien - 25 Jan",
      tags: ["Figma", "Design System", "UX Research"]
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
      description: "Gestion produit pour les applications mobiles iOS",
      priority: "medium",
      contactPerson: "Sarah Connor",
      contactEmail: "sarah.connor@apple.com",
      nextStep: "Réponse attendue",
      tags: ["Product Management", "iOS", "Mobile"]
    },
    {
      id: 4,
      company: "Amazon",
      position: "Full Stack Developer",
      location: "Bordeaux, France",
      status: "Refusé",
      appliedDate: "2024-01-08",
      salary: "60-70k €",
      statusColor: "bg-red-100 text-red-800 border-red-200",
      description: "Développement complet d'applications e-commerce",
      priority: "low",
      contactPerson: "Mike Johnson",
      contactEmail: "mike.johnson@amazon.com",
      nextStep: "Candidature clôturée",
      tags: ["Node.js", "React", "AWS", "E-commerce"]
    },
    {
      id: 5,
      company: "Netflix",
      position: "DevOps Engineer",
      location: "Toulouse, France",
      status: "Accepté",
      appliedDate: "2024-01-05",
      salary: "75-90k €",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      description: "Infrastructure cloud et déploiement continu",
      priority: "high",
      contactPerson: "Carlos Rodriguez",
      contactEmail: "carlos.rodriguez@netflix.com",
      nextStep: "Signature du contrat",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"]
    }
  ]);

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 1,
      applicationId: 1,
      company: "Google",
      position: "Senior Frontend Developer",
      date: "2025-07-07",
      time: "14:00",
      type: "Entretien technique",
      location: "Visioconférence",
      interviewer: "Marie Dubois",
      duration: "1h30",
      status: "confirmé",
      notes: "Préparer les questions sur React et TypeScript",
      meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: 2,
      applicationId: 2,
      company: "Microsoft",
      position: "UX/UI Designer Senior",
      date: "2025-07-08",
      time: "10:30",
      type: "Entretien RH",
      location: "Lyon - Bureau Microsoft",
      interviewer: "Jean Martin",
      duration: "45min",
      status: "confirmé",
      notes: "Apporter portfolio physique"
    },
    {
      id: 3,
      applicationId: 5,
      company: "Netflix",
      position: "DevOps Engineer",
      date: "2025-07-10",
      time: "16:00",
      type: "Entretien final",
      location: "Toulouse - Siège Netflix",
      interviewer: "Carlos Rodriguez",
      duration: "2h",
      status: "à confirmer",
      notes: "Présentation technique sur l'architecture cloud"
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Préparer l'entretien Google",
      description: "Réviser React, TypeScript et algorithmes",
      dueDate: "2025-07-07",
      priority: "high",
      status: "in-progress",
      applicationId: 1,
      category: "interview"
    },
    {
      id: 2,
      title: "Suivre candidature Apple",
      description: "Relancer après 2 semaines sans réponse",
      dueDate: "2025-07-12",
      priority: "medium",
      status: "todo",
      applicationId: 3,
      category: "follow-up"
    },
    {
      id: 3,
      title: "Mettre à jour le CV",
      description: "Ajouter les dernières compétences et projets",
      dueDate: "2025-07-15",
      priority: "medium",
      status: "todo",
      category: "other"
    }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@google.com",
      phone: "+33 6 12 34 56 78",
      company: "Google",
      position: "Senior Recruiter",
      notes: "Très sympathique, processus de recrutement rapide",
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
      notes: "Expert en design systems, portfolio requis",
      linkedIn: "https://linkedin.com/in/jean-martin",
      lastContact: "2024-01-12"
    }
  ]);

  // Application actions
  const addApplication = useCallback((newApplication: Omit<Application, 'id'>) => {
    const id = Math.max(...applications.map(a => a.id), 0) + 1;
    setApplications(prev => [...prev, { ...newApplication, id }]);
  }, [applications]);

  const updateApplication = useCallback((id: number, updates: Partial<Application>) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  }, []);

  const deleteApplication = useCallback((id: number) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    setInterviews(prev => prev.filter(interview => interview.applicationId !== id));
    setTasks(prev => prev.filter(task => task.applicationId !== id));
  }, []);

  // Interview actions
  const addInterview = useCallback((newInterview: Omit<Interview, 'id'>) => {
    const id = Math.max(...interviews.map(i => i.id), 0) + 1;
    setInterviews(prev => [...prev, { ...newInterview, id }]);
  }, [interviews]);

  const updateInterview = useCallback((id: number, updates: Partial<Interview>) => {
    setInterviews(prev => prev.map(interview => interview.id === id ? { ...interview, ...updates } : interview));
  }, []);

  const deleteInterview = useCallback((id: number) => {
    setInterviews(prev => prev.filter(interview => interview.id !== id));
  }, []);

  // Task actions
  const addTask = useCallback((newTask: Omit<Task, 'id'>) => {
    const id = Math.max(...tasks.map(t => t.id), 0) + 1;
    setTasks(prev => [...prev, { ...newTask, id }]);
  }, [tasks]);

  const updateTask = useCallback((id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'todo' : 'completed'
          }
        : task
    ));
  }, []);

  // Contact actions
  const addContact = useCallback((newContact: Omit<Contact, 'id'>) => {
    const id = Math.max(...contacts.map(c => c.id), 0) + 1;
    setContacts(prev => [...prev, { ...newContact, id }]);
  }, [contacts]);

  const updateContact = useCallback((id: number, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => contact.id === id ? { ...contact, ...updates } : contact));
  }, []);

  const deleteContact = useCallback((id: number) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  }, []);

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

  const value: AppContextType = {
    // Data
    applications,
    interviews,
    tasks,
    contacts,
    
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
    
    // Statistics
    getStatistics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};