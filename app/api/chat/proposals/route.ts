import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { sendProposal } from '@/../lib/services/chat-service'
import { getProfileByAuthId } from '@/../lib/services/profiles-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const user = await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['request_id', 'amount', 'message', 'proposed_date'])
    
    const profile = await getProfileByAuthId(supabase, user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    if (profile.role !== 'provider') {
      return NextResponse.json({ error: 'Only providers can send proposals' }, { status: 403 })
    }
    
    const proposal = await sendProposal(supabase, {
      ...body,
      provider_id: profile.id
    })
    
    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}