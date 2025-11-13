import { Database } from '../../lib/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type AddressCreate = Database['public']['Tables']['addresses']['Insert'];
export type AddressRow = Database['public']['Tables']['addresses']['Row'];

export async function insertAddress(
    supabase: SupabaseClient<Database>,
    newAddress: AddressCreate
): Promise<AddressRow> {
    const { data, error } = await supabase
        .from('addresses')
        .insert(newAddress)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function getAddressesByUserIds(
  supabase: SupabaseClient<Database>,
  userIds: string[]
): Promise<AddressRow[]> {
  if (!userIds?.length) return []
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .in('user_id', userIds)

  if (error) throw error
  return (data ?? []) as AddressRow[]
}
