import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erreur session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await ensureUserProfile(session.user);
          }
        }
      } catch (error) {
        console.error('Erreur session:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        await ensureUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
      
      if (!initialized) {
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, toast]);

  const ensureUserProfile = async (user: User) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Erreur lors de la création du profil:', insertError);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du profil:', error);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error("Configuration Supabase manquante") };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
          },
        },
      });

      if (error) throw error;


      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error("Configuration Supabase manquante") };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Configuration Supabase manquante") };
    }

    try {
      // Nettoyer le state local avant la déconnexion
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error("Configuration Supabase manquante") };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;


      return { data, error: null };
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation:', error);
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: { first_name?: string; last_name?: string; avatar_url?: string }) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error("Configuration Supabase manquante") };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
  };
};