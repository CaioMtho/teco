import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { createChat } from '@/../lib/services/chat-service'
import { getRequestById } from '@/../lib/services/requests-service'
import { getProfileByAuthId } from '@/../lib/services/profiles-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const user = await getAuthUser(supabase)

    const body = await request.json()
    validateRequired(body, ['request_id'])

    const profile = await getProfileByAuthId(supabase, user.id)
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const requestData = await getRequestById(supabase, body.request_id)
    if (!requestData) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    const conversation = await createChat(supabase, {
      request_id: body.request_id,
      provider_id: profile.role === 'provider' ? profile.id : null,
      requester_id: profile.role === 'requester' ? profile.id : requestData.requester_id
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
