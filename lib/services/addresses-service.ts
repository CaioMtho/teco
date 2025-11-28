import { Database } from '../types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type AddressCreate = Database['public']['Tables']['addresses']['Insert']
export type AddressRow = Database['public']['Tables']['addresses']['Row']
export type ProfileAddressCreate = Database['public']['Tables']['profile_addresses']['Insert']
export type ProfileAddressRow = Database['public']['Tables']['profile_addresses']['Row']
export type OrderAddressCreate = Database['public']['Tables']['order_addresses']['Insert']
export type OrderAddressRow = Database['public']['Tables']['order_addresses']['Row']

export async function insertAddress(
  supabase: SupabaseClient<Database>,
  newAddress: AddressCreate
): Promise<AddressRow> {
  const { data, error } = await supabase
    .from('addresses')
    .insert(newAddress)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function linkAddressToProfile(
  supabase: SupabaseClient<Database>,
  profileAddress: ProfileAddressCreate
): Promise<ProfileAddressRow> {
  const { data, error } = await supabase
    .from('profile_addresses')
    .insert(profileAddress)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function linkAddressToOrder(
  supabase: SupabaseClient<Database>,
  orderAddress: OrderAddressCreate
): Promise<OrderAddressRow> {
  const { data, error } = await supabase
    .from('order_addresses')
    .insert(orderAddress)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAddressesByProfileIds(
  supabase: SupabaseClient<Database>,
  profileIds: string[]
): Promise<Array<AddressRow & { profile_id: string; is_primary: boolean }>> {
  if (!profileIds?.length) return []

  const { data, error } = await supabase
    .from('profile_addresses')
    .select('*, addresses(*)')
    .in('profile_id', profileIds)

  if (error) throw error

  return (data ?? []).map(pa => ({
    ...(pa.addresses as AddressRow),
    profile_id: pa.profile_id,
    is_primary: pa.is_primary ?? false
  }))
}

export async function getPrimaryAddressByProfileId(
  supabase: SupabaseClient<Database>,
  profileId: string
): Promise<AddressRow | null> {
  const { data, error } = await supabase
    .from('profile_addresses')
    .select('addresses(*)')
    .eq('profile_id', profileId)
    .eq('is_primary', true)
    .maybeSingle()

  if (error) throw error
  return data?.addresses as AddressRow | null
}

export async function getAddressesByOrderId(
  supabase: SupabaseClient<Database>,
  orderId: string
): Promise<Array<AddressRow & { address_type: string }>> {
  const { data, error } = await supabase
    .from('order_addresses')
    .select('*, addresses(*)')
    .eq('order_id', orderId)

  if (error) throw error

  return (data ?? []).map(oa => ({
    ...(oa.addresses as AddressRow),
    address_type: oa.address_type
  }))
}

export async function updateAddress(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: Partial<AddressCreate>
): Promise<AddressRow> {
  const { data, error } = await supabase
    .from('addresses')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAddress(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)

  if (error) throw error
}
