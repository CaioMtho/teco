import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getProfileByAuthId } from '@/../lib/services/profiles-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const user = await getAuthUser(supabase)
    
    const profile = await getProfileByAuthId(supabase, user.id)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    return handleError(error)
  }
}