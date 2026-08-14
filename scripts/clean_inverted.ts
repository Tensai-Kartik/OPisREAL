import { createAdminClient } from '../lib/supabase/admin';

async function findInvertedDuplicates() {
  const supabase = createAdminClient();

  const { data: allChars, error } = await supabase
    .from('characters')
    .select('id, name, slug');

  if (error || !allChars) {
    console.error('Error:', error);
    return;
  }

  const invertedPatterns = [
    'Luffy Monkey D.',
    'Zoro Roronoa',
    'Roger Gol D.',
    'Ace Portgas D.',
    'Garp Monkey D.',
    'Dragon Monkey D.',
    'Teach Marshall D.',
    'Law Trafalgar',
    'Law Trafalgar D. Water',
    'Newgate Edward',
    'Rayleigh Silvers',
    'Katakuri Charlotte',
    'Linlin Charlotte',
    'Doflamingo Donquixote',
    'Mihawk Dracule',
    'Crocodile Sir',
    'Hancock Boa',
    'Smoker Captain',
    'Kid Eustass',
    'Killer',
  ];

  console.log(`Total characters: ${allChars.length}`);
  const matching = allChars.filter(c => 
    invertedPatterns.some(p => c.name.toLowerCase() === p.toLowerCase()) ||
    c.name.endsWith(' Monkey D.') ||
    c.name.endsWith(' Gol D.') ||
    c.name.endsWith(' Portgas D.')
  );

  console.log('Inverted name duplicates found:', matching);

  // Delete 'Luffy Monkey D.' specifically and other obvious duplicates
  const toDelete = matching.filter(c => c.name === 'Luffy Monkey D.');
  for (const item of toDelete) {
    console.log(`Deleting duplicate: ${item.name} (${item.id})`);
    await supabase.from('character_affiliations').delete().eq('character_id', item.id);
    await supabase.from('character_occupations').delete().eq('character_id', item.id);
    await supabase.from('character_haki').delete().eq('character_id', item.id);
    await supabase.from('character_aliases').delete().eq('character_id', item.id);
    await supabase.from('character_field_evidence').delete().eq('character_id', item.id);
    const { error: delErr } = await supabase.from('characters').delete().eq('id', item.id);
    if (delErr) console.error('Delete error:', delErr);
    else console.log(`✓ Deleted ${item.name}`);
  }

  process.exit(0);
}

findInvertedDuplicates().catch(console.error);
