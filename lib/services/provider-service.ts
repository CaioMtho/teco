import { Database } from '../types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ProviderProfileCreate = Database['public']['Tables']['provider_profiles']['Insert']
export type ProviderProfileRow = Database['public']['Tables']['provider_profiles']['Row']
export type ProviderProfileUpdate = Database['public']['Tables']['provider_profiles']['Update']
export type SkillCreate = Database['public']['Tables']['skills']['Insert']
export type SkillRow = Database['public']['Tables']['skills']['Row']
export type ProviderSkillCreate = Database['public']['Tables']['provider_skills']['Insert']
export type ProviderSkillRow = Database['public']['Tables']['provider_skills']['Row']

export async function createProviderProfile(
  supabase: SupabaseClient<Database>,
  providerProfile: ProviderProfileCreate
): Promise<ProviderProfileRow> {
  const { data, error } = await supabase
    .from('provider_profiles')
    .insert(providerProfile)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProviderProfileByUserId(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<ProviderProfileRow | null> {
  const { data, error } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateProviderProfile(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: ProviderProfileUpdate
): Promise<ProviderProfileRow> {
  const { data, error } = await supabase
    .from('provider_profiles')
    .update(changes)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProviderProfile(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('provider_profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function createOrGetSkill(
  supabase: SupabaseClient<Database>,
  skillName: string,
  category?: string
): Promise<SkillRow> {
  const { data: existing, error: findError } = await supabase
    .from('skills')
    .select('*')
    .eq('name', skillName)
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing

  const { data, error } = await supabase
    .from('skills')
    .insert({ name: skillName, category })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function addSkillToProvider(
  supabase: SupabaseClient<Database>,
  providerSkill: ProviderSkillCreate
): Promise<ProviderSkillRow> {
  const { data, error } = await supabase
    .from('provider_skills')
    .insert(providerSkill)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProviderSkills(
  supabase: SupabaseClient<Database>,
  providerId: string
): Promise<Array<SkillRow & { experience_years?: number }>> {
  const { data, error } = await supabase
    .from('provider_skills')
    .select('*, skills(*)')
    .eq('provider_id', providerId)

  if (error) throw error

  return (data ?? []).map(ps => ({
    ...(ps.skills as SkillRow),
    experience_years: ps.experience_years ?? undefined
  }))
}

export async function removeSkillFromProvider(
  supabase: SupabaseClient<Database>,
  providerId: string,
  skillId: string
): Promise<void> {
  const { error } = await supabase
    .from('provider_skills')
    .delete()
    .eq('provider_id', providerId)
    .eq('skill_id', skillId)

  if (error) throw error
}

export async function searchSkills(
  supabase: SupabaseClient<Database>,
  query: string
): Promise<SkillRow[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10)

  if (error) throw error
  return data ?? []
}
