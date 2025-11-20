import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { releasePayment } from '@/../lib/services/orders-service'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const order = await releasePayment(supabase, params.id)
    return NextResponse.json({ order })
  } catch (error) {
    return handleError(error)
  }
}
