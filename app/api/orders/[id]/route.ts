import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getOrderById, updateOrder, deleteOrder } from '@/../lib/services/orders-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const order = await getOrderById(supabase, params.id)
    return NextResponse.json({ order })
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const body = await request.json()
    const order = await updateOrder(supabase, params.id, body)
    
    return NextResponse.json({ order })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    await deleteOrder(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}
