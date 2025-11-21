import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient, handleError, getAuthUser, validateRequired } from '@/../lib/api/utils'
import { createReview } from '@/../lib/services/reviews-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    await getAuthUser(supabase)
    
    const body = await request.json()
    validateRequired(body, ['order_id', 'rating'])
    
    if (body.rating < 0 || body.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 0 and 5' }, { status: 400 })
    }
    
    const review = await createReview(supabase, body)
    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}