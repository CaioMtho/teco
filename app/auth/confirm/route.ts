import { createServerSupabaseClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
  const next = requestUrl.searchParams.get('next') || '/reset-password';

  if (token_hash && type) {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
    
    console.error('Erro ao verificar OTP:', error);
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=reset-failed`);
}