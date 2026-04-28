// Replace these with YOUR actual Supabase project values
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // ← YOUR PROJECT URL
const SUPABASE_ANON_KEY = 'eyJ...';                 // ← YOUR ANON KEY

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);