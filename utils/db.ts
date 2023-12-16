import { createClient } from "supabase";

const SUPABASE_URL = Deno?.env?.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno?.env?.get("SUPABASE_ANON_KEY")!;

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
) : null;
