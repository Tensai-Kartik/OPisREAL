import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session')?.value;
  const isAuthenticated = session === 'authenticated_op_admin_2026';
  return NextResponse.json({ authenticated: isAuthenticated });
}
