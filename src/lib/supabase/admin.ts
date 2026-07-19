import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// WARNING: This client bypasses Row Level Security entirely.
// Only ever import this in server-only code (Route Handlers, Server Actions).
// NEVER import this in a Client Component or expose it to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
