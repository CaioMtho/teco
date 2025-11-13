import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const apiPaths = ['/api/'];

  if (apiPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return supabaseResponse;
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    if (publicPaths.some(path => request.nextUrl.pathname === path)) {
      return supabaseResponse;
    }

    if (request.nextUrl.pathname.startsWith('/dashboard') || 
        request.nextUrl.pathname.startsWith('/requests') ||
        request.nextUrl.pathname.startsWith('/proposals') ||
        request.nextUrl.pathname.startsWith('/orders') ||
        request.nextUrl.pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return supabaseResponse;
  }

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};