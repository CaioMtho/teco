import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { updateProviderProfile, deleteProviderProfile } from '@/../lib/services/provider-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const { data, error } = await supabase
      .from('provider_profiles')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ provider_profile: data })
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
    const providerProfile = await updateProviderProfile(supabase, params.id, body)
    
    return NextResponse.json({ provider_profile: providerProfile })
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
    
    await deleteProviderProfile(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}
