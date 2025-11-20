import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getOrderByProposalId } from '@/../lib/services/orders-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ proposalId: string }> }
) {
  const params = await context.params
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const order = await getOrderByProposalId(supabase, params.proposalId)
    return NextResponse.json({ order })
  } catch (error) {
    return handleError(error)
  }
}