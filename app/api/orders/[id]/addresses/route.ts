import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { getAddressesByOrderId, linkAddressToOrder } from '@/../lib/services/addresses-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const addresses = await getAddressesByOrderId(supabase, params.id)
    return NextResponse.json({ addresses })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const body = await request.json()
    validateRequired(body, ['address_id', 'address_type'])
    
    const orderAddress = await linkAddressToOrder(supabase, {
      order_id: params.id,
      address_id: body.address_id,
      address_type: body.address_type
    })
    
    return NextResponse.json({ order_address: orderAddress }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}