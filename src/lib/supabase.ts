import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import config from '@/config/environment';

// Valeurs de secours pour éviter un crash en développement si .env.local n'est pas encore configuré
const fallbackUrl = 'http://localhost:54321';
const fallbackAnon = 'dev-anon-key';

const supabaseUrl = config.supabase.url || (import.meta.env.DEV ? fallbackUrl : '');
const supabaseAnonKey = config.supabase.anonKey || (import.meta.env.DEV ? fallbackAnon : '');

// Expose configuration flags so the app can avoid network calls when not configured
export const isSupabaseConfigured = Boolean(config.supabase.url && config.supabase.anonKey);
export const isUsingFallbackSupabase = !isSupabaseConfigured && import.meta.env.DEV;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': `${config.app.name}@${config.app.version}`,
    },
  },
});

// Helper pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur de connexion Supabase:', error);
    return false;
  }
};