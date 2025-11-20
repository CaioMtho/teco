import { Database } from '../types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export type OrderRow = Database['public']['Tables']['orders']['Row']
export type OrderCreate = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export async function getOrderByProposalId(
  supabase: SupabaseClient<Database>,
  proposalId: string
): Promise<OrderRow | null> {
  const { data, error } = await supabase
    .from('orders')
    .select()
    .eq('proposal_id', proposalId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getOrderById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<OrderRow> {
  const { data, error } = await supabase
    .from('orders')
    .select()
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createOrder(
  supabase: SupabaseClient<Database>,
  newOrder: OrderCreate
): Promise<OrderRow> {
  const { data, error } = await supabase
    .from('orders')
    .insert(newOrder)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOrder(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: OrderUpdate
): Promise<OrderRow> {
  const { data, error } = await supabase
    .from('orders')
    .update(changes)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOrder(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function startOrder(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<OrderRow> {
  return updateOrder(supabase, id, {
    status: 'STARTED',
    started_at: new Date().toISOString()
  })
}

export async function completeOrder(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<OrderRow> {
  return updateOrder(supabase, id, {
    status: 'COMPLETED',
    finished_at: new Date().toISOString(),
    client_confirmed: true
  })
}

export async function cancelOrder(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<OrderRow> {
  return updateOrder(supabase, id, {
    status: 'CANCELLED',
    cancelled_at: new Date().toISOString()
  })
}

export async function releasePayment(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<OrderRow> {
  return updateOrder(supabase, id, {
    payment_status: 'RELEASED',
    payment_released_at: new Date().toISOString()
  })
}
