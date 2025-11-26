import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '../types/database.types'
import { createServerSupabaseClient } from '../supabase/server'

export async function createSupabaseClient() {
  // Use the server helper so API routes use the server-side auth context
  return await createServerSupabaseClient()
}

export type AppSupabaseClient = Awaited<ReturnType<typeof createSupabaseClient>>

export async function getAuthUser(supabase: AppSupabaseClient) {
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