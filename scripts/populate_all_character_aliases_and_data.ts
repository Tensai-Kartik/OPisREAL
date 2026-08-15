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
  'Yamato': {
    aliases: ['Oni Princess', 'Son of Kaido', 'Self-Proclaimed Kozuki Oden', 'Boku Yamato', 'Princess Yamato', 'Oden'],
    affiliations: ['Kozuki Clan (Associate)', 'Beasts Pirates (Former)'],
    occupations: ['Warrior', 'Guardian Deity of Wano'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 971',
    first_arc: 'Wano Country',
    devil_fruit_name: 'Inu Inu no Mi, Model: Okuchi no Makami',
    devil_fruit_type: 'Mythical Zoan',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: null,
    age: 28,
    height: 263,
    gender: 'Female',
    race: 'Oni',
  },
  'Boa Hancock': {
    aliases: ['Pirate Empress', 'Snake Princess', 'Gorgon Sister', 'Empress of Amazon Lily', 'Hebihime', 'Boa Hankokku', 'Hancock Boa', 'Hancock'],
    affiliations: ['Kuja Pirates', 'Seven Warlords of the Sea (Former)', 'Amazon Lily Kingdom'],
    occupations: ['Captain', 'Pirate', 'Snake Princess', 'Empress'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 516',
    first_arc: 'Amazon Lily',
    devil_fruit_name: 'Mero Mero no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 1659000000,
    age: 31,
    height: 191,
    gender: 'Female',
    race: 'Human',
  },
  'Trafalgar D. Water Law': {
    aliases: ['Surgeon of Death', 'Trafalgar Law', 'Law', 'Torafaru-ya', 'Captain Law', 'Shi no Gekai', 'Torafarugā Dī Wāteru Rō', 'Law Trafalgar D. Water'],
    affiliations: ['Heart Pirates', 'Ninja-Pirate-Mink-Samurai Alliance (Former)', 'Seven Warlords of the Sea (Former)'],
    occupations: ['Captain', 'Doctor', 'Pirate'],
    origin: 'North Blue',
    first_appearance: 'Chapter 498',
    first_arc: 'Sabaody Archipelago',
    devil_fruit_name: 'Ope Ope no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Observation', 'Armament'],
    bounty: 3000000000,
    age: 26,
    height: 191,
    gender: 'Male',
    race: 'Human',
  },
  'Eustass Kid': {
    aliases: ['Captain Kid', 'Eustass Captain Kid', 'Jik-Jik', 'Yūsutasu Kiddos', 'Kid Eustass', 'Kid'],
    affiliations: ['Kid Pirates'],
    occupations: ['Captain', 'Pirate'],
    origin: 'South Blue',
    first_appearance: 'Chapter 498',
    first_arc: 'Sabaody Archipelago',
    devil_fruit_name: 'Jiki Jiki no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 3000000000,
    age: 23,
    height: 205,
    gender: 'Male',
    race: 'Human',
  },
  'Portgas D. Ace': {
    aliases: ['Fire Fist Ace', 'Fire Fist', 'Gol D. Ace', 'Commander Ace', 'Hiken no Ace', 'Pōtogasu Dī Ēsu', 'Ace Portgas D.', 'Ace'],
    affiliations: ['Whitebeard Pirates', 'Spade Pirates (Former)'],
    occupations: ['2nd Division Commander', 'Pirate', 'Captain'],
    origin: 'South Blue',
    first_appearance: 'Chapter 154',
    first_arc: 'Drum Island',
    devil_fruit_name: 'Mera Mera no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 550000000,
    age: 20,
    height: 185,
    gender: 'Male',
    race: 'Human',
  },
  'Sabo': {
    aliases: ['Flame Emperor', 'Chief of Staff', 'Lucy', 'Flame Emperor Sabo', 'Entei Sabo', 'Chief Sabo'],
    affiliations: ['Revolutionary Army'],
    occupations: ['Chief of Staff', 'Revolutionary'],
    origin: 'East Blue',
    first_appearance: 'Chapter 583',
    first_arc: 'Post-War',
    devil_fruit_name: 'Mera Mera no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Observation', 'Armament'],
    bounty: 602000000,
    age: 22,
    height: 187,
    gender: 'Male',
    race: 'Human',
  },
  'Monkey D. Dragon': {
    aliases: ['The Revolutionary', 'World\'s Worst Criminal', 'Dragon the Revolutionary', 'Supreme Commander Dragon', 'Monkī Dī Doragon', 'Dragon Monkey D.', 'Dragon'],
    affiliations: ['Revolutionary Army', 'Freedom Fighters (Former)'],
    occupations: ['Supreme Commander', 'Revolutionary'],
    origin: 'East Blue',
    first_appearance: 'Chapter 100',
    first_arc: 'Loguetown',
    devil_fruit_name: null,
    devil_fruit_type: 'Unknown',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: null,
    age: 55,
    height: 256,
    gender: 'Male',
    race: 'Human',
  },
  'Monkey D. Garp': {
    aliases: ['Hero of the Marines', 'Garp the Fist', 'Demon Garp', 'Marine Hero', 'Genkotsu no Garp', 'Garp', 'Garp Monkey D.'],
    affiliations: ['Marines'],
    occupations: ['Vice Admiral', 'Marine Instructor'],
    origin: 'East Blue',
    first_appearance: 'Chapter 92',
    first_arc: 'Arlong Park',
    devil_fruit_name: null,
    devil_fruit_type: 'None',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 3000000000,
    age: 78,
    height: 287,
    gender: 'Male',
    race: 'Human',
  },
  'Sakazuki': {
    aliases: ['Akainu', 'Red Dog', 'Fleet Admiral Akainu', 'Magma Monster', 'Fleet Admiral Sakazuki'],
    affiliations: ['Marines'],
    occupations: ['Fleet Admiral', 'Marine'],
    origin: 'North Blue',
    first_appearance: 'Chapter 397',
    first_arc: 'Enies Lobby',
    devil_fruit_name: 'Magu Magu no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Observation', 'Armament', 'Conqueror'],
    bounty: 5000000000,
    age: 55,
    height: 306,
    gender: 'Male',
    race: 'Human',
  },
  'Borsalino': {
    aliases: ['Kizaru', 'Yellow Monkey', 'Admiral Kizaru', 'Light Human Borsalino', 'Admiral Borsalino'],
    affiliations: ['Marines'],
    occupations: ['Admiral', 'Marine'],
    origin: 'North Blue',
    first_appearance: 'Chapter 504',
    first_arc: 'Sabaody Archipelago',
    devil_fruit_name: 'Pika Pika no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Observation', 'Armament'],
    bounty: 3000000000,
    age: 58,
    height: 302,
    gender: 'Male',
    race: 'Human',
  },
  'Kuzan': {
    aliases: ['Aokiji', 'Blue Pheasant', 'Former Admiral Aokiji', 'Wandering Kuzan', '10th Titanic Captain Kuzan'],
    affiliations: ['Blackbeard Pirates', 'Marines (Former)'],
    occupations: ['10th Titanic Captain', 'Pirate', 'Former Admiral'],
    origin: 'South Blue',
    first_appearance: 'Chapter 303',
    first_arc: 'Long Ring Long Land',
    devil_fruit_name: 'Hie Hie no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Observation', 'Armament'],
    bounty: 3000000000,
    age: 49,
    height: 298,
    gender: 'Male',
    race: 'Human',
  },
  'Issho': {
    aliases: ['Fujitora', 'Wisteria Tiger', 'Admiral Fujitora', 'Blind Swordsman', 'Isshō', 'Fujitora Issho'],
    affiliations: ['Marines'],
    occupations: ['Admiral', 'Marine', 'Swordsman'],
    origin: 'Grand Line',
    first_appearance: 'Chapter 701',
    first_arc: 'Dressrosa',
    devil_fruit_name: 'Zushi Zushi no Mi',
    devil_fruit_type: 'Paramecia',
    haki: ['Observation', 'Armament'],
    bounty: 3000000000,
    age: 54,
    height: 270,
    gender: 'Male',
    race: 'Human',
  },
  'Aramaki': {
    aliases: ['Ryokugyu', 'Green Bull', 'Admiral Ryokugyu', 'Forest Human Aramaki', 'Admiral Aramaki'],
    affiliations: ['Marines'],
    occupations: ['Admiral', 'Marine'],
    origin: 'South Blue',
    first_appearance: 'Chapter 905',
    first_arc: 'Levely',
    devil_fruit_name: 'Mori Mori no Mi',
    devil_fruit_type: 'Logia',
    haki: ['Observation', 'Armament'],
    bounty: 3000000000,
    age: 44,
    height: 305,
    gender: 'Male',
    race: 'Human',
  },
};

