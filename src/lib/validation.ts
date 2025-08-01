import { z } from 'zod';

// Schémas de validation pour les profils
export const profileSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis").max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  last_name: z.string().min(1, "Le nom est requis").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  title: z.string().min(1, "Le titre professionnel est requis").max(100, "Le titre ne peut pas dépasser 100 caractères"),
  bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Numéro de téléphone invalide").optional(),
  location: z.string().max(100, "La localisation ne peut pas dépasser 100 caractères").optional(),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  linkedin_url: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
  github_url: z.string().url("URL GitHub invalide").optional().or(z.literal("")),
  twitter_url: z.string().url("URL Twitter invalide").optional().or(z.literal("")),
  portfolio_url: z.string().url("URL Portfolio invalide").optional().or(z.literal("")),
  years_of_experience: z.number().min(0, "L'expérience ne peut pas être négative").max(50, "Valeur d'expérience invalide").optional(),
  preferred_work_type: z.array(z.enum(["remote", "hybrid", "onsite"])).optional(),
  salary_expectations_min: z.number().min(0, "Le salaire minimum ne peut pas être négatif").optional(),
  salary_expectations_max: z.number().min(0, "Le salaire maximum ne peut pas être négatif").optional(),
  currency: z.enum(["EUR", "USD", "GBP", "CAD", "AUD"]).default("EUR"),
  availability: z.enum(["immediate", "2_weeks", "1_month", "3_months"]).optional(),
  languages: z.array(z.string()).optional(),
});

// Schéma pour les expériences
export const experienceSchema = z.object({
  title: z.string().min(1, "Le titre du poste est requis").max(100, "Le titre ne peut pas dépasser 100 caractères"),
  company: z.string().min(1, "Le nom de l'entreprise est requis").max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères"),
  location: z.string().max(100, "La localisation ne peut pas dépasser 100 caractères").optional(),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().max(1000, "La description ne peut pas dépasser 1000 caractères").optional(),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
});

// Schéma pour les compétences
export const skillSchema = z.object({
  skill_name: z.string().min(1, "Le nom de la compétence est requis").max(50, "Le nom de la compétence ne peut pas dépasser 50 caractères"),
  level: z.number().min(1, "Le niveau doit être entre 1 et 5").max(5, "Le niveau doit être entre 1 et 5"),
  category: z.string().max(50, "La catégorie ne peut pas dépasser 50 caractères").optional(),
  years_of_experience: z.number().min(0, "L'expérience ne peut pas être négative").max(50, "Valeur d'expérience invalide").optional(),
});

// Schéma pour les documents
export const documentSchema = z.object({
  name: z.string().min(1, "Le nom du document est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  type: z.enum(["cv", "portfolio", "certificate", "other"]),
  description: z.string().max(500, "La description ne peut pas dépasser 500 caractères").optional(),
  is_public: z.boolean().default(false),
});

// Schéma pour les liens sociaux
export const socialLinkSchema = z.object({
  platform: z.enum(["linkedin", "github", "twitter", "website", "portfolio"]),
  url: z.string().url("URL invalide"),
  is_public: z.boolean().default(true),
});

// Schéma pour la validation des fichiers
export const fileValidationSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB par défaut
  allowedTypes: z.array(z.string()).default(["image/jpeg", "image/png", "image/webp", "application/pdf"]),
});

// Fonction pour valider un fichier
export const validateFile = (file: File, maxSize: number = 10 * 1024 * 1024, allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp", "application/pdf"]) => {
  const errors: string[] = [];

  if (file.size > maxSize) {
    errors.push(`Le fichier est trop volumineux. Taille maximum: ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé. Types autorisés: ${allowedTypes.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Fonction pour sanitizer les entrées utilisateur
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Supprimer les balises HTML basiques
    .replace(/javascript:/gi, "") // Supprimer les protocoles dangereux
    .replace(/on\w+=/gi, ""); // Supprimer les événements JavaScript
};

// Fonction pour valider une URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Fonction pour formater un numéro de téléphone
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Types exportés
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>; 