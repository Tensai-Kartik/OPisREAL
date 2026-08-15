import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();
    let query = supabase.from('characters').select('*', { count: 'exact' });

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }
    if (status !== 'all') {
      query = query.eq('verification_status', status);
    }

    const { data: characters, count, error } = await query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      characters: characters || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { character, affiliations, occupations, haki, aliases } = body;
    if (!character || !character.name) {
      return NextResponse.json({ error: 'Character name is required' }, { status: 400 });
    }

    const slug = character.slug || character.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let finalAlias = character.alias;
    if (Array.isArray(aliases) && aliases.length > 0) {
      finalAlias = aliases.map((a: any) => (typeof a === 'string' ? a : a.alias)).filter(Boolean).join(', ');
    }

    const { data: newChar, error: insertErr } = await supabase
      .from('characters')
      .insert({
        name: character.name.trim(),
        slug,
        japanese_name: character.japanese_name || null,
        alias: finalAlias || null,
        romanized_name: finalAlias || character.romanized_name || null,
        gender: character.gender || 'Unknown',
        race: character.race || 'Human',
        status: character.status || 'Alive',
        age: character.age !== null && character.age !== undefined && character.age !== '' ? Number(character.age) : null,
        height: character.height !== null && character.height !== undefined && character.height !== '' ? Number(character.height) : null,
        bounty: character.bounty !== null && character.bounty !== undefined && character.bounty !== '' ? Number(character.bounty) : null,
        origin: character.origin || 'Grand Line',
        first_appearance: character.first_appearance || null,
        first_arc: character.first_arc || null,
        birthday: character.birthday || null,
        blood_type: character.blood_type || null,
        description: character.description || null,
        devil_fruit_name: character.devil_fruit_name || null,
        devil_fruit_type: character.devil_fruit_type || 'None',
        devil_fruit_model: character.devil_fruit_model || null,
        image_url: character.image_url || null,
        verification_status: character.verification_status || 'verified',
        is_canon: true,
        is_active: true,
      })
      .select()
      .single();

    if (insertErr || !newChar) {
      return NextResponse.json({ error: insertErr?.message || 'Failed to create character' }, { status: 500 });
    }

    const id = newChar.id;

    // Affiliations
    if (Array.isArray(affiliations) && affiliations.length > 0) {
      const validAffs = affiliations.map((a: string) => (typeof a === 'string' ? a.trim() : '')).filter(Boolean);
      if (validAffs.length > 0) {
        await supabase
          .from('character_affiliations')
          .insert(validAffs.map((a: string) => ({ character_id: id, affiliation: a })));
      }
    }

    // Occupations
    if (Array.isArray(occupations) && occupations.length > 0) {
      const validOccs = occupations.map((o: string) => (typeof o === 'string' ? o.trim() : '')).filter(Boolean);
      if (validOccs.length > 0) {
        await supabase
          .from('character_occupations')
          .insert(validOccs.map((o: string) => ({ character_id: id, occupation: o })));
      }
    }

    // Haki
    if (Array.isArray(haki) && haki.length > 0) {
      await supabase.from('character_haki').insert(
        haki.map((h: any) => ({
          character_id: id,
          haki_type: typeof h === 'string' ? h : h.haki_type,
          custom_haki: typeof h === 'object' ? h.custom_haki : null,
        }))
      );
    }

    // Aliases
    if (Array.isArray(aliases) && aliases.length > 0) {
      const validAliases = aliases
        .map((a: any) => ({
          character_id: id,
          alias: (typeof a === 'string' ? a : a.alias || '').trim(),
          alias_type: typeof a === 'object' ? a.alias_type || 'alias' : 'alias',
        }))
        .filter((a) => Boolean(a.alias));

      if (validAliases.length > 0) {
        await supabase.from('character_aliases').insert(validAliases);
      }
    }

    return NextResponse.json({ success: true, character: newChar, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Create failed' }, { status: 500 });
  }
}
