import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export function adminClient() {
  if (!url || !serviceKey) throw new Error('Missing Supabase server envs');
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
export function publicClient() {
  if (!url || !anonKey) throw new Error('Missing Supabase public envs');
  return createClient(url, anonKey, { auth: { persistSession: false } });
}
