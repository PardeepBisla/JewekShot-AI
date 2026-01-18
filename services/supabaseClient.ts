
import { createClient } from '@supabase/supabase-js';

// Attempt to get keys from various possible environment variable names to handle both 
// local development and different cloud environment conventions.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Prevent 'supabaseUrl is required' error by providing a dummy URL if keys are missing.
// This allows the app to boot so the developer can see error logs or UI feedback 
// rather than crashing the entire script bundle.
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const validKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(validUrl, validKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. " +
    "Authentication will not work until these environment variables are provided."
  );
}
