import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { compareCharacters } from '@/lib/game/comparisonEngine';
import { getUnlockedClues } from '@/lib/game/clueEngine';
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
    const { sessionToken, guessCharacterId, guessCount = 1 } = body;

    if (!sessionToken || !guessCharacterId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Decode session
    const jsonStr = Buffer.from(sessionToken, 'base64').toString('utf8');
    const session = JSON.parse(jsonStr);
    const targetId = session.t;

    if (!targetId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    const [guessChar, targetChar] = await Promise.all([
      fetchFullCharacter(guessCharacterId),
      fetchFullCharacter(targetId),
    ]);

    if (!guessChar || !targetChar) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    const comparison = compareCharacters(guessChar, targetChar);
    const unlockedClues = getUnlockedClues(targetChar, guessCount);

    return NextResponse.json({
      gameId: session.gameId,
      guessCount,
      comparison,
      isCorrect: comparison.isCorrect,
      targetCharacterCard: comparison.isCorrect ? targetChar : null,
      unlockedClues,
    });
  } catch (err: any) {
    console.error('Guess submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
