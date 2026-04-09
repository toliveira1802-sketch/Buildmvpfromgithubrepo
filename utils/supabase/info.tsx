/** Supabase project ID extracted from the URL */
export const projectId = import.meta.env.VITE_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] ?? '';

/** Public anon key for client-side usage */
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';