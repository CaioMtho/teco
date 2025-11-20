import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getProfileByAuthId } from '@/../lib/services/profiles-service'

export async function GET(
  request: NextRequest,
  content: { params: Promise<{ authId: string }> }
) {
  const params = await content.params
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const profile = await getProfileByAuthId(supabase, params.authId)
    return NextResponse.json({ profile })
  } catch (error) {
    return handleError(error)
  }
}