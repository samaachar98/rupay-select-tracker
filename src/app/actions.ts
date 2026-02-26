import type { Voucher } from '@/lib/schema'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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