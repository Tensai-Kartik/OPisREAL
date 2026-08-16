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
  description?: string | null;
  bounty?: number | null;
  origin?: string | null;
  first_arc?: string | null;
  first_appearance?: string | null;
  devil_fruit_name?: string | null;
  devil_fruit_type?: string | null;
  race?: string | null;
  status?: string | null;
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
      .select('id, name, slug, japanese_name, alias, romanized_name, image_url, verification_status, bounty, description, origin, first_arc, first_appearance, devil_fruit_name, devil_fruit_type, race, status')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,alias.ilike.%${q}%,romanized_name.ilike.%${q}%,japanese_name.ilike.%${q}%`)
      .order('verification_status', { ascending: false })
      .limit(15);

    // 2. Fetch matching aliases from character_aliases table
    const { data: aliases } = await supabase
      .from('character_aliases')
      .select('character_id, alias, characters!inner(id, name, slug, alias, romanized_name, japanese_name, image_url, is_active, verification_status, bounty, description, origin, first_arc, first_appearance, devil_fruit_name, devil_fruit_type, race, status)')
      .ilike('alias', `%${q}%`)
      .eq('characters.is_active', true)
      .limit(15);

    const map = new Map<string, SearchResultItem>();

    // Helper to calculate relevance score
    const calculateScore = (name: string, aliasStr: string | null, matchedAliasStr: string | null, isVerified: boolean, bounty?: number | null) => {
      let score = 0;
      const n = name.toLowerCase();
      const nameWords = n.split(/[\s,.-]+/);

      // 1. Exact full match on name
      if (n === qLower) {
        score += 1000;
      }
      // 2. Name starts with query
      else if (n.startsWith(qLower)) {
        score += 600;
      }
      // 3. Any individual word in name equals query (e.g. "Bege" in "Capone Bege")
      else if (nameWords.some(w => w === qLower)) {
        score += 550;
      }
      // 4. Any individual word in name starts with query (e.g. "Be..." in "Capone Bege")
      else if (nameWords.some(w => w.startsWith(qLower))) {
        score += 450;
      }
      // 5. Substring match in name
      else if (n.includes(qLower)) {
        score += 100;
      }

      // Check matched specific alias
      if (matchedAliasStr) {
        const ma = matchedAliasStr.toLowerCase();
        const aliasWords = ma.split(/[\s,.-]+/);
        if (ma === qLower) {
          score += 500;
        } else if (ma.startsWith(qLower)) {
          score += 350;
        } else if (aliasWords.some(w => w === qLower)) {
          score += 320;
        } else if (aliasWords.some(w => w.startsWith(qLower))) {
          score += 260;
        } else if (ma.includes(qLower)) {
          score += 80;
        }
      }

      // Check full alias list
      if (aliasStr) {
        const a = aliasStr.toLowerCase();
        const parts = a.split(/,\s*/);
        for (const p of parts) {
          const words = p.split(/[\s,.-]+/);
          if (p === qLower) {
            score += 400;
          } else if (p.startsWith(qLower)) {
            score += 300;
          } else if (words.some(w => w === qLower)) {
            score += 280;
          } else if (words.some(w => w.startsWith(qLower))) {
            score += 240;
          }
        }
      }

      if (isVerified) score += 15;
      if (bounty && bounty > 1000000000) score += 5;
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
          description: c.description,
          bounty: c.bounty,
          origin: c.origin,
          first_arc: c.first_arc,
          first_appearance: c.first_appearance,
          devil_fruit_name: c.devil_fruit_name,
          devil_fruit_type: c.devil_fruit_type,
          race: c.race,
          status: c.status,
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
            japanese_name: char.japanese_name,
            description: char.description,
            bounty: char.bounty,
            origin: char.origin,
            first_arc: char.first_arc,
            first_appearance: char.first_appearance,
            devil_fruit_name: char.devil_fruit_name,
            devil_fruit_type: char.devil_fruit_type,
            race: char.race,
            status: char.status,
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
