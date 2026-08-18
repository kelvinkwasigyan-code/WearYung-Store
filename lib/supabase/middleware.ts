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
    const isAdminByEmail = userEmail === 'wearyungworldwide@gmail.com' ||
      (!!process.env.ADMIN_EMAIL && userEmail === process.env.ADMIN_EMAIL.toLowerCase()) ||
      (!!process.env.ADMIN_NOTIFICATION_EMAIL && userEmail === process.env.ADMIN_NOTIFICATION_EMAIL.toLowerCase());

    if (!isAdminByEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const userMetaRole = user.user_metadata?.role;
      const isManager = profile?.role === 'manager' || userMetaRole === 'manager';
      const isAdmin = profile?.role === 'admin' || userMetaRole === 'admin';

      if (!isManager && !isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }

      // Restrict Manager from sensitive admin-only pages (Customers, Reviews, Settings)
      const pathname = request.nextUrl.pathname;
      if (isManager && (pathname.startsWith('/admin/customers') || pathname.startsWith('/admin/reviews') || pathname.startsWith('/admin/settings'))) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/products';
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

  return supabaseResponse;
}
