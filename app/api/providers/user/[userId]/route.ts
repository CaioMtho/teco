import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getProviderProfileByUserId } from '@/../lib/services/provider-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const providerProfile = await getProviderProfileByUserId(supabase, params.userId)
    return NextResponse.json({ provider_profile: providerProfile })
  } catch (error) {
    return handleError(error)
  }
}