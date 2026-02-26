import { z } from 'zod'

export const voucherSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  cardName: z.string(),
  voucherName: z.string(),
  cardType: z.enum(['quarterly', 'half_yearly', 'yearly']).optional(),
  q1: z.boolean(),
  q2: z.boolean(),
  q3: z.boolean(),
  q4: z.boolean(),
  halfYear1: z.boolean().default(false),
  halfYear2: z.boolean().default(false),
  yearly: z.boolean().default(false),
  lastRedeemed: z.string().optional(),
  notes: z.string().optional(),
})

export type Voucher = z.infer<typeof voucherSchema>

export const createVoucherSchema = voucherSchema.omit({ id: true }).partial({ userId: true })
export const updateVoucherSchema = voucherSchema.partial().extend({ id: z.string() })