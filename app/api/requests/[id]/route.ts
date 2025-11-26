import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getRequestById, updateRequest, deleteRequest } from '@/../lib/services/requests-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const data = await getRequestById(supabase, params.id)
    return NextResponse.json({ request: data })
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
    const updated = await updateRequest(supabase, params.id, body)
    
    return NextResponse.json({ request: updated })
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

    await deleteRequest(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}