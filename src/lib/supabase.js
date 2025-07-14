import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ozclbgdqnnpjcjvnxtbn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y2xiZ2Rxbm5wamNqdm54dGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzY2NjIsImV4cCI6MjA2NzQxMjY2Mn0.CPfVra-h8kPxH0d_STrnb0tetN7NDzPsx9norwnYS-g'

if (SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})