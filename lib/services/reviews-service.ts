import { Database } from '../types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ReviewCreate = Database['public']['Tables']['reviews']['Insert']
export type ReviewRow = Database['public']['Tables']['reviews']['Row']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export async function createReview(
  supabase: SupabaseClient<Database>,
  review: ReviewCreate
): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getReviewByOrderId(
  supabase: SupabaseClient<Database>,
  orderId: string
): Promise<ReviewRow | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateReview(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: ReviewUpdate
): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from('reviews')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteReview(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) throw error
}