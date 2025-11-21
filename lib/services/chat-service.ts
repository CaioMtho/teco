import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

export type ChatMessageRow = Database['public']['Tables']['chat_messages']['Row']
export type ChatMessageCreate = Database['public']['Tables']['chat_messages']['Insert']
export type ProposalRow = Database['public']['Tables']['proposals']['Row']
export type ProposalCreate = Database['public']['Tables']['proposals']['Insert']
export type ProposalUpdate = Database['public']['Tables']['proposals']['Update']
export type ConversationsRow = Database['public']['Tables']['conversations']['Row']
export type ConversationsCreate = Database['public']['Tables']['conversations']['Insert']

export async function sendMessage(
  supabase: SupabaseClient<Database>,
  message: ChatMessageCreate
): Promise<ChatMessageRow> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMessagesByConversationId(
  supabase: SupabaseClient<Database>,
  conversationId: string,
  opts?: { limit?: number; before?: string }
): Promise<ChatMessageRow[]> {
  let query = supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })

  if (opts?.before) {
    query = query.lt('created_at', opts.before)
  }

  if (opts?.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return (data ?? []).reverse()
}

export async function sendProposal(
  supabase: SupabaseClient<Database>,
  proposal: ProposalCreate
): Promise<ProposalRow> {
  const existing = await getProposalByRequestAndProvider(
    supabase,
    proposal.request_id,
    proposal.provider_id
  )

  if (existing) {
    throw new Error('Proposal already exists for this request and provider')
  }

  const { data, error } = await supabase
    .from('proposals')
    .insert([proposal])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProposalByRequestAndProvider(
  supabase: SupabaseClient<Database>,
  requestId: string,
  providerId: string
): Promise<ProposalRow | null> {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('request_id', requestId)
    .eq('provider_id', providerId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getProposalsByRequestId(
  supabase: SupabaseClient<Database>,
  requestId: string
): Promise<ProposalRow[]> {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('request_id', requestId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function updateProposal(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: ProposalUpdate
): Promise<ProposalRow> {
  const { data, error } = await supabase
    .from('proposals')
    .update(changes)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createChat(
  supabase: SupabaseClient<Database>,
  conversation: ConversationsCreate
): Promise<ConversationsRow> {
  const { data, error } = await supabase
    .from('conversations')
    .insert([conversation])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getConversationById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<ConversationsRow> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getConversationsByProfileId(
  supabase: SupabaseClient<Database>,
  profileId: string
): Promise<ConversationsRow[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`provider_id.eq.${profileId},requester_id.eq.${profileId}`)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function deleteMessage(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function deleteProposal(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('proposals')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}