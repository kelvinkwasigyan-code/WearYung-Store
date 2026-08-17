import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next');

  // Default to /account (or sanitize relative path)
  let next = '/account';
  if (nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')) {
    next = nextParam;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check user role: if user is admin and was heading to /admin, send them to /admin, otherwise /account
      const { data: { user } } = await supabase.auth.getUser();
      if (user && next === '/account') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          return NextResponse.redirect(`${origin}/account`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
