import { createAdminClient } from '../supabase/admin';
import { NormalizedCharacterData } from '../normalization/normalizer';

export async function recordEvidenceAndReconcile(
  characterId: string,
  sourceId: string,
  data: NormalizedCharacterData
) {
  const supabase = createAdminClient();

  // Batch insert evidence
  const fieldEntries: { field: string; val: string | null }[] = [
    { field: 'gender', val: data.gender },
    { field: 'race', val: data.race },
    { field: 'status', val: data.status },
    { field: 'age', val: data.age !== null ? String(data.age) : null },
    { field: 'height', val: data.height !== null ? String(data.height) : null },
    { field: 'bounty', val: data.bounty !== null ? String(data.bounty) : null },
    { field: 'origin', val: data.origin },
    { field: 'first_appearance', val: data.first_appearance },
    { field: 'devil_fruit_type', val: data.devil_fruit_type },
    { field: 'haki', val: data.haki.map((h) => h.hakiType).join(', ') },
    { field: 'affiliation', val: data.affiliations.join(', ') },
  ];

  const evidenceRows = fieldEntries
    .filter((item) => item.val)
    .map((item) => ({
      character_id: characterId,
      field_name: item.field,
      source_id: sourceId,
      raw_value: item.val,
      normalized_value: item.val,
      confidence: 0.95,
    }));

  if (evidenceRows.length > 0) {
    await supabase.from('character_field_evidence').upsert(evidenceRows, {
      onConflict: 'character_id,field_name,source_id',
    });
  }

  // Batch insert affiliations
  if (data.affiliations.length > 0) {
    const affRows = data.affiliations.map((aff) => ({
      character_id: characterId,
      affiliation: aff,
    }));
    await supabase.from('character_affiliations').insert(affRows);
  }

  // Batch insert occupations
  if (data.occupations.length > 0) {
    const occRows = data.occupations.map((occ) => ({
      character_id: characterId,
      occupation: occ,
    }));
    await supabase.from('character_occupations').insert(occRows);
  }

  // Batch insert Haki
  if (data.haki.length > 0) {
    const hakiRows = data.haki.map((h) => ({
      character_id: characterId,
      haki_type: h.hakiType,
      custom_haki: h.custom || null,
    }));
    await supabase.from('character_haki').insert(hakiRows);
  }

  // Batch insert aliases
  if (data.aliases.length > 0) {
    const aliasRows = data.aliases.map((alias) => ({
      character_id: characterId,
      alias: alias,
      alias_type: 'alias',
    }));
    await supabase.from('character_aliases').insert(aliasRows);
  }
}
