import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { type, message } = await req.json();

    if (!type || !message?.trim()) {
      return NextResponse.json({ error: 'Type and message are required.' }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({ type, message: message.trim(), status: 'pending' })
      .select('id')
      .single();

    if (error) {
      console.error('Feedback insert error:', error.message);
      return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
