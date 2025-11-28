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
  const publicApiPaths = [
    '/api/health', 
    '/api/login', 
    '/api/signup', 
    '/api/auth/confirm',
    '/api/auth/forgot-password',
    '/api/auth/reset-password'
  ];

  if (publicApiPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return supabaseResponse;
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // attempt to fetch profile role for authenticated user
  let profileRole: string | null = null
  if (!authError && user) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('auth_id', user.id)
        .maybeSingle()

      if (!profileError && profileData) {
        profileRole = (profileData as any).role ?? null
      }
    } catch (e) {
      // ignore profile lookup errors here; default behavior will apply
      console.warn('Middleware: profile lookup failed', e)
    }
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return supabaseResponse;
  }

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
    // If user is authenticated and visits a public page (login/signup), redirect them
    // to the appropriate dashboard based on their profile role
    if (profileRole === 'provider') {
      return NextResponse.redirect(new URL('/dashboard-provider', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Enforce role-specific access to dashboard routes
  const path = request.nextUrl.pathname
  if (path.startsWith('/dashboard-provider') && profileRole !== 'provider') {
    // non-providers should not access provider dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (path.startsWith('/dashboard') && !path.startsWith('/dashboard-provider') && profileRole === 'provider') {
    // if a provider opens the generic dashboard, redirect to provider dashboard
    return NextResponse.redirect(new URL('/dashboard-provider', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};