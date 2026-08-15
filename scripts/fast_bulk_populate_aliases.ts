import { createAdminClient } from '../lib/supabase/admin';

// Comprehensive dictionary of canonical aliases, epithets, and titles for One Piece characters
const CHARACTER_ALIASES_DICTIONARY: Record<string, { aliases: string[]; affiliations?: string[]; occupations?: string[]; origin?: string; first_appearance?: string; first_arc?: string; devil_fruit_name?: string | null; devil_fruit_type?: string; haki?: string[]; bounty?: number | null; age?: number; height?: number; gender?: string; race?: string }> = {
  'Monkey D. Luffy': {
    aliases: ['Straw Hat Luffy', 'Straw Hat', 'Mugiwara', 'Joy Boy', 'Fifth Emperor', 'Lucy', 'Sun God Nika', 'Luffy', 'Monkī D. Rufi', 'Luffy Monkey D.'],
    affiliations: ['Straw Hat Pirates', 'Straw Hat Grand Fleet', 'Ninja-Pirate-Mink-Samurai Alliance'],
    occupations: ['Captain', 'Pirate', 'Emperor'],
    origin: 'East Blue',
    first_appearance: 'Chapter 1',
    first_arc: 'Romance Dawn',
    devil_fruit_name: 'Hito Hito no Mi, Model: Nika',
    devil_fruit_type: 'Mythical Zoan',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 3000000000,
    age: 19,
    height: 174,
    gender: 'Male',
    race: 'Human',
  },
  'Roronoa Zoro': {
    aliases: ['Pirate Hunter', 'The Pirate Hunter', 'Pirate Hunter Zoro', 'King of Hell', 'Marimo', 'Zorojuro', 'Mr. Bushido', 'Zoro', 'Zoro Roronoa'],
    affiliations: ['Straw Hat Pirates'],
    occupations: ['Swordsman', 'Combatant', 'Pirate'],
    origin: 'East Blue',
    first_appearance: 'Chapter 3',
    first_arc: 'Romance Dawn',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 1111000000,
    age: 21,
    height: 181,
    gender: 'Male',
    race: 'Human',
  },
  'Nami': {
    aliases: ['Cat Burglar', 'Cat Burglar Nami', 'Weather Fairy', 'O-Nami', 'Madam Nami', 'Dorobō Neko'],
    affiliations: ['Straw Hat Pirates'],
    occupations: ['Navigator', 'Pirate', 'Thief'],
    origin: 'East Blue',
    first_appearance: 'Chapter 8',
    first_arc: 'Orange Town',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: [],
    bounty: 366000000,
    age: 20,
    height: 170,
    gender: 'Female',
    race: 'Human',
  },
  'Usopp': {
    aliases: ['God Usopp', 'Sogeking', 'Sniper King', 'King of Snipers', 'Uso-hachi', 'Captain Usopp', 'Hana Arashi', 'Usoppu'],
    affiliations: ['Straw Hat Pirates'],
    occupations: ['Sniper', 'Pirate', 'Inventor'],
    origin: 'East Blue',
    first_appearance: 'Chapter 23',
    first_arc: 'Syrup Village',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation'],
    bounty: 500000000,
    age: 19,
    height: 176,
    gender: 'Male',
    race: 'Human',
  },
  'Sanji': {
    aliases: ['Black Leg', 'Black Leg Sanji', 'Stealth Black', 'Soba Mask', 'O-Soba Mask', 'Sangoro', 'Prince', 'Kuro Ashi no Sanji', 'Vinsmoke Sanji', 'Sanji Vinsmoke'],
    affiliations: ['Straw Hat Pirates', 'Germa 66 (Former)', 'Baratie (Former)'],
    occupations: ['Cook', 'Pirate', 'Chef', 'Martial Artist'],
    origin: 'North Blue',
    first_appearance: 'Chapter 43',
    first_arc: 'Baratie',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation', 'Armament'],
    bounty: 1032000000,
    age: 21,
    height: 180,
    gender: 'Male',
    race: 'Human',
  },
  'Tony Tony Chopper': {
    aliases: ['Cotton Candy Lover', 'Cotton Candy Lover Chopper', 'Chopper-emon', 'Emergency Food', 'Doctor Chopper', 'Tony-kun', 'Chopper', 'Tonī Tonī Choppā'],
    affiliations: ['Straw Hat Pirates'],
    occupations: ['Doctor', 'Pirate'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 134',
    first_arc: 'Drum Island',
    devil_fruit_name: 'Hito Hito no Mi',
    devil_fruit_type: 'Zoan',
    haki: [],
    bounty: 1000,
    age: 17,
    height: 90,
    gender: 'Male',
    race: 'Animal',
  },
  'Nico Robin': {
    aliases: ['Devil Child', 'Demon Child', 'Light of the Revolution', 'Miss All Sunday', 'O-Robi', 'Akuma no Ko', 'Robin', 'Niko Robin'],
    affiliations: ['Straw Hat Pirates', 'Baroque Works (Former)', 'Revolutionary Army (Associate)'],
    occupations: ['Archaeologist', 'Pirate', 'Scholar'],
    origin: 'West Blue',
    first_appearance: 'Chapter 114',
    first_arc: 'Whiskey Peak',
    devil_fruit_name: 'Hana Hana no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Armament', 'Observation'],
    bounty: 930000000,
    age: 30,
    height: 188,
    gender: 'Female',
    race: 'Human',
  },
  'Franky': {
    aliases: ['Cyborg Franky', 'Cutty Flam', 'Iron Man Franky', 'Franosuke', 'Battle Franky', 'Bakafuranky', 'Franky the Cyborg', 'Furankī'],
    affiliations: ['Straw Hat Pirates', 'Franky Family (Former)', 'Tom\'s Workers (Former)'],
    occupations: ['Shipwright', 'Pirate', 'Dismantler'],
    origin: 'South Blue',
    first_appearance: 'Chapter 329',
    first_arc: 'Water 7',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Armament'],
    bounty: 394000000,
    age: 36,
    height: 240,
    gender: 'Male',
    race: 'Cyborg',
  },
  'Brook': {
    aliases: ['Soul King', 'Soul King Brook', 'Humming Brook', 'Bonekichi', 'Dead Bones', 'Gentleman Skeleton', 'Hanauta no Brook', 'Burukku'],
    affiliations: ['Straw Hat Pirates', 'Rumbar Pirates (Former)'],
    occupations: ['Musician', 'Swordsman', 'Pirate'],
    origin: 'West Blue',
    first_appearance: 'Chapter 442',
    first_arc: 'Thriller Bark',
    devil_fruit_name: 'Yomi Yomi no Mi',
    devil_fruit_type: 'Paramecia',
    haki: [],
    bounty: 383000000,
    age: 90,
    height: 277,
    gender: 'Male',
    race: 'Human',
  },
  'Jinbe': {
    aliases: ['Knight of the Sea', 'First Son of the Sea', 'Boss Jinbe', 'Helmsman of the Sea', 'Kaikyō no Jinbē', 'Jinbei', 'Jinbē'],
    affiliations: ['Straw Hat Pirates', 'Sun Pirates (Former)', 'Seven Warlords of the Sea (Former)', 'Big Mom Pirates (Former)'],
    occupations: ['Helmsman', 'Pirate', 'Martial Artist'],
    origin: 'Fish-Man Island',
    first_appearance: 'Chapter 528',
    first_arc: 'Impel Down',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation', 'Armament'],
    bounty: 1100000000,
    age: 46,
    height: 301,
    gender: 'Male',
    race: 'Fish-Man',
  },
  'Gol D. Roger': {
    aliases: ['Pirate King', 'Gold Roger', 'King of the Pirates', 'Roger', 'Gōru Dī Rojā', 'Roger Gol D.'],
    affiliations: ['Roger Pirates'],
    occupations: ['Captain', 'Pirate', 'Pirate King'],
    origin: 'East Blue',
    first_appearance: 'Chapter 1',
    first_arc: 'Romance Dawn',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 5564800000,
    age: 53,
    height: 274,
    gender: 'Male',
    race: 'Human',
  },
  'Edward Newgate': {
    aliases: ['Whitebeard', 'Edward Whitebeard', 'Strongest Man in the World', 'Man Closest to One Piece', 'Oyaji', 'Shirohige', 'Edowādo Nyūgēto', 'Newgate Edward'],
    affiliations: ['Whitebeard Pirates', 'Rocks Pirates (Former)'],
    occupations: ['Captain', 'Pirate', 'Emperor'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 234',
    first_arc: 'Jaya',
    devil_fruit_name: 'Gura Gura no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 5046000000,
    age: 72,
    height: 666,
    gender: 'Male',
    race: 'Human',
  },
  'Marshall D. Teach': {
    aliases: ['Blackbeard', 'Commodore Blackbeard', 'Teach', 'Kurohige', 'Māsharu Dī Tīchi', 'Teach Marshall D.'],
    affiliations: ['Blackbeard Pirates', 'Whitebeard Pirates (Former)', 'Seven Warlords of the Sea (Former)'],
    occupations: ['Admiral', 'Pirate', 'Emperor'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 223',
    first_arc: 'Jaya',
    devil_fruit_name: 'Yami Yami no Mi & Gura Gura no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Observation', 'Armament'],
    bounty: 3996000000,
    age: 40,
    height: 344,
    gender: 'Male',
    race: 'Human',
  },
  'Shanks': {
    aliases: ['Red-Haired Shanks', 'Red Hair', 'Four Emperors Shanks', 'Chief Shanks', 'Akagami', 'Shankusu'],
    affiliations: ['Red Hair Pirates', 'Roger Pirates (Former)'],
    occupations: ['Captain', 'Pirate', 'Emperor'],
    origin: 'West Blue',
    first_appearance: 'Chapter 1',
    first_arc: 'Romance Dawn',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 4048900000,
    age: 39,
    height: 199,
    gender: 'Male',
    race: 'Human',
  },
  'Buggy': {
    aliases: ['Buggy the Star Clown', 'Buggy the Clown', 'Genius Jester', 'Cross Guild Leader', 'Lord Buggy', 'Captain Buggy', 'Star Clown', 'Bagī', 'Senryō Dōke'],
    affiliations: ['Cross Guild', 'Buggy Pirates', 'Buggy\'s Delivery (Former)', 'Roger Pirates (Former)', 'Seven Warlords of the Sea (Former)'],
    occupations: ['Leader', 'Pirate', 'Emperor'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 9',
    first_arc: 'Orange Town',
    devil_fruit_name: 'Bara Bara no Mi',
    devil_fruit_type: 'Paramecia',
    haki: [],
    bounty: 3189000000,
    age: 39,
    height: 192,
    gender: 'Male',
    race: 'Human',
  },
  'Dracule Mihawk': {
    aliases: ['Hawk-Eye', 'Hawk Eyes', 'World\'s Greatest Swordsman', 'Clermont Hawk-Eye', 'Taka no Me', 'Jurakyūru Mihōku', 'Mihawk Dracule', 'Mihawk'],
    affiliations: ['Cross Guild', 'Seven Warlords of the Sea (Former)'],
    occupations: ['Swordsman', 'Pirate', 'Officer'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 49',
    first_arc: 'Baratie',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation', 'Armament'],
    bounty: 3590000000,
    age: 43,
    height: 198,
    gender: 'Male',
    race: 'Human',
  },
  'Crocodile': {
    aliases: ['Sir Crocodile', 'Mr. 0', 'Desert King', 'King of the Desert', 'Suna no Crocodile', 'Kurokodairu'],
    affiliations: ['Cross Guild', 'Baroque Works (Former)', 'Seven Warlords of the Sea (Former)'],
    occupations: ['Officer', 'Pirate', 'President'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 126',
    first_arc: 'Little Garden',
    devil_fruit_name: 'Suna Suna no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Armament', 'Observation'],
    bounty: 1965000000,
    age: 46,
    height: 253,
    gender: 'Male',
    race: 'Human',
  },
  'Donquixote Doflamingo': {
    aliases: ['Heavenly Yaksha', 'Joker', 'Young Master', 'Doffy', 'Charisma of Evil', 'Ten Yasha', 'Donkihōte Dofuramingo', 'Doflamingo Donquixote', 'Doflamingo'],
    affiliations: ['Donquixote Pirates', 'Seven Warlords of the Sea (Former)', 'World Nobles (Former)'],
    occupations: ['Captain', 'Pirate', 'Underworld Broker', 'Former King of Dressrosa'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 233',
    first_arc: 'Jaya',
    devil_fruit_name: 'Ito Ito no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 340000000,
    age: 41,
    height: 305,
    gender: 'Male',
    race: 'Human',
  },
  'Charlotte Linlin': {
    aliases: ['Big Mom', 'Great Pirate Big Mom', 'Mama', 'O-Lin', 'Soul Queen', 'Shārotto Rinrin', 'Linlin Charlotte', 'Linlin'],
    affiliations: ['Big Mom Pirates', 'Rocks Pirates (Former)'],
    occupations: ['Captain', 'Pirate', 'Emperor', 'Queen of Totto Land'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 651',
    first_arc: 'Fish-Man Island',
    devil_fruit_name: 'Soru Soru no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 4388000000,
    age: 68,
    height: 880,
    gender: 'Female',
    race: 'Human',
  },
  'Kaidou': {
    aliases: ['Kaido of the Beasts', 'King of the Beasts', 'Strongest Creature', 'Governor-General Kaido', 'Hundred Beasts Kaido', 'Kaidō', 'Kaido'],
    affiliations: ['Beasts Pirates', 'Rocks Pirates (Former)'],
    occupations: ['Governor-General', 'Pirate', 'Emperor'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 795',
    first_arc: 'Dressrosa',
    devil_fruit_name: 'Uo Uo no Mi, Model: Seiryu',
    devil_fruit_type: 'Mythical Zoan',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 4611100000,
    age: 59,
    height: 710,
    gender: 'Male',
    race: 'Oni',
  },
};

function deriveAliasesFromName(fullName: string): string[] {
  const aliases = new Set<string>();
  const trimmed = fullName.trim();
  if (!trimmed) return [];

  const titleMatch = trimmed.match(/^(Sir|Captain|Dr\.|Saint|Lord|Princess|Queen|King|Admiral|Vice Admiral|Rear Admiral|Commodore|Chef|Master|Elder)\s+(.+)$/i);
  if (titleMatch) {
    const withoutTitle = titleMatch[2].trim();
    aliases.add(withoutTitle);
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 2) {
    aliases.add(parts[1]);
    aliases.add(`${parts[1]} ${parts[0]}`);
  } else if (parts.length === 3 && parts[1] === 'D.') {
    aliases.add(parts[2]);
    aliases.add(`${parts[2]} ${parts[0]} ${parts[1]}`);
  } else if (parts.length === 4 && parts[1] === 'D.' && parts[2] === 'Water') {
    aliases.add(`${parts[0]} ${parts[3]}`);
    aliases.add(parts[3]);
    aliases.add(`${parts[3]} ${parts[0]} ${parts[1]} ${parts[2]}`);
  }

  return Array.from(aliases);
}

async function fastBulkPopulate() {
  const supabase = createAdminClient();

  console.log('Fetching all characters across all pages...');
  let allChars: any[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, slug, japanese_name, romanized_name, alias, origin, first_appearance, first_arc, devil_fruit_name, devil_fruit_type, bounty, age, height, gender, race')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error || !data || data.length === 0) break;
    allChars = allChars.concat(data);
    if (data.length < pageSize) break;
    page++;
  }

  console.log(`Loaded total ${allChars.length} characters.`);

  // Prepare batch updates and bulk inserts
  const allAliasRows: { character_id: string; alias: string; alias_type: string }[] = [];
  const charUpdates: { id: string; payload: any }[] = [];

  for (const char of allChars) {
    const dictMatch = CHARACTER_ALIASES_DICTIONARY[char.name];
    const derived = deriveAliasesFromName(char.name);

    const aliasSet = new Set<string>();

    if (char.alias) {
      char.alias.split(/,\s*/).forEach((a: string) => a.trim() && aliasSet.add(a.trim()));
    }
    if (char.romanized_name) {
      char.romanized_name.split(/,\s*/).forEach((a: string) => a.trim() && aliasSet.add(a.trim()));
    }
    if (dictMatch && dictMatch.aliases) {
      dictMatch.aliases.forEach((a) => aliasSet.add(a.trim()));
    }
    derived.forEach((a) => aliasSet.add(a.trim()));
    aliasSet.delete(char.name);

    const aliasList = Array.from(aliasSet).filter(Boolean);
    const aliasString = aliasList.join(', ');

    const payload: Record<string, any> = {
      alias: aliasString || null,
      romanized_name: aliasString || char.romanized_name || null,
    };

    if (dictMatch) {
      if (!char.origin || char.origin === 'Unknown') payload.origin = dictMatch.origin;
      if (!char.first_appearance) payload.first_appearance = dictMatch.first_appearance;
      if (!char.first_arc) payload.first_arc = dictMatch.first_arc;
      if (!char.devil_fruit_name && dictMatch.devil_fruit_name) payload.devil_fruit_name = dictMatch.devil_fruit_name;
      if ((!char.devil_fruit_type || char.devil_fruit_type === 'Unknown') && dictMatch.devil_fruit_type) payload.devil_fruit_type = dictMatch.devil_fruit_type;
      if ((char.bounty === null || char.bounty === undefined) && dictMatch.bounty !== undefined) payload.bounty = dictMatch.bounty;
      if (!char.age && dictMatch.age) payload.age = dictMatch.age;
      if (!char.height && dictMatch.height) payload.height = dictMatch.height;
      if ((!char.gender || char.gender === 'Unknown') && dictMatch.gender) payload.gender = dictMatch.gender;
      if ((!char.race || char.race === 'Unknown') && dictMatch.race) payload.race = dictMatch.race;
    }

    charUpdates.push({ id: char.id, payload });

    for (const a of aliasList) {
      allAliasRows.push({
        character_id: char.id,
        alias: a,
        alias_type: 'alias',
      });
    }
  }

  console.log(`Processing updates for ${charUpdates.length} characters in concurrent batches...`);

  // Execute character row updates in parallel chunks of 25
  const chunkSize = 25;
  for (let i = 0; i < charUpdates.length; i += chunkSize) {
    const chunk = charUpdates.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map((item) =>
        supabase.from('characters').update(item.payload).eq('id', item.id)
      )
    );
    if (i % 250 === 0) {
      console.log(`  -> Updated ${Math.min(i + chunkSize, charUpdates.length)} / ${charUpdates.length} characters...`);
    }
  }

  console.log(`Clearing old character_aliases and bulk inserting ${allAliasRows.length} alias records...`);
  // Clean all and bulk insert
  await supabase.from('character_aliases').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert in chunks of 500
  const insertChunkSize = 500;
  for (let i = 0; i < allAliasRows.length; i += insertChunkSize) {
    const slice = allAliasRows.slice(i, i + insertChunkSize);
    const { error: insErr } = await supabase.from('character_aliases').insert(slice);
    if (insErr) {
      console.error('Insert error at chunk:', i, insErr.message);
    }
  }

  console.log('✓ Bulk alias synchronization finished successfully!');
}

fastBulkPopulate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fast bulk populate failed:', err);
    process.exit(1);
  });
