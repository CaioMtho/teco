import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '../types/database.types'
import { createClient } from '@supabase/supabase-js'

export async function createSupabaseClient(request?: NextRequest) {
  const cookieStore = request
    ? await request.cookies    
    : await cookies()           

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    } as any
  )
}

export type AppSupabaseClient = ReturnType<typeof createSupabaseClient>

export async function getAuthUser(supabase: AppSupabaseClient) {
  const { data: { user }, error } = await (await supabase).auth.getUser()
  if (error || !user) {
    throw new Error('Unauthorized')
  }
  return user
}

export function handleError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

export function validateRequired(data: Record<string, any>, required: string[]) {
  const missing = required.filter(field => !data[field])
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }
}
