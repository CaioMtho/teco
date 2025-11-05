import { Database } from '../../lib/types/database.types'
import { supabase } from '../supabase/client'

export type AddressCreate = Database['public']['Tables']['addresses']['Insert'];
export type AddressRow = Database['public']['Tables']['addresses']['Row'];

export async function insertAddress(newAddress : AddressCreate) : Promise<AddressRow>{
    const { data, error } = await supabase.from('addresses')
        .insert(newAddress)
        .select()
        .single();

    if (error) throw error;

    return data;
}