import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { sendMessage, getMessagesByConversationId } from '@/../lib/services/chat-service'
import { getProfileByAuthId } from '@/../lib/services/profiles-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') || undefined
    
    const messages = await getMessagesByConversationId(supabase, params.id, { limit, before })
    return NextResponse.json({ messages })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const supabase = createSupabaseClient()
    const user = await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['content'])
    
    const profile = await getProfileByAuthId(supabase, user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    const message = await sendMessage(supabase, {
      conversation_id: params.id,
      sender_id: profile.id,
      content: body.content
    })
    
    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}