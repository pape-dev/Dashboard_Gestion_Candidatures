import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        console.log('🔍 useAuth: Début getSession');
        console.log('🔍 useAuth: isSupabaseConfigured =', isSupabaseConfigured);
        console.log('🔍 useAuth: VITE_SUPABASE_URL =', import.meta.env.VITE_SUPABASE_URL);
        console.log('🔍 useAuth: VITE_SUPABASE_ANON_KEY =', import.meta.env.VITE_SUPABASE_ANON_KEY);
        
        if (!isSupabaseConfigured) {
          console.log('⚠️ useAuth: Supabase non configuré, arrêt du chargement');
          // En dev sans config, ne pas tenter d'appel réseau
          setLoading(false);
          return;
        }
        
        console.log('🔍 useAuth: Tentative de récupération de session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        console.log('✅ useAuth: Session récupérée:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Créer le profil utilisateur s'il n'existe pas
        if (session?.user) {
          await ensureUserProfile(session.user);
        }
      } catch (error) {
        console.error('❌ useAuth: Erreur lors de la récupération de la session:', error);
        toast({
          title: "Erreur d'authentification",
          description: "Impossible de récupérer la session utilisateur",
          variant: "destructive",
        });
      } finally {
        console.log('🏁 useAuth: Fin getSession, loading = false');
        setLoading(false);
      }
    };

    getSession();

    // Timeout de sécurité pour éviter le blocage infini
    const timeoutId = setTimeout(() => {
      console.log('⏰ useAuth: Timeout de sécurité, forcing loading = false');
      setLoading(false);
    }, 5000);

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 useAuth: Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        await ensureUserProfile(session.user);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${session.user.user_metadata?.first_name || session.user.email}!`,
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profil n'existe pas, le créer
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

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Configuration Supabase manquante. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local");
      }
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "Vérification requise",
          description: "Veuillez vérifier votre email pour activer votre compte",
        });
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Configuration Supabase manquante. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local");
      }
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Configuration Supabase manquante. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local");
      }
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Configuration Supabase manquante. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local");
      }
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation:', error);
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: { first_name?: string; last_name?: string; avatar_url?: string }) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Configuration Supabase manquante. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local");
      }
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