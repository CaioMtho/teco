import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { insertAddress, linkAddressToProfile } from '@/../lib/services/addresses-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const profileId = searchParams.get('profile_id')
    
    if (!profileId) {
      return NextResponse.json({ error: 'profile_id is required' }, { status: 400 })
    }
    
    const { getAddressesByProfileIds } = await import('@/../lib/services/addresses-service')
    const addresses = await getAddressesByProfileIds(supabase, [profileId])
    
    return NextResponse.json({ addresses })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['street', 'number', 'neighborhood', 'city', 'state', 'country', 'zip_code'])
    
    const { profile_id, is_primary, address_type, ...addressData } = body
    
    const address = await insertAddress(supabase, addressData)
    
    if (profile_id) {
      await linkAddressToProfile(supabase, {
        profile_id,
        address_id: address.id,
        is_primary: is_primary ?? false,
        address_type: address_type ?? 'home'
      })
    }
    
    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
