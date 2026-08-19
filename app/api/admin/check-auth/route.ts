import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminSession } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('admin_session')?.value;
  const isAuthenticated = isValidAdminSession(sessionToken);
  return NextResponse.json({ authenticated: isAuthenticated });
}
