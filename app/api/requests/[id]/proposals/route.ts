import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getProposalsByRequestId } from '@/../lib/services/chat-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const proposals = await getProposalsByRequestId(supabase, params.id)
    return NextResponse.json({ proposals })
  } catch (error) {
    return handleError(error)
  }
}