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