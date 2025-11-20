import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { cancelOrder } from '@/../lib/services/orders-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const order = await cancelOrder(supabase, params.id)
    return NextResponse.json({ order })
  } catch (error) {
    return handleError(error)
  }
}