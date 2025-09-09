
import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

/**
 * Get admin client with service role key (for server-side operations)
 * @returns {SupabaseClient} Admin client
 */
export function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { 
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      fetch: fetch
    }
  });
}

/**
 * Get server client with anon key (for public operations)
 * @returns {SupabaseClient} Server client
 */
export function getServerClient() {
  if (!supabaseAnonKey) {
    throw new Error('Missing SUPABASE_ANON_KEY environment variable');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { 
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      fetch: fetch
    }
  });
}

/**
 * Get client-side client (for browser use)
 * @returns {SupabaseClient} Client-side client
 */
export function getClientClient() {
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Default export for backward compatibility
export default getAdminClient;
