import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// El cliente público debe poder arrancar aunque el deployment no tenga todavía
// las variables configuradas. Las operaciones de datos fallarán de forma
// controlada y los stores ya tienen valores por defecto para ese caso.
const clientUrl = supabaseUrl || "https://placeholder.supabase.co";
const clientKey = supabaseAnonKey || "public-anon-key-placeholder";

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(clientUrl, clientKey);
