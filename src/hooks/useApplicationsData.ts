
import { useState } from "react";

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

const useApplicationsData = () => {
  const [applications] = useState<Application[]>([
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

  const [interviews] = useState<Interview[]>([
    {
      id: 1,
      applicationId: 1,
      company: "Google",
      position: "Senior Frontend Developer",
      date: "2025-07-05",
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
    },
    {
      id: 4,
      applicationId: 1,
      company: "Google",
      position: "Senior Frontend Developer",
      date: "2025-07-12",
      time: "11:00",
      type: "Entretien avec l'équipe",
      location: "Visioconférence",
      interviewer: "Équipe Frontend",
      duration: "1h",
      status: "en attente",
      notes: "Rencontre avec l'équipe de développement"
    }
  ]);

  return {
    applications,
    interviews
  };
};

export default useApplicationsData;
