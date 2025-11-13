// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Database } from '../types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'
import { getAddressesByUserIds } from './addresses-services';

export type RequestCreate = Database['public']['Tables']['requests']['Insert'];
export type RequestRow = Database['public']['Tables']['requests']['Row'];
export type RequestWithAddress = RequestRow & { address?: Database['public']['Tables']['addresses']['Row'] | null }
export type RequestUpdate = Database['public']['Tables']['requests']['Update'];

export async function getRequests(
  supabase: SupabaseClient<Database>,
  opts?: {
    requester_id?: string
    status?: string
    title?: string
    page?: number
    perPage?: number
    orderBy?: keyof Database['public']['Tables']['requests']['Row']
    order?: 'asc' | 'desc'
  }
): Promise<{
  data: RequestWithAddress[]
  count: number
  page: number
  perPage: number
  totalPages: number
}> {
  const {
    requester_id,
    status,
    title,
    page = 1,
    perPage = 20,
    orderBy = 'created_at',
    order = 'desc',
  } = opts ?? {}

  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 20
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const from = (safePage - 1) * safePerPage
  const to = from + safePerPage - 1

  let query = supabase
    .from('requests')
    .select('*', { count: 'exact' })

  if (requester_id) query = query.eq('requester_id', requester_id)
  if (status) query = query.eq('status', status)
  if (title) query = query.ilike('title', `%${title}%`)
  if (orderBy) query = query.order(String(orderBy), { ascending: order === 'asc' })

  const { data, count, error } = await query.range(from, to)

  if (error) throw error

  const rows = (data ?? []) as RequestRow[]
  const total = typeof count === 'number' ? count : rows.length
  const totalPages = safePerPage > 0 ? Math.ceil(total / safePerPage) : 0

  const requesterIds = Array.from(new Set(rows.map(r => r.requester_id).filter(Boolean))) as string[]
  const addresses = await getAddressesByUserIds(supabase, requesterIds)
  const addrByUser = new Map(addresses.map(a => [a.user_id, a]))

  const dataWithAddress: RequestWithAddress[] = rows.map(r => ({
    ...r,
    address: addrByUser.get(r.requester_id) ?? null,
  }))

  return {
    data: dataWithAddress,
    count: total,
    page: safePage,
    perPage: safePerPage,
    totalPages,
  }
}



export async function getRequestById(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<RequestWithAddress> {
  const { data: request, error: reqErr } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single()

  if (reqErr) throw reqErr
  if (!request) return request

  const { data: addressData, error: addrErr } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', request.requester_id)
    .limit(1)
    .maybeSingle()

  if (addrErr) throw addrErr

  return { ...(request as RequestRow), address: addressData ?? null }
}

export async function updateRequest(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: RequestUpdate
): Promise<RequestRow> {
  const { data, error } = await supabase.from('requests').update(changes).eq('id', id).select().single()
  if (error) throw error
  return data as RequestRow
}

export async function createRequest(supabase : SupabaseClient<Database>, newRequest : RequestCreate){
  const { error } = await supabase.from('requests').insert(newRequest);
  if(error) throw error;
}