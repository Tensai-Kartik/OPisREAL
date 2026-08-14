import { createAdminClient } from '../lib/supabase/admin';

async function fixSpecificCharacters() {
  const supabase = createAdminClient();

  // Fix Raizo
  const { data: raizoChars } = await supabase
    .from('characters')
    .select('id, name')
    .ilike('name', '%Raizo%');

  console.log('Raizo matches:', raizoChars);

  if (raizoChars && raizoChars.length > 0) {
    for (const r of raizoChars) {
      await supabase.from('characters').update({
        name: 'Raizo',
        gender: 'Male',
        race: 'Human',
        age: 35,
        height: 331,
        bounty: 0,
        origin: 'Wano Country',
        first_appearance: 'Chapter 816',
        first_arc: 'Zou',
        devil_fruit_name: 'Maki Maki no Mi',
        devil_fruit_type: 'Paramecia',
        status: 'Alive',
        verification_status: 'verified',
        image_url: 'https://cdn.myanimelist.net/images/characters/11/319472.jpg',
      }).eq('id', r.id);

      await supabase.from('character_affiliations').delete().eq('character_id', r.id);
      await supabase.from('character_affiliations').insert([
        { character_id: r.id, affiliation: 'Ninja-Pirate-Mink-Samurai Alliance' },
        { character_id: r.id, affiliation: 'Nine Red Scabbards' },
        { character_id: r.id, affiliation: 'Kozuki Family' },
      ]);

      await supabase.from('character_occupations').delete().eq('character_id', r.id);
      await supabase.from('character_occupations').insert([
        { character_id: r.id, occupation: 'Ninja' },
        { character_id: r.id, occupation: 'Retainer' },
      ]);

      await supabase.from('character_haki').delete().eq('character_id', r.id);
      await supabase.from('character_haki').insert([
        { character_id: r.id, haki_type: 'Observation' },
        { character_id: r.id, haki_type: 'Armament' },
      ]);
    }
  }

  // Check Mihawk
  const { data: mihawkChars } = await supabase
    .from('characters')
    .select('id, name, verification_status')
    .ilike('name', '%Mihawk%');
  console.log('Mihawk matches:', mihawkChars);

  // Check Crocodile
  const { data: crocChars } = await supabase
    .from('characters')
    .select('id, name, verification_status')
    .ilike('name', '%Crocodile%');
  console.log('Crocodile matches:', crocChars);

  process.exit(0);
}

fixSpecificCharacters().catch(console.error);
