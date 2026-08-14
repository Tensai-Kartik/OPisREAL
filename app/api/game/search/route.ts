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

    // Fetch characters matching name, japanese name, or romanized name (prioritizing verified characters)
    const { data: chars } = await supabase
      .from('characters')
      .select('id, name, slug, japanese_name, romanized_name, image_url, verification_status')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,japanese_name.ilike.%${q}%,romanized_name.ilike.%${q}%`)
      .order('verification_status', { ascending: false })
      .limit(12);

    // Fetch matching aliases
    const { data: aliases } = await supabase
      .from('character_aliases')
      .select('character_id, alias, characters(id, name, slug, image_url)')
      .ilike('alias', `%${q}%`)
      .limit(10);

    const map = new Map<string, { id: string; name: string; slug: string; image_url?: string | null; matchedAlias?: string }>();

    if (chars) {
      for (const c of chars) {
        map.set(c.id, { id: c.id, name: c.name, slug: c.slug, image_url: c.image_url });
      }
    }

    if (aliases) {
      for (const a of aliases) {
        if (a.characters && !map.has(a.character_id)) {
          const char = a.characters as any;
          map.set(char.id, {
            id: char.id,
            name: char.name,
            slug: char.slug,
            image_url: char.image_url,
            matchedAlias: a.alias,
          });
        }
      }
    }

    const results = Array.from(map.values()).slice(0, 8);
    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('Search error:', err);
    return NextResponse.json({ results: [] });
  }
}
