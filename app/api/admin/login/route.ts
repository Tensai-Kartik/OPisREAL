import { NextRequest, NextResponse } from 'next/server';
import { getEnvVar } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = body.password?.trim();

    const expectedPassword = (
      process.env.ADMIN_PASSWORD ||
      getEnvVar('ADMIN_PASSWORD') ||
      'opisreal2026'
    ).trim();

    if (password === expectedPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', 'authenticated_op_admin_2026', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });
      return response;
    }

    return NextResponse.json({ error: 'Incorrect admin password' }, { status: 401 });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}

