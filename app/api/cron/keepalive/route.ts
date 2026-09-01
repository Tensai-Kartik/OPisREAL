import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Verify Vercel Cron secret to prevent unauthorized public hits
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Also reject if CRON_SECRET is not configured in production to avoid open public execution
  if (!cronSecret && process.env.NODE_ENV === 'production') {
    return new NextResponse('Unauthorized: CRON_SECRET is not configured', { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 2. Perform a lightweight ping query
    const { data, error } = await supabase
      .from('characters')
      .select('id')
      .limit(1);

    if (error) {
      console.error('[Cron Keepalive] Supabase query error:', error.message);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase keepalive ping successful',
      pingedAt: new Date().toISOString(),
      rowCount: data ? data.length : 0,
    });
  } catch (err: any) {
    console.error('[Cron Keepalive] Unexpected error:', err);
    return NextResponse.json(
      { status: 'error', message: err?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
