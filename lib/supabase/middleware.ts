import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do not add logic between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Strict /admin Route Guard
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    const userEmail = (user.email || '').toLowerCase();
    const isAdminByEmail = userEmail === 'admin@wearyung.com' ||
      (!!process.env.ADMIN_EMAIL && userEmail === process.env.ADMIN_EMAIL.toLowerCase());

    if (!isAdminByEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }
  }

  // 2. Protect /account customer routes
  if (!user && request.nextUrl.pathname.startsWith('/account')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 3. If authenticated admin visits customer /account, redirect to /admin
  if (user && request.nextUrl.pathname.startsWith('/account')) {
    const userEmail = (user.email || '').toLowerCase();
    const isAdminByEmail = userEmail === 'admin@wearyung.com' ||
      (!!process.env.ADMIN_EMAIL && userEmail === process.env.ADMIN_EMAIL.toLowerCase());

    let isAdminByRole = false;
    if (!isAdminByEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      isAdminByRole = profile?.role === 'admin';
    }

    if (isAdminByEmail || isAdminByRole) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
