import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Return a no-op client during build if env vars are missing
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing - using placeholder')
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder'
    )
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}