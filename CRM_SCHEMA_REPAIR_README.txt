MEEQAN CRM — DATABASE COMPATIBILITY NOTE

This package updates the CRM JavaScript mappings to use the existing Supabase tables and columns reported by the project schema. It does not change the website design or login flow.

IMPORTANT: Do not run the older 05_repair_existing_schema.sql from any previous ZIP. It creates duplicate tables and expects columns that are not in your live schema. This package intentionally does not include that unsafe repair script.

The frontend can only save if the signed-in account has permission under the existing Supabase Row Level Security (RLS) policies. This ZIP does not change or reset RLS policies, user roles, or existing records. If saving still reports a permission/RLS error, share the exact error text before changing database policies.

Please upload the website files and test one record per section. This package has not been connected to your live Supabase project, so a live save cannot be guaranteed from offline checks alone.
