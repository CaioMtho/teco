import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { insertProfile } from '@/../lib/services/profiles-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const user = await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['name'])
    
    const profile = await insertProfile(supabase, {
      ...body,
      auth_id: user.id
    })
    
    return NextResponse.json({ profile }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}