import { createAdminClient } from '../lib/supabase/admin';

async function fixInvertedAndDuplicates() {
  const supabase = createAdminClient();

  // Fetch all characters
  let allChars: any[] = [];
  let page = 0;
  while (true) {
    const { data } = await supabase
      .from('characters')
      .select('id, name, slug, alias, romanized_name, japanese_name, bounty, image_url, verification_status, is_active')
      .range(page * 1000, (page + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    allChars = allChars.concat(data);
    if (data.length < 1000) break;
    page++;
  }

  console.log(`Total characters fetched: ${allChars.length}`);

  // Canonical name mappings for inverted characters
  const nameFixes: Record<string, string> = {
    'Beckman Benn': 'Benn Beckman',
    'Bege Capone': 'Capone Bege',
    'Roux Lucky': 'Lucky Roux',
    'Newgate Edward': 'Edward Newgate',
    'Teach Marshall D': 'Marshall D. Teach',
    'Linlin Charlotte': 'Charlotte Linlin',
    'Katakuri Charlotte': 'Charlotte Katakuri',
    'Perospero Charlotte': 'Charlotte Perospero',
    'Smoothie Charlotte': 'Charlotte Smoothie',
    'Cracker Charlotte': 'Charlotte Cracker',
    'Daifuku Charlotte': 'Charlotte Daifuku',
    'Oven Charlotte': 'Charlotte Oven',
    'Brulee Charlotte': 'Charlotte Brulee',
    'Pudding Charlotte': 'Charlotte Pudding',
    'Flampe Charlotte': 'Charlotte Flampe',
    'Chiffon Charlotte': 'Charlotte Chiffon',
    'Lola Charlotte': 'Charlotte Lola',
    'Mont-d Or Charlotte': 'Charlotte Mont-d\'Or',
    'Opera Charlotte': 'Charlotte Opera',
    'Amande Charlotte': 'Charlotte Amande',
    'Galette Charlotte': 'Charlotte Galette',
    'Poire Charlotte': 'Charlotte Poire',
    'Bavarois Charlotte': 'Charlotte Bavarois',
    'Custard Charlotte': 'Charlotte Custard',
    'Angel Charlotte': 'Charlotte Angel',
    'Caballon Charlotte': 'Charlotte Caballon',
    'Cadenza Charlotte': 'Charlotte Cadenza',
    'Calvados Charlotte': 'Charlotte Calvados',
    'Cannele Charlotte': 'Charlotte Cannele',
    'Capuccino Charlotte': 'Charlotte Capuccino',
    'Chiboust Charlotte': 'Charlotte Chiboust',
    'Citron Charlotte': 'Charlotte Citron',
    'Cinnamon Charlotte': 'Charlotte Cinnamon',
    'Compo Charlotte': 'Charlotte Compo',
    'Compote Charlotte': 'Charlotte Compote',
    'Cornstarch Charlotte': 'Charlotte Cornstarch',
    'Counter Charlotte': 'Charlotte Counter',
    'Cousin Charlotte': 'Charlotte Cousin',
    'Craquante Charlotte': 'Charlotte Craquante',
    'Crouton Charlotte': 'Charlotte Crouton',
    'Decuplets Charlotte': 'Charlotte Decuplets',
    'De-Chat Charlotte': 'Charlotte De-Chat',
    'Doble Charlotte': 'Charlotte Doble',
    'Dolce Charlotte': 'Charlotte Dolce',
    'Dragée Charlotte': 'Charlotte Dragee',
    'Effilee Charlotte': 'Charlotte Effilee',
    'Gala Charlotte': 'Charlotte Gala',
    'Hachée Charlotte': 'Charlotte Hachee',
    'Harumeg Charlotte': 'Charlotte Harumeg',
    'Jostarte Charlotte': 'Charlotte Jostarte',
    'Kanten Charlotte': 'Charlotte Kanten',
    'Kato Charlotte': 'Charlotte Kato',
    'Laurin Charlotte': 'Charlotte Laurin',
    'Maple Charlotte': 'Charlotte Maple',
    'Marble Charlotte': 'Charlotte Marble',
    'Marnier Charlotte': 'Charlotte Marnier',
    'Mash Charlotte': 'Charlotte Mash',
    'Mascarpone Charlotte': 'Charlotte Mascarpone',
    'Melise Charlotte': 'Charlotte Melise',
    'Mobile Charlotte': 'Charlotte Mobile',
    'Mocondo Charlotte': 'Charlotte Mocondo',
    'Mondee Charlotte': 'Charlotte Mondee',
    'Moscato Charlotte': 'Charlotte Moscato',
    'Mozzarella Charlotte': 'Charlotte Mozzarella',
    'Myres Charlotte': 'Charlotte Myres',
    'Newgo Charlotte': 'Charlotte Newgo',
    'Newichi Charlotte': 'Charlotte Newichi',
    'Newji Charlotte': 'Charlotte Newji',
    'Newsan Charlotte': 'Charlotte Newsan',
    'Newshi Charlotte': 'Charlotte Newshi',
    'Nougat Charlotte': 'Charlotte Nougat',
    'Noisette Charlotte': 'Charlotte Noisette',
    'Nutmeg Charlotte': 'Charlotte Nutmeg',
    'Nuts Charlotte': 'Charlotte Nuts',
    'Panna Charlotte': 'Charlotte Panna',
    'Prim Charlotte': 'Charlotte Prim',
    'Praline Charlotte': 'Charlotte Praline',
    'Raisin Charlotte': 'Charlotte Raisin',
    'Saint-Marc Charlotte': 'Charlotte Saint-Marc',
    'Sans-Fard Charlotte': 'Charlotte Sans-Fard',
    'Snack Charlotte': 'Charlotte Snack',
    'Tablet Charlotte': 'Charlotte Tablet',
    'Wafers Charlotte': 'Charlotte Wafers',
    'Yuen Charlotte': 'Charlotte Yuen',
    'Zuccotto Charlotte': 'Charlotte Zuccotto',
  };

  for (const [invertedName, canonicalName] of Object.entries(nameFixes)) {
    const matchingInverted = allChars.filter(c => c.name.toLowerCase() === invertedName.toLowerCase());
    const matchingCanonical = allChars.filter(c => c.name.toLowerCase() === canonicalName.toLowerCase());

    if (matchingInverted.length > 0) {
      for (const inv of matchingInverted) {
        if (matchingCanonical.length > 0) {
          // Both exist: merge/delete the inverted duplicate
          console.log(`Merging & Deleting inverted duplicate "${inv.name}" (id: ${inv.id}) -> canonical "${matchingCanonical[0].name}" (id: ${matchingCanonical[0].id})`);
          
          // Ensure canonical has proper aliases
          const existingAlias = matchingCanonical[0].alias || '';
          const newAliases = Array.from(new Set([
            ...existingAlias.split(/,\s*/),
            invertedName,
            inv.alias ? inv.alias.split(/,\s*/) : []
          ].flat().filter(Boolean))).join(', ');

          await supabase.from('characters').update({
            alias: newAliases,
            romanized_name: newAliases,
            verification_status: 'verified',
            is_active: true
          }).eq('id', matchingCanonical[0].id);

          await supabase.from('characters').delete().eq('id', inv.id);
        } else {
          // Only inverted exists: rename to canonical and add inverted as alias
          console.log(`Renaming "${inv.name}" -> "${canonicalName}"`);
          const existingAlias = inv.alias || '';
          const newAliases = Array.from(new Set([
            ...existingAlias.split(/,\s*/),
            invertedName
          ].flat().filter(Boolean))).join(', ');

          await supabase.from('characters').update({
            name: canonicalName,
            alias: newAliases,
            romanized_name: newAliases,
            verification_status: 'verified',
            is_active: true
          }).eq('id', inv.id);

          // Add alias to character_aliases table
          await supabase.from('character_aliases').upsert({
            character_id: inv.id,
            alias: invertedName,
            alias_type: 'inverted_name'
          }, { onConflict: 'character_id,alias' });
        }
      }
    }
  }

  // Ensure Capone Bege specifically is canonical
  const { data: begeRecords } = await supabase
    .from('characters')
    .select('id, name, alias')
    .ilike('name', '%bege%');

  console.log('Final Bege Records:', begeRecords);

  const { data: bennRecords } = await supabase
    .from('characters')
    .select('id, name, alias')
    .ilike('name', '%benn%');

  console.log('Final Benn Records:', bennRecords);

  console.log('Done fixing inverted duplicates!');
}

fixInvertedAndDuplicates();
