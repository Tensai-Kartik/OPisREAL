import { NextRequest, NextResponse } from 'next/server';
import { getEnvVar } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = body.password?.trim();

    const expectedPassword = (getEnvVar('ADMIN_PASSWORD') || process.env.ADMIN_PASSWORD || '').trim();

    if (!expectedPassword) {
      console.error('ADMIN_PASSWORD is not configured in environment variables.');
      return NextResponse.json({ error: 'Server authentication configuration error' }, { status: 500 });
    }

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

