import type { Database } from '../types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ProfileCreate = Database['public']['Tables']['profiles']['Insert']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']

export async function insertProfile(
    supabase: SupabaseClient<Database>,
    newProfile: ProfileCreate
): Promise<ProfileRow> {
    const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function getProfileByAuthId(
    supabase: SupabaseClient<Database>,
    authId: string
): Promise<ProfileRow> {
    const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('auth_id', authId)
        .single();

    if (error) throw error;

    return data;
}
