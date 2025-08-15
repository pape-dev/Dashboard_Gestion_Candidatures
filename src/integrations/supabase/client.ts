// Centralize Supabase client: reuse env-based client from `@/lib/supabase`.
// This ensures no credentials are hardcoded and all imports stay consistent.
import { supabase } from '@/lib/supabase';
export { supabase };
export type { Database } from './types';