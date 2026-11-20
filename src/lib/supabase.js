// src/lib/supabase.js
// Supabase client — used by both frontend and backend

import { createClient } from '@supabase/supabase-js';

// Support Vite client-side env, Node.js process.env, and hardcoded fallback
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://mcpzrjigpkdtpgezhqnc.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_Giy7_is6Wmq3VP_9Gt_FuA_BoRi1FLt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
