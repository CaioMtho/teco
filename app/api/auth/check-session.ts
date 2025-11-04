import { createServerSupabaseClient } from '../../../lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return NextResponse.json({ hasSession: false }, { status: 401 });
    }
    
    return NextResponse.json({ hasSession: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ hasSession: false }, { status: 500 });
  }
}