
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for JewelShot AI.
 * 
 * Safe environment variable access for browser contexts.
 */
const safeGetEnv = (key: string): string | undefined => {
  try {
    // @ts-ignore - process might not be defined in all environments
    return typeof process !== 'undefined' ? process.env[key] : undefined;
  } catch {
    return undefined;
  }
};

const SUPABASE_URL = safeGetEnv('NEXT_PUBLIC_SUPABASE_URL') || 'https://tnevqqruemgpptuugffh.supabase.co';
const SUPABASE_ANON_KEY = safeGetEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZXZxcXJ1ZW1ncHB0dXVnZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Nzc0NDAsImV4cCI6MjA4NDI1MzQ0MH0.DgSbMWbaNXfwDT871CPOqiwfDYNmlDDvKcolJ6quYU8';

const isValidUrl = SUPABASE_URL && SUPABASE_URL.startsWith('http');

// Initialize the client singleton. 
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Increase timeout for slow networks
      storageKey: 'jewelshot-auth-token'
    }
  }
);

/**
 * Helper to check if the Supabase configuration is valid.
 */
export const isSupabaseConfigured = (): boolean => {
  return isValidUrl;
};
