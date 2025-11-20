import { Database } from '../types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'
import { getAddressesByProfileIds } from './addresses-service'

export type RequestCreate = Database['public']['Tables']['requests']['Insert']
export type RequestRow = Database['public']['Tables']['requests']['Row']
export type RequestPhotoCreate = Database['public']['Tables']['request_photos']['Insert']
export type RequestPhotoRow = Database['public']['Tables']['request_photos']['Row']
export type RequestWithAddress = Omit<RequestRow, 'photos'> & { 
  address?: Database['public']['Tables']['addresses']['Row'] | null
  photos?: RequestPhotoRow[]
}
export type RequestUpdate = Database['public']['Tables']['requests']['Update']

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
    .is('deleted_at', null)

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
  const addresses = await getAddressesByProfileIds(supabase, requesterIds)
  const primaryAddrByProfile = new Map(
    addresses.filter(a => a.is_primary).map(a => [a.profile_id, a])
  )

  const requestIds = rows.map(r => r.id)
  const photos = await getPhotosByRequestIds(supabase, requestIds)
  const photosByRequest = new Map<string, RequestPhotoRow[]>()
  photos.forEach(photo => {
    if (!photosByRequest.has(photo.request_id)) {
      photosByRequest.set(photo.request_id, [])
    }
    photosByRequest.get(photo.request_id)!.push(photo)
  })

  const dataWithAddress: RequestWithAddress[] = rows.map(r => ({
    ...r,
    address: primaryAddrByProfile.get(r.requester_id) ?? null,
    photos: photosByRequest.get(r.id) ?? []
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
    .is('deleted_at', null)
    .single()

  if (reqErr) throw reqErr
  if (!request) return request

  const { data: addressData, error: addrErr } = await supabase
    .from('profile_addresses')
    .select('addresses(*)')
    .eq('profile_id', request.requester_id)
    .eq('is_primary', true)
    .maybeSingle()

  if (addrErr) throw addrErr

  const photos = await getPhotosByRequestIds(supabase, [request.id])

  return { 
    ...(request as RequestRow), 
    address: addressData?.addresses as any ?? null,
    photos 
  }
}

export async function updateRequest(
  supabase: SupabaseClient<Database>,
  id: string,
  changes: RequestUpdate
): Promise<RequestRow> {
  const { data, error } = await supabase
    .from('requests')
    .update(changes)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) throw error
  return data as RequestRow
}

export async function createRequest(
  supabase: SupabaseClient<Database>,
  newRequest: RequestCreate
): Promise<RequestRow> {
  const { data, error } = await supabase
    .from('requests')
    .insert(newRequest)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRequest(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('requests')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function addRequestPhoto(
  supabase: SupabaseClient<Database>,
  photo: RequestPhotoCreate
): Promise<RequestPhotoRow> {
  const { data, error } = await supabase
    .from('request_photos')
    .insert(photo)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPhotosByRequestIds(
  supabase: SupabaseClient<Database>,
  requestIds: string[]
): Promise<RequestPhotoRow[]> {
  if (!requestIds?.length) return []

  const { data, error } = await supabase
    .from('request_photos')
    .select('*')
    .in('request_id', requestIds)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function deleteRequestPhoto(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('request_photos')
    .delete()
    .eq('id', id)

  if (error) throw error
}
