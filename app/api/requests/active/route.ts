import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const { data, error } = await supabase
      .from('active_requests')
      .select('*')
    
    if (error) throw error
    
    return NextResponse.json({ requests: data })
  } catch (error) {
    return handleError(error)
  }
}