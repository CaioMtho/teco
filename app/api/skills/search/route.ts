import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { searchSkills } from '@/../lib/services/provider-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }
    
    const skills = await searchSkills(supabase, query)
    return NextResponse.json({ skills })
  } catch (error) {
    return handleError(error)
  }
}