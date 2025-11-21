import { z } from 'zod'

export const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zip_code: z.string().min(1),
  complement: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export const requestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
})

export const proposalSchema = z.object({
  request_id: z.string().uuid(),
  amount: z.number().positive(),
  message: z.string().min(1),
  proposed_date: z.string().datetime(),
  expires_at: z.string().datetime().optional(),
})

export const orderSchema = z.object({
  proposal_id: z.string().uuid(),
  status: z.enum(['PENDING', 'STARTED', 'COMPLETED', 'CANCELLED']).optional(),
  payment_status: z.enum(['HELD', 'RELEASED', 'REFUND']).optional(),
})

export const reviewSchema = z.object({
  order_id: z.string().uuid(),
  rating: z.number().int().min(0).max(5),
  comment: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.enum(['provider', 'requester', 'admin']).optional(),
})

export const providerProfileSchema = z.object({
  bio: z.string().optional(),
  price_base: z.number().positive().optional(),
})

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}