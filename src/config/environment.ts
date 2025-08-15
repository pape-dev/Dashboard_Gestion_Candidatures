// Configuration des variables d'environnement
export const config = {
  // Configuration Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  // Configuration de l'application
  app: {
    name: import.meta.env.VITE_APP_NAME || "Dashboard Gestion Candidatures",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    environment: import.meta.env.VITE_APP_ENVIRONMENT || "development",
  },

  // Configuration des fichiers
  files: {
    maxSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || "10485760"), // 10MB par défaut
    allowedTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/webp,application/pdf").split(","),
  },

  // Configuration des analytics
  analytics: {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
    errorReporting: import.meta.env.VITE_ERROR_REPORTING_ENABLED === "true",
  },

  // Configuration de sécurité
  security: {
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || "3600000"), // 1 heure par défaut
    maxRetryAttempts: parseInt(import.meta.env.VITE_MAX_RETRY_ATTEMPTS || "3"),
  },

  // Validation de la configuration
  validate: () => {
    const errors: string[] = [];

    if (!config.supabase.url) {
      errors.push("VITE_SUPABASE_URL est requis");
    }

    if (!config.supabase.anonKey) {
      errors.push("VITE_SUPABASE_ANON_KEY est requis");
    }

    if (errors.length > 0) {
      // En développement, on ne bloque pas l'application pour permettre l'affichage de l'UI.
      // On journalise simplement un avertissement clair.
      console.warn(`Configuration Supabase manquante: ${errors.join(", ")}. ` +
        `Ajoutez un fichier .env.local avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer l'authentification.`);
    }
  },
};

// Validation automatique au chargement
// En développement, on valide mais sans interrompre l'exécution (voir console.warn ci-dessus)
if (import.meta.env.DEV) {
  config.validate();
}

export default config; 