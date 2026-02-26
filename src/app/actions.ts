import type { Voucher } from '../lib/schema'
import { createServerClient as createServerClientImpl } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

function createServerClient() {
  return createServerClientImpl(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookies().set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookies().set({ name, value: '', ...options })
        },
      },
    }
  )
}

export async function getVouchers() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .eq('user_id', user.id)
    .order('cardName')
  if (error) throw error
  return data as Voucher[]
}

export async function toggleQuarter(voucherId: string, quarter: 'q1' | 'q2' | 'q3' | 'q4', value: boolean) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase
    .from('vouchers')
    .update({ [quarter]: value })
    .eq('id', voucherId)
    .eq('user_id', user.id)
  if (error) throw error
}