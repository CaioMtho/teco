import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '../types/database.types'
import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const cookieStore = cookies()
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
      },
    } as any
  )
}

export type AppSupabaseClient = ReturnType<typeof createSupabaseClient>

export async function getAuthUser(supabase: ReturnType<typeof createSupabaseClient>) {
  const { data: { user }, error } = await supabase.auth.getUser()
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