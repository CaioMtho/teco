import { createServerSupabaseClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/reset-password';

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=reset-failed`);
}