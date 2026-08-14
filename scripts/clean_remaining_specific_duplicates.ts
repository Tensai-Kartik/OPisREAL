import { createAdminClient } from '../lib/supabase/admin';

async function cleanRemaining() {
  const supabase = createAdminClient();

  // Delete duplicate Mihawk Dracule
  await supabase.from('character_affiliations').delete().eq('character_id', 'b682cedb-0a46-42a8-ae75-18c16c4ad6ca');
  await supabase.from('character_occupations').delete().eq('character_id', 'b682cedb-0a46-42a8-ae75-18c16c4ad6ca');
  await supabase.from('character_haki').delete().eq('character_id', 'b682cedb-0a46-42a8-ae75-18c16c4ad6ca');
  await supabase.from('character_conflicts').delete().eq('character_id', 'b682cedb-0a46-42a8-ae75-18c16c4ad6ca');
  await supabase.from('raw_character_sources').delete().eq('character_id', 'b682cedb-0a46-42a8-ae75-18c16c4ad6ca');
  await supabase.from('characters').delete().eq('id', 'b682cedb-0a46-42a8-ae75-18c16c4ad6ca');
  console.log('✓ Deleted duplicate Mihawk Dracule');

  // Delete duplicate Raizou
  await supabase.from('character_affiliations').delete().eq('character_id', 'c1abfbb0-8267-4acf-9461-4d0ad2be2469');
  await supabase.from('character_occupations').delete().eq('character_id', 'c1abfbb0-8267-4acf-9461-4d0ad2be2469');
  await supabase.from('character_haki').delete().eq('character_id', 'c1abfbb0-8267-4acf-9461-4d0ad2be2469');
  await supabase.from('character_conflicts').delete().eq('character_id', 'c1abfbb0-8267-4acf-9461-4d0ad2be2469');
  await supabase.from('raw_character_sources').delete().eq('character_id', 'c1abfbb0-8267-4acf-9461-4d0ad2be2469');
  await supabase.from('characters').delete().eq('id', 'c1abfbb0-8267-4acf-9461-4d0ad2be2469');
  console.log('✓ Deleted duplicate Raizou');

  // Check and fix french "Charlotte" names like "Charlotte Mont d’Or", "High-Fat Charlotte" -> "Charlotte High-Fat" etc.
  const { data: allChars } = await supabase.from('characters').select('id, name');
  if (allChars) {
    for (const c of allChars) {
      if (c.name.endsWith(' Charlotte')) {
        const fixed = `Charlotte ${c.name.replace(' Charlotte', '')}`;
        console.log(`Fixing inverted: ${c.name} -> ${fixed}`);
        await supabase.from('characters').update({ name: fixed }).eq('id', c.id);
      }
    }
  }

  process.exit(0);
}

cleanRemaining().catch(console.error);
