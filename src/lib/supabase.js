import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ozclbgdqnnpjcjvnxtbn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y2xiZ2Rxbm5wamNqdm54dGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzY2NjIsImV4cCI6MjA2NzQxMjY2Mn0.CPfVra-h8kPxH0d_STrnb0tetN7NDzPsx9norwnYS-g'

let supabaseClient;

try {
  if (!SUPABASE_URL || SUPABASE_URL.includes('<PROJECT-ID>') || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('<ANON_KEY>')) {
    console.warn('Supabase credentials missing or invalid. Auth features will not work.');
    // Create a dummy client that warns on use instead of crashing immediately
    supabaseClient = {
      auth: {
        signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        getUser: () => Promise.resolve({ data: { user: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        upsert: () => Promise.resolve({ data: [], error: null }),
        delete: () => Promise.resolve({ data: [], error: null }),
        eq: function() { return this; },
        order: function() { return this; },
        limit: function() { return this; },
        single: function() { return this; }
      })
    };
  } else {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabaseClient = { auth: {}, from: () => {} }; // Minimal fallback
}

export default supabaseClient;