import { createAdminClient } from '../lib/supabase/admin';

// List of confirmed characters with NO pirate bounty (None / 0 Berries)
const NONE_BOUNTY_CHARACTERS = [
  'Makino',
  'Woop Slap',
  'Higuma',
  'Boodle',
  'Chouchou',
  'Kaya',
  'Merry',
  'Ninjin',
  'Piiman',
  'Tamanegi',
  'Zeff',
  'Patty',
  'Carne',
  'Johnny',
  'Yosaku',
  'Bellemere',
  'Nojiko',
  'Genzo',
  'Ipponmatsu',
  'Crocus',
  'Laboon',
  'Nefertari Vivi',
  'Nefertari Cobra',
  'Nefertari Titi',
  'Igaram',
  'Chaka',
  'Pell',
  'Kohza',
  'Toto',
  'Dr. Hiriluk',
  'Dr. Kureha',
  'Dalton',
  'Mont Blanc Cricket',
  'Gan Fall',
  'Conis',
  'Pagaya',
  'Aisa',
  'Raki',
  'Kalgara',
  'Mont Blanc Noland',
  'Iceburg',
  'Paulie',
  'Peepley Lulu',
  'Tilestone',
  'Kokoro',
  'Chimney',
  'Gonbe',
  'Tom',
  'Victoria Cindry',
  'Shakuyaku',
  'Duval',
  'Camie',
  'Pappag',
  'Marguerite',
  'Sweet Pea',
  'Aphelandra',
  'Gloriosa',
  'Hannyabal',
  'Sadie',
  'Saldeath',
  'Domino',
  'Curly Dadan',
  'Dogra',
  'Magra',
  'Neptune',
  'Fukaboshi',
  'Ryuboshi',
  'Manboshi',
  'Shirahoshi',
  'Otohime',
  'Madam Shyarly',
  'Rebecca',
  'Kyros',
  'Riku Doldo III',
  'Viola',
  'Mansherry',
  'Leo',
  'Blue Gilly',
  'Ideo',
  'Hajrudin',
  'Gerd',
  'Road',
  'Wanda',
  'Carrot',
  'Miyagi',
  'Tristan',
  'Milky',
  'Zunesha',
  'Pound',
  'King Baum',
  'Zeus',
  'Prometheus',
  'Napoleon',
  'Kozuki Hiyori',
  'O-Toko',
  'Shimotsuki Yasuie',
  'Kozuki Sukiyaki',
  'Tenguyama Hitetsu',
  'O-Tama',
  'O-Tsuru',
  'Hyogoro',
  'Kozuki Toki',
  'Onimaru',
  'Shimotsuki Ushimaru',
  'Fugetsu Omusubi',
  'Uzuki Tempura',
  'Dr. Vegapunk',
  'Shaka',
  'Lilith',
  'Edison',
  'Pythagoras',
  'Atlas',
  'York',
  'Stussy',
  'Stussy (Clone)',
  'Smoker',
  'Tashigi',
  'Helmeppo',
  'Morgan',
  'Sengoku',
  'Tsuru',
  'Momonga',
  'Onigumo',
  'Doberman',
  'Strawberry',
  'Dalmatian',
  'John Giant',
  'Brandnew',
  'Kong',
  'Sentomaru',
  'Hina',
  'T-Bone',
  'Nezumi',
  'Maynard',
  'Bastille',
  'Gion',
  'Tokikake',
  'Prince Grus',
  'Kujaku',
  'Hibari',
];

async function applyNoneBounties() {
  const supabase = createAdminClient();
  console.log(`Checking ${NONE_BOUNTY_CHARACTERS.length} non-pirate/civilian characters to assign bounty = 0 (None)...`);

  let count = 0;
  for (const name of NONE_BOUNTY_CHARACTERS) {
    const { data: char } = await supabase
      .from('characters')
      .select('id, name, bounty')
      .ilike('name', `%${name}%`)
      .limit(1)
      .maybeSingle();

    if (char && (char.bounty === null || char.bounty === undefined)) {
      const { error } = await supabase
        .from('characters')
        .update({ bounty: 0, updated_at: new Date().toISOString() })
        .eq('id', char.id);

      if (!error) {
        count++;
        console.log(`✓ Set bounty = 0 (None) for ${char.name}`);
      }
    }
  }

  console.log(`\nAssigned bounty = 0 (None) to ${count} confirmed characters.`);
  process.exit(0);
}

applyNoneBounties().catch(console.error);
