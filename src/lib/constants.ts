// Constantes pour les types de données

export const WORK_TYPES = [
  { value: "remote", label: "Télétravail" },
  { value: "hybrid", label: "Hybride" },
  { value: "onsite", label: "Sur site" }
] as const;

export const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immédiate" },
  { value: "2_weeks", label: "2 semaines" },
  { value: "1_month", label: "1 mois" },
  { value: "3_months", label: "3 mois" }
] as const;

export const CURRENCY_OPTIONS = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" }
] as const;

export const SKILL_CATEGORIES = [
  { value: "technique", label: "Technique" },
  { value: "framework", label: "Framework" },
  { value: "language", label: "Langage" },
  { value: "tool", label: "Outil" },
  { value: "soft", label: "Soft skills" },
  { value: "other", label: "Autre" }
] as const;

export const APPLICATION_STATUSES = [
  { value: "En cours", label: "En cours", color: "default" },
  { value: "Entretien", label: "Entretien", color: "secondary" },
  { value: "En attente", label: "En attente", color: "outline" },
  { value: "Accepté", label: "Accepté", color: "default" },
  { value: "Refusé", label: "Refusé", color: "destructive" }
] as const;

export const INTERVIEW_STATUSES = [
  { value: "confirmé", label: "Confirmé", color: "default" },
  { value: "à confirmer", label: "À confirmer", color: "secondary" },
  { value: "annulé", label: "Annulé", color: "destructive" }
] as const;

export const PRIORITY_LEVELS = [
  { value: "low", label: "Faible", color: "outline" },
  { value: "medium", label: "Moyenne", color: "secondary" },
  { value: "high", label: "Haute", color: "destructive" }
] as const;