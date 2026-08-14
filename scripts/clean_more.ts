import { createAdminClient } from '../lib/supabase/admin';

async function cleanMoreDuplicates() {
  const supabase = createAdminClient();

  const toClean = [
    { inverted: 'Zoro Roronoa', canonical: 'Roronoa Zoro' },
    { inverted: 'Hancock Boa', canonical: 'Boa Hancock' },
    { inverted: 'Mihawk Dracule', canonical: 'Dracule Mihawk' },
    { inverted: 'Doflamingo Donquixote', canonical: 'Donquixote Doflamingo' },
  ];

  for (const pair of toClean) {
    const { data: canon } = await supabase.from('characters').select('id, name').eq('name', pair.canonical).maybeSingle();
    const { data: inv } = await supabase.from('characters').select('id, name').eq('name', pair.inverted).maybeSingle();

    if (canon && inv) {
      console.log(`Found canonical "${canon.name}", deleting inverted "${inv.name}" (${inv.id})`);
      await supabase.from('character_affiliations').delete().eq('character_id', inv.id);
      await supabase.from('character_occupations').delete().eq('character_id', inv.id);
      await supabase.from('character_haki').delete().eq('character_id', inv.id);
      await supabase.from('character_aliases').delete().eq('character_id', inv.id);
      await supabase.from('character_field_evidence').delete().eq('character_id', inv.id);
      await supabase.from('characters').delete().eq('id', inv.id);
      console.log(`✓ Deleted ${inv.name}`);
    }
  }

  process.exit(0);
}

cleanMoreDuplicates().catch(console.error);
