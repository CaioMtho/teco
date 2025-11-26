import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { updateProposal, deleteProposal } from '@/../lib/services/chat-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ proposal: data })
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const body = await request.json()
    const proposal = await updateProposal(supabase, params.id, body)
    
    return NextResponse.json({ proposal })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    await deleteProposal(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}
