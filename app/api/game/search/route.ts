import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  alias?: string | null;
  matchedAlias?: string | null;
  japanese_name?: string | null;
  score?: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    const supabase = createAdminClient();
    const qLower = q.toLowerCase();

    // 1. Fetch characters matching name, alias, japanese name, or romanized name
    const { data: chars } = await supabase
      .from('characters')
      .select('id, name, slug, japanese_name, alias, romanized_name, image_url, verification_status, bounty')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,alias.ilike.%${q}%,romanized_name.ilike.%${q}%,japanese_name.ilike.%${q}%`)
      .order('verification_status', { ascending: false })
      .limit(15);

    // 2. Fetch matching aliases from character_aliases table
    const { data: aliases } = await supabase
      .from('character_aliases')
      .select('character_id, alias, characters!inner(id, name, slug, alias, romanized_name, image_url, is_active, verification_status, bounty)')
      .ilike('alias', `%${q}%`)
      .eq('characters.is_active', true)
      .limit(15);

    const map = new Map<string, SearchResultItem>();

    // Helper to calculate relevance score
    const calculateScore = (name: string, aliasStr: string | null, matchedAliasStr: string | null, isVerified: boolean, bounty?: number | null) => {
      let score = 0;
      const n = name.toLowerCase();
      if (n === qLower) score += 120;
      else if (n.startsWith(qLower)) score += 80;
      else if (n.includes(qLower)) score += 50;

      if (matchedAliasStr) {
        const ma = matchedAliasStr.toLowerCase();
        if (ma === qLower) score += 100;
        else if (ma.startsWith(qLower)) score += 75;
        else if (ma.includes(qLower)) score += 40;
      }

      if (aliasStr) {
        const a = aliasStr.toLowerCase();
        if (a.includes(qLower)) score += 30;
      }

      if (isVerified) score += 30;
      if (bounty && bounty > 500000000) score += 15;
      return score;
    };

    if (chars) {
      for (const c of chars) {
        const aliasVal = c.alias || c.romanized_name || null;
        let matchedAlias: string | null = null;

        // If the query matched inside the comma-separated alias string, extract the specific alias
        if (aliasVal && aliasVal.toLowerCase().includes(qLower)) {
          const parts = aliasVal.split(/,\s*/);
          const found = parts.find((p: string) => p.toLowerCase().includes(qLower));
          if (found) matchedAlias = found;
        }

        const score = calculateScore(c.name, aliasVal, matchedAlias, c.verification_status === 'verified', c.bounty);
        map.set(c.id, {
          id: c.id,
          name: c.name,
          slug: c.slug,
          image_url: c.image_url,
          alias: aliasVal,
          matchedAlias,
          japanese_name: c.japanese_name,
          score,
        });
      }
    }

    if (aliases) {
      for (const a of aliases) {
        const char = a.characters as any;
        if (!char) continue;

        const aliasVal = char.alias || char.romanized_name || a.alias || null;
        const score = calculateScore(char.name, aliasVal, a.alias, char.verification_status === 'verified', char.bounty);

        if (!map.has(char.id)) {
          map.set(char.id, {
            id: char.id,
            name: char.name,
            slug: char.slug,
            image_url: char.image_url,
            alias: aliasVal,
            matchedAlias: a.alias,
            score,
          });
        } else {
          // If already present, ensure matchedAlias is set if query matched this alias
          const existing = map.get(char.id)!;
          if (!existing.matchedAlias) {
            existing.matchedAlias = a.alias;
            existing.score = Math.max(existing.score || 0, score);
          }
        }
      }
    }

    // Sort by relevance score descending
    const results = Array.from(map.values())
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 8);

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('Search error:', err);
    return NextResponse.json({ results: [] });
  }
}