// Generate derived aliases from a character name
function deriveAliasesFromName(fullName: string): string[] {
  const aliases = new Set<string>();
  const trimmed = fullName.trim();
  if (!trimmed) return [];

  // Title stripping
  const titleMatch = trimmed.match(/^(Sir|Captain|Dr\.|Saint|Lord|Princess|Queen|King|Admiral|Vice Admiral|Rear Admiral|Commodore|Chef|Master|Elder)\s+(.+)$/i);
  if (titleMatch) {
    const withoutTitle = titleMatch[2].trim();
    aliases.add(withoutTitle);
  }

  // Token variations
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 2) {
    aliases.add(parts[1]); // Given name
    aliases.add(`${parts[1]} ${parts[0]}`); // Inverted order
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

async function populateAllAliasesAndData() {
  const supabase = createAdminClient();

  console.log('Fetching all characters from Supabase...');
  const { data: allChars, error: fetchErr } = await supabase
    .from('characters')
    .select('id, name, slug, japanese_name, romanized_name, alias, origin, first_appearance, first_arc, devil_fruit_name, devil_fruit_type, bounty, age, height, gender, race');

  if (fetchErr || !allChars) {
    console.error('Error fetching characters:', fetchErr);
    return;
  }

  console.log(`Found ${allChars.length} characters in database.`);

  let updatedCharCount = 0;
  let totalAliasesInserted = 0;

  for (const char of allChars) {
    const dictMatch = CHARACTER_ALIASES_DICTIONARY[char.name];
    const derived = deriveAliasesFromName(char.name);

    const aliasSet = new Set<string>();

    // Add existing aliases from table if any
    if (char.alias) {
      char.alias.split(/,\s*/).forEach((a: string) => a.trim() && aliasSet.add(a.trim()));
    }
    if (char.romanized_name) {
      char.romanized_name.split(/,\s*/).forEach((a: string) => a.trim() && aliasSet.add(a.trim()));
    }

    // Add dictionary aliases
    if (dictMatch && dictMatch.aliases) {
      dictMatch.aliases.forEach((a) => aliasSet.add(a.trim()));
    }

    // Add derived aliases
    derived.forEach((a) => aliasSet.add(a.trim()));

    // Remove the exact full canonical name from aliases to keep it clean
    aliasSet.delete(char.name);

    const aliasList = Array.from(aliasSet).filter(Boolean);
    const aliasString = aliasList.join(', ');

    // Prepare updates for main character row
    const updatePayload: Record<string, any> = {
      alias: aliasString || null,
      romanized_name: aliasString || char.romanized_name || null,
    };

    // If dictionary match has richer data, fill missing fields
    if (dictMatch) {
      if (!char.origin || char.origin === 'Unknown') updatePayload.origin = dictMatch.origin;
      if (!char.first_appearance) updatePayload.first_appearance = dictMatch.first_appearance;
      if (!char.first_arc) updatePayload.first_arc = dictMatch.first_arc;
      if (!char.devil_fruit_name && dictMatch.devil_fruit_name) updatePayload.devil_fruit_name = dictMatch.devil_fruit_name;
      if ((!char.devil_fruit_type || char.devil_fruit_type === 'Unknown') && dictMatch.devil_fruit_type) updatePayload.devil_fruit_type = dictMatch.devil_fruit_type;
      if ((char.bounty === null || char.bounty === undefined) && dictMatch.bounty !== undefined) updatePayload.bounty = dictMatch.bounty;
      if (!char.age && dictMatch.age) updatePayload.age = dictMatch.age;
      if (!char.height && dictMatch.height) updatePayload.height = dictMatch.height;
      if ((!char.gender || char.gender === 'Unknown') && dictMatch.gender) updatePayload.gender = dictMatch.gender;
      if ((!char.race || char.race === 'Unknown') && dictMatch.race) updatePayload.race = dictMatch.race;
    }

    // Update characters table
    const { error: updErr } = await supabase
      .from('characters')
      .update(updatePayload)
      .eq('id', char.id);

    if (!updErr) {
      updatedCharCount++;
    }

    // Insert into character_aliases table
    if (aliasList.length > 0) {
      await supabase.from('character_aliases').delete().eq('character_id', char.id);

      const aliasRows = aliasList.map((alias) => ({
        character_id: char.id,
        alias,
        alias_type: 'alias',
      }));

      const { error: insErr } = await supabase.from('character_aliases').insert(aliasRows);
      if (!insErr) {
        totalAliasesInserted += aliasList.length;
      }
    }

    // Insert affiliations if from dictionary
    if (dictMatch && dictMatch.affiliations && dictMatch.affiliations.length > 0) {
      await supabase.from('character_affiliations').delete().eq('character_id', char.id);
      await supabase.from('character_affiliations').insert(
        dictMatch.affiliations.map((affiliation) => ({
          character_id: char.id,
          affiliation,
        }))
      );
    }

    // Insert occupations if from dictionary
    if (dictMatch && dictMatch.occupations && dictMatch.occupations.length > 0) {
      await supabase.from('character_occupations').delete().eq('character_id', char.id);
      await supabase.from('character_occupations').insert(
        dictMatch.occupations.map((occupation) => ({
          character_id: char.id,
          occupation,
        }))
      );
    }

    // Insert haki if from dictionary
    if (dictMatch && dictMatch.haki && dictMatch.haki.length > 0) {
      await supabase.from('character_haki').delete().eq('character_id', char.id);
      await supabase.from('character_haki').insert(
        dictMatch.haki.map((haki_type) => ({
          character_id: char.id,
          haki_type,
        }))
      );
    }
  }

  console.log(`\n=== ENRICHMENT COMPLETE ===`);
  console.log(`✓ Updated ${updatedCharCount} characters with canonical aliases and stats.`);
  console.log(`✓ Populated ${totalAliasesInserted} records into character_aliases table.`);
}

populateAllAliasesAndData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration error:', err);
    process.exit(1);
  });
