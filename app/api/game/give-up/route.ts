import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Character } from '@/types/character';

export const dynamic = 'force-dynamic';

async function fetchFullCharacter(id: string): Promise<Character | null> {
  const supabase = createAdminClient();
  const { data: char, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !char) return null;

  const [{ data: affs }, { data: occs }, { data: haki }, { data: aliases }] = await Promise.all([
    supabase.from('character_affiliations').select('affiliation').eq('character_id', id),
    supabase.from('character_occupations').select('occupation').eq('character_id', id),
    supabase.from('character_haki').select('haki_type, custom_haki').eq('character_id', id),
    supabase.from('character_aliases').select('alias, alias_type').eq('character_id', id),
  ]);

  return {
    ...char,
    affiliations: (affs || []).map((a) => a.affiliation),
    occupations: (occs || []).map((o) => o.occupation),
    haki: (haki || []).map((h) => ({ haki_type: h.haki_type as any, custom_haki: h.custom_haki })),
    aliases: aliases || [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Missing session token' }, { status: 400 });
    }

    // Decode session
    const jsonStr = Buffer.from(sessionToken, 'base64').toString('utf8');
    const session = JSON.parse(jsonStr);
    const targetId = session.t;

    if (!targetId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    const targetChar = await fetchFullCharacter(targetId);

    if (!targetChar) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      targetCharacter: targetChar,
    });
  } catch (err: any) {
    console.error('Give up error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
