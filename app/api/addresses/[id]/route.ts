import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { updateAddress } from '@/../lib/services/addresses-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ address: data })
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
    const address = await updateAddress(supabase, params.id, body)
    
    return NextResponse.json({ address })
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
    
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}
