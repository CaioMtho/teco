import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from './shared'
import type { Database } from '../types/database.types'

const { url, key } = getSupabaseEnv()
export const supabase = createBrowserClient<Database>(url, key)