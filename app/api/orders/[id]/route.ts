import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getOrderById, updateOrder, deleteOrder } from '@/../lib/services/orders-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const order = await getOrderById(supabase, params.id)
    return NextResponse.json({ order })
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const body = await request.json()
    const order = await updateOrder(supabase, params.id, body)
    
    return NextResponse.json({ order })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    await deleteOrder(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}
