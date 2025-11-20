import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getProfileById, updateProfile, deleteProfile } from '@/../lib/services/profiles-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const profile = await getProfileById(supabase, params.id)
    return NextResponse.json({ profile })
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
    const profile = await updateProfile(supabase, params.id, body)
    
    return NextResponse.json({ profile })
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
    
    await deleteProfile(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}