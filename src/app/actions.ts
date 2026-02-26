'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { Card, Voucher, VoucherPeriod, VoucherStatus } from '@/lib/types'

// ==================== CARD ACTIONS ====================

export async function getCards() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function addCard(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const bank = formData.get('bank') as string
  const last4 = formData.get('last4') as string
  const variant = formData.get('variant') as string
  const cardName = formData.get('cardName') as string
  const notes = formData.get('notes') as string
  
  const { data, error } = await supabase
    .from('cards')
    .insert({
      user_id: user.id,
      bank,
      last4,
      variant,
      card_name: cardName || null,
      notes: notes || null,
      is_active: true,
    })
    .select()
    .single()
  
  if (error) throw error
  revalidatePath('/dashboard')
  return data
}

export async function updateCard(cardId: string, formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const bank = formData.get('bank') as string
  const last4 = formData.get('last4') as string
  const variant = formData.get('variant') as string
  const cardName = formData.get('cardName') as string
  const notes = formData.get('notes') as string
  const isActive = formData.get('isActive') === 'true'
  
  const { data, error } = await supabase
    .from('cards')
    .update({
      bank,
      last4,
      variant,
      card_name: cardName || null,
      notes: notes || null,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cardId)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  revalidatePath('/dashboard')
  return data
}

export async function deleteCard(cardId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id)
  
  if (error) throw error
  revalidatePath('/dashboard')
}

// ==================== VOUCHER ACTIONS ====================

export async function getVouchers() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data: vouchers, error } = await supabase
    .from('vouchers')
    .select(`
      *,
      periods:voucher_periods(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return vouchers || []
}

export async function addVoucher(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const cardId = formData.get('cardId') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const cycleType = formData.get('cycleType') as string
  const category = formData.get('category') as string
  const value = parseFloat(formData.get('value') as string) || 0
  const reminderDays = parseInt(formData.get('reminderDays') as string) || 7
  const notes = formData.get('notes') as string
  
  // Create voucher
  const { data: voucher, error: voucherError } = await supabase
    .from('vouchers')
    .insert({
      user_id: user.id,
      card_id: cardId,
      name,
      description: description || null,
      cycle_type: cycleType,
      category,
      value,
      currency: 'INR',
      status: 'pending',
      reminder_days: reminderDays,
      notes: notes || null,
    })
    .select()
    .single()
  
  if (voucherError) throw voucherError
  
  // Create periods based on cycle type
  const periods = generatePeriods(cycleType)
  const periodInserts = periods.map(p => ({
    voucher_id: voucher.id,
    period: p.period,
    label: p.label,
    status: 'pending' as VoucherStatus,
  }))
  
  const { error: periodsError } = await supabase
    .from('voucher_periods')
    .insert(periodInserts)
  
  if (periodsError) throw periodsError
  
  revalidatePath('/dashboard')
  return voucher
}

export async function updateVoucherPeriod(
  periodId: string,
  status: VoucherStatus,
  details?: {
    soldTo?: string
    soldAmount?: number
    notes?: string
  }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }
  
  if (status === 'redeemed') {
    updateData.redeemed_at = new Date().toISOString()
  } else if (status === 'sold') {
    updateData.sold_at = new Date().toISOString()
    updateData.sold_to = details?.soldTo || null
    updateData.sold_amount = details?.soldAmount || null
  }
  
  if (details?.notes) {
    updateData.notes = details.notes
  }
  
  const { data, error } = await supabase
    .from('voucher_periods')
    .update(updateData)
    .eq('id', periodId)
    .select()
    .single()
  
  if (error) throw error
  
  // Update voucher overall status if all periods are same status
  await updateVoucherOverallStatus(data.voucher_id)
  
  revalidatePath('/dashboard')
  return data
}

async function updateVoucherOverallStatus(voucherId: string) {
  const supabase = createClient()
  
  const { data: periods } = await supabase
    .from('voucher_periods')
    .select('status')
    .eq('voucher_id', voucherId)
  
  if (!periods || periods.length === 0) return
  
  // If all periods have same status, update voucher status
  const allSameStatus = periods.every(p => p.status === periods[0].status)
  if (allSameStatus) {
    await supabase
      .from('vouchers')
      .update({ status: periods[0].status })
      .eq('id', voucherId)
  }
}

export async function deleteVoucher(voucherId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('vouchers')
    .delete()
    .eq('id', voucherId)
    .eq('user_id', user.id)
  
  if (error) throw error
  revalidatePath('/dashboard')
}

// ==================== STATS ACTIONS ====================

export async function getDashboardStats() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  // Get cards count
  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('id, is_active')
    .eq('user_id', user.id)
  
  if (cardsError) throw cardsError
  
  // Get vouchers with periods
  const { data: vouchers, error: vouchersError } = await supabase
    .from('vouchers')
    .select(`
      *,
      periods:voucher_periods(*)
    `)
    .eq('user_id', user.id)
  
  if (vouchersError) throw vouchersError
  
  // Calculate stats
  const stats = {
    totalCards: cards?.length || 0,
    activeCards: cards?.filter(c => c.is_active).length || 0,
    totalVouchers: vouchers?.length || 0,
    vouchersByStatus: {
      pending: 0,
      redeemed: 0,
      sold: 0,
      paused: 0,
      expired: 0,
    } as Record<VoucherStatus, number>,
    totalRedeemed: 0,
    totalSold: 0,
    estimatedValueRedeemed: 0,
    estimatedValueSold: 0,
    upcomingExpirations: 0,
  }
  
  vouchers?.forEach(voucher => {
    stats.vouchersByStatus[voucher.status as VoucherStatus]++
    
    voucher.periods?.forEach((period: VoucherPeriod) => {
      if (period.status === 'redeemed') {
        stats.totalRedeemed++
        stats.estimatedValueRedeemed += voucher.value || 0
      } else if (period.status === 'sold') {
        stats.totalSold++
        stats.estimatedValueSold += (period as unknown as { sold_amount?: number }).sold_amount || voucher.value || 0
      }
    })
  })
  
  return stats
}

// ==================== HELPER FUNCTIONS ====================

function generatePeriods(cycleType: string): { period: string; label: string }[] {
  const year = new Date().getFullYear()
  
  switch (cycleType) {
    case 'monthly':
      return [
        { period: 'jan', label: `Jan ${year}` },
        { period: 'feb', label: `Feb ${year}` },
        { period: 'mar', label: `Mar ${year}` },
        { period: 'apr', label: `Apr ${year}` },
        { period: 'may', label: `May ${year}` },
        { period: 'jun', label: `Jun ${year}` },
        { period: 'jul', label: `Jul ${year}` },
        { period: 'aug', label: `Aug ${year}` },
        { period: 'sep', label: `Sep ${year}` },
        { period: 'oct', label: `Oct ${year}` },
        { period: 'nov', label: `Nov ${year}` },
        { period: 'dec', label: `Dec ${year}` },
      ]
    case 'quarterly':
      return [
        { period: 'q1', label: `Q1 ${year}` },
        { period: 'q2', label: `Q2 ${year}` },
        { period: 'q3', label: `Q3 ${year}` },
        { period: 'q4', label: `Q4 ${year}` },
      ]
    case 'half-yearly':
      return [
        { period: 'h1', label: `H1 ${year}` },
        { period: 'h2', label: `H2 ${year}` },
      ]
    case 'yearly':
      return [{ period: 'yearly', label: `${year}` }]
    default:
      return []
  }
}