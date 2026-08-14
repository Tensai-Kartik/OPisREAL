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

    // Update main character row
    const { error: updateErr } = await supabase
      .from('characters')
      .update({
        name: character.name,
        japanese_name: character.japanese_name,
        romanized_name: character.romanized_name,
        gender: character.gender,
        race: character.race,
        status: character.status,
        age: character.age !== null && character.age !== undefined ? Number(character.age) : null,
        height: character.height !== null && character.height !== undefined ? Number(character.height) : null,
        bounty: character.bounty !== null && character.bounty !== undefined ? Number(character.bounty) : null,
        origin: character.origin,
        first_appearance: character.first_appearance,
        first_arc: character.first_arc,
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
      if (affiliations.length > 0) {
        await supabase
          .from('character_affiliations')
          .insert(affiliations.map((a: string) => ({ character_id: id, affiliation: a })));
      }
    }

    // Replace occupations
    if (Array.isArray(occupations)) {
      await supabase.from('character_occupations').delete().eq('character_id', id);
      if (occupations.length > 0) {
        await supabase
          .from('character_occupations')
          .insert(occupations.map((o: string) => ({ character_id: id, occupation: o })));
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
      if (aliases.length > 0) {
        await supabase.from('character_aliases').insert(
          aliases.map((a: any) => ({
            character_id: id,
            alias: typeof a === 'string' ? a : a.alias,
            alias_type: typeof a === 'object' ? a.alias_type || 'alias' : 'alias',
          }))
        );
      }
    }

    return NextResponse.json({ success: true });
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
