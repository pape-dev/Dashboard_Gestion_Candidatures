import { toast } from '@/hooks/use-toast';

// Fonction pour sanitizer les entrées utilisateur
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, "") // Supprimer les balises HTML basiques
    .replace(/javascript:/gi, "") // Supprimer les protocoles dangereux
    .replace(/on\w+=/gi, ""); // Supprimer les événements JavaScript
};

// Fonction pour valider une URL
export const validateUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Fonction pour valider un email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction pour valider un numéro de téléphone
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
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

// Fonction pour valider un fichier
export const validateFile = (
  file: File, 
  maxSize: number = 10 * 1024 * 1024, // 10MB par défaut
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
) => {
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

// Fonction pour gérer les erreurs Supabase
export const handleSupabaseError = (error: any, context: string = 'Opération'): void => {
  console.error(`[${context}] Supabase Error:`, error);

  let userMessage = 'Une erreur est survenue';
  let variant: 'default' | 'destructive' = 'destructive';

  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        userMessage = 'Aucune donnée trouvée';
        variant = 'default';
        break;
      case '23505': // Unique violation
        userMessage = 'Cette donnée existe déjà';
        break;
      case '23503': // Foreign key violation
        userMessage = 'Impossible de supprimer cette donnée car elle est utilisée ailleurs';
        break;
      case '42P01': // Table doesn't exist
        userMessage = 'Erreur de configuration de la base de données';
        break;
      case '42501': // Insufficient privilege
        userMessage = 'Vous n\'avez pas les permissions nécessaires';
        break;
      case '42703': // Column doesn't exist
        userMessage = 'Erreur de configuration de la base de données';
        break;
      default:
        userMessage = error.message || 'Une erreur de base de données est survenue';
    }
  } else if (error?.message) {
    userMessage = error.message;
  }

  toast({
    title: "Erreur",
    description: userMessage,
    variant,
  });
};

// Fonction pour gérer les erreurs de validation
export const handleValidationError = (errors: any, context: string = 'Validation'): void => {
  console.error(`[${context}] Validation Error:`, errors);

  const errorMessages = Object.values(errors).map((error: any) => error.message);
  const userMessage = errorMessages.join(', ');

  toast({
    title: "Erreur de validation",
    description: userMessage,
    variant: "destructive",
  });
};

// Fonction pour gérer les erreurs de fichiers
export const handleFileError = (error: any, context: string = 'Fichier'): void => {
  console.error(`[${context}] File Error:`, error);

  let userMessage = 'Erreur lors du traitement du fichier';

  if (error?.code === 'FILE_TOO_LARGE') {
    userMessage = 'Le fichier est trop volumineux';
  } else if (error?.code === 'INVALID_FILE_TYPE') {
    userMessage = 'Type de fichier non autorisé';
  } else if (error?.code === 'UPLOAD_FAILED') {
    userMessage = 'Échec du téléchargement du fichier';
  }

  toast({
    title: "Erreur de fichier",
    description: userMessage,
    variant: "destructive",
  });
};

// Fonction pour gérer les erreurs d'authentification
export const handleAuthError = (error: any, context: string = 'Authentification'): void => {
  console.error(`[${context}] Auth Error:`, error);

  let userMessage = 'Erreur d\'authentification';

  if (error?.message?.includes('Invalid login credentials')) {
    userMessage = 'Email ou mot de passe incorrect';
  } else if (error?.message?.includes('Email not confirmed')) {
    userMessage = 'Veuillez confirmer votre email';
  } else if (error?.message?.includes('User already registered')) {
    userMessage = 'Un compte existe déjà avec cet email';
  } else if (error?.message?.includes('Password should be at least')) {
    userMessage = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  toast({
    title: "Erreur d'authentification",
    description: userMessage,
    variant: "destructive",
  });
};

// Fonction pour gérer les erreurs génériques
export const handleGenericError = (error: any, context: string = 'Application'): void => {
  console.error(`[${context}] Generic Error:`, error);

  const userMessage = error?.message || 'Une erreur inattendue est survenue';

  toast({
    title: "Erreur",
    description: userMessage,
    variant: "destructive",
  });
};

// Fonction pour retry automatique
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }

      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
}; 