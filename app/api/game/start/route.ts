import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = createAdminClient();

    // Fetch active verified canon characters
    const { data: verifiedChars } = await supabase
      .from('characters')
      .select('id')
      .eq('is_active', true)
      .eq('is_canon', true)
      .eq('verification_status', 'verified');

    let chars = verifiedChars;

    // Fallback if verified pool is small
    if (!chars || chars.length === 0) {
      const { data: fallbackChars } = await supabase
        .from('characters')
        .select('id')
        .eq('is_active', true)
        .eq('is_canon', true);
      chars = fallbackChars;
    }

    if (!chars || chars.length === 0) {
      return NextResponse.json({ error: 'No active characters found' }, { status: 500 });
    }

    // Pick random target
    const randomIndex = Math.floor(Math.random() * chars.length);
    const targetId = chars[randomIndex].id;

    // Create session token with target encoded
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const sessionPayload = {
      gameId,
      t: targetId,
      created: Date.now(),
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    return NextResponse.json({
      gameId,
      sessionToken,
      totalActiveCharacters: chars.length,
    });
  } catch (err: any) {
    console.error('Error starting game:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
