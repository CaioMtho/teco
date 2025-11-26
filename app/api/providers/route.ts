import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { createProviderProfile } from '@/../lib/services/provider-service'
import { getProfileByAuthId } from '@/../lib/services/profiles-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const user = await getAuthUser(supabase)
    
    const profile = await getProfileByAuthId(supabase, user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    if (profile.role !== 'provider') {
      return NextResponse.json({ error: 'User is not a provider' }, { status: 403 })
    }
    
    const body = await request.json()
    
    const providerProfile = await createProviderProfile(supabase, {
      ...body,
      user_id: profile.id
    })
    
    return NextResponse.json({ provider_profile: providerProfile }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}