import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const adminSession = request.cookies.get('admin_session')?.value;
  const isAuthenticated = adminSession === 'authenticated_op_admin_2026';

  // If accessing the admin login page while already logged in
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      const from = request.nextUrl.searchParams.get('from');
      const target = from && from.startsWith('/admin') && from !== '/admin/login' ? from : '/admin';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Protect all other /admin routes from unauthenticated access
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
