import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { addRequestPhoto, deleteRequestPhoto } from '@/../lib/services/requests-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['url'])
    
    const photo = await addRequestPhoto(supabase, {
      request_id: params.id,
      url: body.url,
      display_order: body.display_order ?? 0
    })
    
    return NextResponse.json({ photo }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const searchParams = request.nextUrl.searchParams
    const photoId = searchParams.get('photo_id')
    
    if (!photoId) {
      return NextResponse.json({ error: 'photo_id is required' }, { status: 400 })
    }
    
    await deleteRequestPhoto(supabase, photoId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error)
  }
}
