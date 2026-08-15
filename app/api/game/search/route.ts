import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    const supabase = createAdminClient();
    const lowerQ = q.toLowerCase();

    // 1. Fetch characters matching name, japanese name, or romanized name/alias
    const { data: chars } = await supabase
      .from('characters')
      .select('id, name, slug, japanese_name, romanized_name, image_url, verification_status')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,japanese_name.ilike.%${q}%,romanized_name.ilike.%${q}%`)
      .order('verification_status', { ascending: false })
      .limit(20);

    // 2. Fetch characters matching aliases table
    const { data: matchedAliases } = await supabase
      .from('character_aliases')
      .select('character_id, alias, characters(id, name, slug, japanese_name, romanized_name, image_url, verification_status)')
      .ilike('alias', `%${q}%`)
      .limit(20);

    // Combine all unique characters
    const characterMap = new Map<string, any>();

    if (chars) {
      for (const c of chars) {
        characterMap.set(c.id, c);
      }
    }

    if (matchedAliases) {
      for (const ma of matchedAliases) {
        if (ma.characters && !characterMap.has(ma.character_id)) {
          characterMap.set(ma.character_id, ma.characters);
        }
      }
    }

    const allCharIds = Array.from(characterMap.keys());
    if (allCharIds.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 3. Fetch ALL aliases for all matched characters to show complete alias list
    const { data: allAliasesData } = await supabase
      .from('character_aliases')
      .select('character_id, alias')
      .in('character_id', allCharIds);

    const aliasesByCharId = new Map<string, Set<string>>();

    if (allAliasesData) {
      for (const row of allAliasesData) {
        if (!row.alias) continue;
        if (!aliasesByCharId.has(row.character_id)) {
          aliasesByCharId.set(row.character_id, new Set());
        }
        aliasesByCharId.get(row.character_id)!.add(row.alias.trim());
      }
    }

    // 4. Assemble enriched results with smart scoring
    const resultsList = Array.from(characterMap.values()).map((char) => {
      const aliasSet = aliasesByCharId.get(char.id) || new Set<string>();

      // Also include any comma-separated aliases stored in romanized_name if present
      if (char.romanized_name) {
        const parts = char.romanized_name.split(',').map((s: string) => s.trim()).filter(Boolean);
        for (const part of parts) {
          if (part.toLowerCase() !== char.name.toLowerCase()) {
            aliasSet.add(part);
          }
        }
      }

      const aliasArray = Array.from(aliasSet);

      let score = 0;
      const charNameLower = char.name.toLowerCase();
      const nameWords = charNameLower.split(/[\s\-.]+/).filter(Boolean);

      if (charNameLower === lowerQ) {
        score = Math.max(score, 100);
      } else if (nameWords.some((w: string) => w === lowerQ)) {
        score = Math.max(score, 95);
      } else if (nameWords.some((w: string) => w.startsWith(lowerQ))) {
        score = Math.max(score, 85);
      } else if (charNameLower.startsWith(lowerQ)) {
        score = Math.max(score, 80);
      } else if (charNameLower.includes(lowerQ)) {
        score = Math.max(score, 60);
      }

      for (const al of aliasArray) {
        const alLower = al.toLowerCase();
        const alWords = alLower.split(/[\s\-.]+/).filter(Boolean);

        if (alLower === lowerQ) {
          score = Math.max(score, 95);
        } else if (alWords.some((w: string) => w === lowerQ)) {
          score = Math.max(score, 90);
        } else if (alWords.some((w: string) => w.startsWith(lowerQ))) {
          score = Math.max(score, 80);
        } else if (alLower.startsWith(lowerQ)) {
          score = Math.max(score, 75);
        } else if (alLower.includes(lowerQ)) {
          score = Math.max(score, 50);
        }
      }

      // Bonus for verified canonical characters
      if (char.verification_status === 'verified') {
        score += 15;
      }

      return {
        id: char.id,
        name: char.name,
        slug: char.slug,
        image_url: char.image_url,
        aliases: aliasArray,
        score,
      };
    });

    // Sort by score descending
    resultsList.sort((a, b) => b.score - a.score);

    const finalResults = resultsList.slice(0, 8).map(({ score, ...item }) => item);
    return NextResponse.json({ results: finalResults });
  } catch (err: any) {
    console.error('Search error:', err);
    return NextResponse.json({ results: [] });
  }
}
