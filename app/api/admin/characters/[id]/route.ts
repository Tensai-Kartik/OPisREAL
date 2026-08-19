import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: char, error } = await supabase.from('characters').select('*').eq('id', id).single();
    if (error || !char) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    const [{ data: evidence }, { data: haki }, { data: affs }, { data: occs }, { data: aliases }] =
      await Promise.all([
        supabase.from('character_field_evidence').select('*').eq('character_id', id),
        supabase.from('character_haki').select('*').eq('character_id', id),
        supabase.from('character_affiliations').select('*').eq('character_id', id),
        supabase.from('character_occupations').select('*').eq('character_id', id),
        supabase.from('character_aliases').select('*').eq('character_id', id),
      ]);

    return NextResponse.json({
      character: char,
      evidence: evidence || [],
      haki: haki || [],
      affiliations: (affs || []).map((a) => a.affiliation),
      occupations: (occs || []).map((o) => o.occupation),
      aliases: aliases || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const { character, affiliations, occupations, haki, aliases } = body;

    // Sync alias string from aliases array if provided, or from character.alias
    let finalAlias = character.alias;
    if (Array.isArray(aliases) && aliases.length > 0) {
      finalAlias = aliases.map((a: any) => (typeof a === 'string' ? a : a.alias)).filter(Boolean).join(', ');
    }

    // Update main character row
    const { error: updateErr } = await supabase
      .from('characters')
      .update({
        name: character.name,
        japanese_name: character.japanese_name,
        alias: finalAlias || null,
        romanized_name: finalAlias || character.romanized_name || null,
        gender: character.gender,
        race: character.race,
        status: character.status,
        age: character.age !== null && character.age !== undefined && character.age !== '' ? Number(character.age) : null,
        height: character.height !== null && character.height !== undefined && character.height !== '' ? Number(character.height) : null,
        bounty: character.bounty !== null && character.bounty !== undefined && character.bounty !== '' ? Number(character.bounty) : null,
        origin: character.origin,
        first_appearance: character.first_appearance,
        first_arc: character.first_arc,
        birthday: character.birthday,
        blood_type: character.blood_type,
        description: character.description,
        devil_fruit_name: character.devil_fruit_name,
        devil_fruit_type: character.devil_fruit_type,
        devil_fruit_model: character.devil_fruit_model,
        image_url: character.image_url,
        verification_status: character.verification_status || 'verified',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Replace affiliations
    if (Array.isArray(affiliations)) {
      await supabase.from('character_affiliations').delete().eq('character_id', id);
      const validAffs = affiliations.map((a: string) => (typeof a === 'string' ? a.trim() : '')).filter(Boolean);
      if (validAffs.length > 0) {
        await supabase
          .from('character_affiliations')
          .insert(validAffs.map((a: string) => ({ character_id: id, affiliation: a })));
      }
    }

    // Replace occupations
    if (Array.isArray(occupations)) {
      await supabase.from('character_occupations').delete().eq('character_id', id);
      const validOccs = occupations.map((o: string) => (typeof o === 'string' ? o.trim() : '')).filter(Boolean);
      if (validOccs.length > 0) {
        await supabase
          .from('character_occupations')
          .insert(validOccs.map((o: string) => ({ character_id: id, occupation: o })));
      }
    }

    // Replace Haki
    if (Array.isArray(haki)) {
      await supabase.from('character_haki').delete().eq('character_id', id);
      if (haki.length > 0) {
        await supabase.from('character_haki').insert(
          haki.map((h: any) => ({
            character_id: id,
            haki_type: typeof h === 'string' ? h : h.haki_type,
            custom_haki: typeof h === 'object' ? h.custom_haki : null,
          }))
        );
      }
    }

    // Replace Aliases
    if (Array.isArray(aliases)) {
      await supabase.from('character_aliases').delete().eq('character_id', id);
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const allowedFields: string[] = [
      'verification_status',
      'is_active',
      'is_canon',
      'name',
      'alias',
      'romanized_name',
      'japanese_name',
      'bounty',
      'age',
      'height',
      'gender',
      'race',
      'status',
      'origin',
      'first_appearance',
      'first_arc',
      'birthday',
      'blood_type',
      'description',
      'devil_fruit_name',
      'devil_fruit_type',
      'devil_fruit_model',
      'image_url',
    ];

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, character: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Delete associated relations first to avoid foreign key issues
    await Promise.all([
      supabase.from('character_affiliations').delete().eq('character_id', id),
      supabase.from('character_occupations').delete().eq('character_id', id),
      supabase.from('character_haki').delete().eq('character_id', id),
      supabase.from('character_aliases').delete().eq('character_id', id),
      supabase.from('character_field_evidence').delete().eq('character_id', id),
    ]);

    // Delete character row
    const { error: delErr } = await supabase.from('characters').delete().eq('id', id);

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 });
  }
}
