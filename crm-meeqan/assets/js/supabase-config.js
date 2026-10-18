/* Meeqan CRM Supabase configuration.
   The publishable/anon key is safe for browser use. Security is enforced with Supabase Auth + RLS. */
window.meeqanSupabase = window.supabase.createClient(
  'https://jrzxymykwcelpxxkbwlz.supabase.co',
  'sb_publishable_5-EyFGXY_lQqESbHGVnUUw_EHsW56l'
);
