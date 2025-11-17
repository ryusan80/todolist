import { createClient } from "@supabase/supabase-js";

// Support both Vite-style VITE_* env names and NEXT_PUBLIC_* names in case
// the developer used a template that populated NEXT_PUBLIC_* variables.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard: provide a clear error when env vars are missing to help debugging in dev
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) must be set in your environment (.env.local)."
  );
}

export const supabase = createClient(
  supabaseUrl as string,
  supabaseAnonKey as string
);

export default supabase;
