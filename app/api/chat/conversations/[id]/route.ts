import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getConversationById } from '@/../lib/services/chat-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const conversation = await getConversationById(supabase, params.id)
    return NextResponse.json({ conversation })
  } catch (error) {
    return handleError(error)
  }
}