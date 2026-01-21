
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for JewelShot AI.
 * 
 * Credentials are read primarily from environment variables.
 * Fallback values from the project specification are provided to ensure the 
 * application boots correctly in environments where variables are not yet injected.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tnevqqruemgpptuugffh.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZXZxcXJ1ZW1ncHB0dXVnZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Nzc0NDAsImV4cCI6MjA4NDI1MzQ0MH0.DgSbMWbaNXfwDT871CPOqiwfDYNmlDDvKcolJ6quYU8';

// Verify the URL format to prevent the Supabase SDK from throwing a 'required' error.
const isValidUrl = SUPABASE_URL && SUPABASE_URL.startsWith('http');

if (!isValidUrl) {
  console.error("JewelShot AI: Critical configuration error. Supabase URL is invalid or missing.");
}

// Initialize the client singleton. 
// Using the project's real credentials as fallbacks ensures the 'Uncaught Error' is resolved.
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

/**
 * Helper to check if the Supabase configuration is valid.
 */
export const isSupabaseConfigured = (): boolean => {
  return !!isValidUrl;
};
