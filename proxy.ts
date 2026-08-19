import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidAdminSession } from '@/lib/auth/admin';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const adminSession = request.cookies.get('admin_session')?.value;
  const isAuthenticated = isValidAdminSession(adminSession);

  // If accessing the admin login page while already logged in
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      const from = request.nextUrl.searchParams.get('from');
      const target = from && from.startsWith('/admin') && from !== '/admin/login' ? from : '/admin';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Protect all other /admin web pages
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin/* API endpoints (except public auth endpoints)
  if (pathname.startsWith('/api/admin')) {
    const publicAdminApis = ['/api/admin/login', '/api/admin/check-auth', '/api/admin/logout'];
    if (!publicAdminApis.includes(pathname) && !isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
