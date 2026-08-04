import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null
let publicClient: SupabaseClient | null = null

function getConnectionDetails() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error('A conexão com a lista ainda não foi configurada.')
  }

  return { publishableKey, url }
}

export function getSupabaseClient(): SupabaseClient {
  if (client) return client

  const { publishableKey, url } = getConnectionDetails()

  client = createClient(url, publishableKey)
  return client
}

export function getPublicSupabaseClient(): SupabaseClient {
  if (publicClient) return publicClient

  const { publishableKey, url } = getConnectionDetails()
  publicClient = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
  return publicClient
}
