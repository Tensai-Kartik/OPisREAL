import { createAdminClient } from '../lib/supabase/admin';

async function scanInvertedNames() {
  const supabase = createAdminClient();
  const { data: allChars } = await supabase
    .from('characters')
    .select('id, name, alias, romanized_name, verification_status, bounty, image_url')
    .eq('is_active', true);

  if (!allChars) return;

  console.log(`Total active characters: ${allChars.length}`);

  // Known Japanese-order inversions that should be canonical Western One Piece names
  const canonicalFixes: Record<string, string> = {
    'Beckman Benn': 'Benn Beckman',
    'Bege Capone': 'Capone Bege',
    'Roux Lucky': 'Lucky Roux',
    'Yasopp': 'Yasopp',
    'Gab Building': 'Building Snake',
    'Bonk Punch': 'Bonk Punch',
    'Monster': 'Monster',
    'Limejuice': 'Limejuice',
    'Hongo': 'Hongo',
    'Howling Gab': 'Howling Gab',
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
    'Chiffon': 'Charlotte Chiffon',
    'Citron Charlotte': 'Charlotte Citron',
    'Cinnamon Charlotte': 'Charlotte Cinnamon',
    'Compo Charlotte': 'Charlotte Compo',
    'Compote Charlotte': 'Charlotte Compote',
    'Cornstarch Charlotte': 'Charlotte Cornstarch',
    'Counter Charlotte': 'Charlotte Counter',
    'Cousin Charlotte': 'Charlotte Cousin',
    'Craquante Charlotte': 'Charlotte Craquante',
    'Crouton Charlotte': 'Charlotte Crouton',
    'Custard': 'Charlotte Custard',
    'Decuplets Charlotte': 'Charlotte Decuplets',
    'De-Chat Charlotte': 'Charlotte De-Chat',
    'Doble Charlotte': 'Charlotte Doble',
    'Dolce Charlotte': 'Charlotte Dolce',
    'Dragée Charlotte': 'Charlotte Dragee',
    'Dragée': 'Charlotte Dragee',
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

  for (const [inverted, canonical] of Object.entries(canonicalFixes)) {
    const found = allChars.filter(c => c.name.toLowerCase() === inverted.toLowerCase());
    const canonicalFound = allChars.filter(c => c.name.toLowerCase() === canonical.toLowerCase());

    if (found.length > 0) {
      console.log(`Found inverted: "${inverted}" (${found.length} records), canonical "${canonical}" (${canonicalFound.length} records)`);
    }
  }
}

scanInvertedNames();
