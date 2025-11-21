import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { createOrder } from '@/../lib/services/orders-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['proposal_id'])
    
    const order = await createOrder(supabase, body)
    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}