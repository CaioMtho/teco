import type { Database } from '../types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ProfileCreate = Database['public']['Tables']['profiles']['Insert']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function insertProfile(
  supabase: SupabaseClient<Database>,
  newProfile: ProfileCreate
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProfileByAuthId(
  supabase: SupabaseClient<Database>,
  authId: string
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('auth_id', authId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getProfileById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: ProfileUpdate
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .update(changes)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProfile(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}