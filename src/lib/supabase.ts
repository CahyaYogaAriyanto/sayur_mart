import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables exist before creating the client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase credentials are missing! \n" +
    "1. Go to Settings -> Environment Variables\n" +
    "2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n" +
    "3. Restart the dev server."
  );
}

// Singleton pattern - hanya buat satu instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      supabaseUrl || 'https://ulewxvkkhokduobylafd.supabase.co', 
      supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXd4dmtraG9rZHVvYnlsYWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjY2NzQsImV4cCI6MjA5MzQwMjY3NH0.9iZTkKA1CDtUc3D-cbaSzyclwW8fbEQJ2k2n11PvxAQ',
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false, // Disable untuk menghindari race condition
          flowType: 'pkce',
          storageKey: 'sayurmart-auth',
          storage: window.localStorage,
          lock: false, // Disable lock untuk menghindari conflict
        },
        global: {
          headers: {
            'x-client-info': 'sayurmart-web',
          },
        },
      }
    );
  }
  return supabaseInstance;
})();
