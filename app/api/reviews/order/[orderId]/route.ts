import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getReviewByOrderId } from '@/../lib/services/reviews-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const review = await getReviewByOrderId(supabase, params.orderId)
    return NextResponse.json({ review })
  } catch (error) {
    return handleError(error)
  }
}