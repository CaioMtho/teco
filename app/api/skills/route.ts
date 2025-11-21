import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    let query = supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true })
      .limit(limit)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json({ skills: data })
  } catch (error) {
    return handleError(error)
  }
}
