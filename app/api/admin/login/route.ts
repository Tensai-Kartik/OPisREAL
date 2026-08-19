import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, generateAdminSessionToken, getAdminPassword } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = body.password?.trim();

    const configuredPassword = getAdminPassword();
    if (!configuredPassword) {
      return NextResponse.json(
        { error: 'Admin access is not configured. Please set the ADMIN_PASSWORD environment variable.' },
        { status: 503 }
      );
    }

    if (verifyAdminPassword(password)) {
      const sessionToken = generateAdminSessionToken(configuredPassword);
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', sessionToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }

    return NextResponse.json({ error: 'Incorrect admin password' }, { status: 401 });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}
