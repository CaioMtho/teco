import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { getRequests, createRequest } from '@/../lib/services/requests-service'
import { getProfileByAuthId } from '@/../lib/services/profiles-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const opts = {
      requester_id: searchParams.get('requester_id') || undefined,
      status: searchParams.get('status') || undefined,
      title: searchParams.get('title') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      perPage: parseInt(searchParams.get('per_page') || '20'),
      orderBy: (searchParams.get('order_by') as any) || 'created_at',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    }
    
    const result = await getRequests(supabase, opts)
    return NextResponse.json(result)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const user = await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['title', 'description'])
    
    const profile = await getProfileByAuthId(supabase, user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    const requestData = {
      ...body,
      requester_id: profile.id
    }
    
    const newRequest = await createRequest(supabase, requestData)
    
    return NextResponse.json({ request: newRequest }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}