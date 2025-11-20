import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser } from '@/../lib/api/utils'
import { getAddressesByProfileIds, getPrimaryAddressByProfileId } from '@/../lib/services/addresses-service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ profileId: string }> }
) {
  const params = await context.params
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const primaryOnly = searchParams.get('primary_only') === 'true'
    
    if (primaryOnly) {
      const address = await getPrimaryAddressByProfileId(supabase, params.profileId)
      return NextResponse.json({ address })
    }
    
    const addresses = await getAddressesByProfileIds(supabase, [params.profileId])
    return NextResponse.json({ addresses })
  } catch (error) {
    return handleError(error)
  }
}
