import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getProfileById, updateProfile, deleteProfile } from '@/../lib/services/profiles-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    const params = await context.params

    const profile = await getProfileById(supabase, params.id)
    return NextResponse.json({ profile })
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
    const profile = await updateProfile(supabase, params.id, body)
    
    return NextResponse.json({ profile })
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

    await deleteProfile(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}