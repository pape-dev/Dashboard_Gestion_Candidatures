import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          title: string | null;
          bio: string | null;
          phone: string | null;
          location: string | null;
          website: string | null;
          avatar_url: string | null;
          linkedin_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          title?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          website?: string | null;
          avatar_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          title?: string | null;
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          website?: string | null;
          avatar_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          position: string;
          location: string;
          status: string;
          applied_date: string;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          description: string;
          priority: string;
          contact_person: string;
          contact_email: string;
          next_step: string;
          job_url: string;
          company_logo_url: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          position: string;
          location?: string;
          status?: string;
          applied_date?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          description?: string;
          priority?: string;
          contact_person?: string;
          contact_email?: string;
          next_step?: string;
          job_url?: string;
          company_logo_url?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          position?: string;
          location?: string;
          status?: string;
          applied_date?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          description?: string;
          priority?: string;
          contact_person?: string;
          contact_email?: string;
          next_step?: string;
          job_url?: string;
          company_logo_url?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}