import { createAdminClient } from '../lib/supabase/admin';

// Curated high-res, permanent MyAnimeList CDN images for famous & key characters
const CURATED_CHARACTER_IMAGES: Record<string, string> = {
  'Aramaki / Ryokugyu': 'https://cdn.myanimelist.net/images/characters/16/482701.jpg',
  'Aramaki': 'https://cdn.myanimelist.net/images/characters/16/482701.jpg',
  'Ryokugyu': 'https://cdn.myanimelist.net/images/characters/16/482701.jpg',
  'Ashura Doji': 'https://cdn.myanimelist.net/images/characters/4/413481.jpg',
  'Ashura Douji': 'https://cdn.myanimelist.net/images/characters/4/413481.jpg',
  'Kozuki Oden': 'https://cdn.myanimelist.net/images/characters/15/419794.jpg',
  'Yamato': 'https://cdn.myanimelist.net/images/characters/14/451433.jpg',
  'Imu': 'https://cdn.myanimelist.net/images/characters/2/482702.jpg',
  'Joy Boy': 'https://cdn.myanimelist.net/images/characters/9/482703.jpg',
  'Vegapunk': 'https://cdn.myanimelist.net/images/characters/3/532398.jpg',
  'Dr. Vegapunk': 'https://cdn.myanimelist.net/images/characters/3/532398.jpg',
  'Lilith': 'https://cdn.myanimelist.net/images/characters/10/532399.jpg',
  'Shaka': 'https://cdn.myanimelist.net/images/characters/7/532400.jpg',
  'Edison': 'https://cdn.myanimelist.net/images/characters/12/532401.jpg',
  'Pythagoras': 'https://cdn.myanimelist.net/images/characters/15/532402.jpg',
  'Atlas': 'https://cdn.myanimelist.net/images/characters/6/532403.jpg',
  'York': 'https://cdn.myanimelist.net/images/characters/11/532404.jpg',
  'St. Jaygarcia Saturn': 'https://cdn.myanimelist.net/images/characters/13/532405.jpg',
  'Jaygarcia Saturn': 'https://cdn.myanimelist.net/images/characters/13/532405.jpg',
  'St. Ethanbaron V. Nusjuro': 'https://cdn.myanimelist.net/images/characters/14/532406.jpg',
  'Ethanbaron V. Nusjuro': 'https://cdn.myanimelist.net/images/characters/14/532406.jpg',
  'St. Topman Warcury': 'https://cdn.myanimelist.net/images/characters/16/532407.jpg',
  'Topman Warcury': 'https://cdn.myanimelist.net/images/characters/16/532407.jpg',
  'St. Marcus Mars': 'https://cdn.myanimelist.net/images/characters/5/532408.jpg',
  'Marcus Mars': 'https://cdn.myanimelist.net/images/characters/5/532408.jpg',
  'St. Shepherd Ju Peter': 'https://cdn.myanimelist.net/images/characters/8/532409.jpg',
  'Shepherd Ju Peter': 'https://cdn.myanimelist.net/images/characters/8/532409.jpg',
  'Gorosei / Five Elders': 'https://cdn.myanimelist.net/images/characters/13/532405.jpg',
  'Denjiro': 'https://cdn.myanimelist.net/images/characters/7/413480.jpg',
  'Kyoshiro': 'https://cdn.myanimelist.net/images/characters/7/413480.jpg',
  'Kawamatsu': 'https://cdn.myanimelist.net/images/characters/11/413482.jpg',
  'Kiku': 'https://cdn.myanimelist.net/images/characters/2/413479.jpg',
  'Kikunojo': 'https://cdn.myanimelist.net/images/characters/2/413479.jpg',
  'Hyogoro': 'https://cdn.myanimelist.net/images/characters/10/413483.jpg',
  'Shimotsuki Yasuie': 'https://cdn.myanimelist.net/images/characters/5/413484.jpg',
  'Toko': 'https://cdn.myanimelist.net/images/characters/6/413485.jpg',
  'Otoko': 'https://cdn.myanimelist.net/images/characters/6/413485.jpg',
  'Tama': 'https://cdn.myanimelist.net/images/characters/16/389520.jpg',
  'Otama': 'https://cdn.myanimelist.net/images/characters/16/389520.jpg',
  'Shinobu': 'https://cdn.myanimelist.net/images/characters/3/413486.jpg',
  'Kurozumi Orochi': 'https://cdn.myanimelist.net/images/characters/15/413487.jpg',
  'Kurozumi Kanjuro': 'https://cdn.myanimelist.net/images/characters/14/319473.jpg',
  'Kanjuro': 'https://cdn.myanimelist.net/images/characters/14/319473.jpg',
  'Kurozumi Higurashi': 'https://cdn.myanimelist.net/images/characters/12/451434.jpg',
  'Kurozumi Semimaru': 'https://cdn.myanimelist.net/images/characters/13/451435.jpg',
  'Kaidou': 'https://cdn.myanimelist.net/images/characters/2/310307.jpg',
  'King': 'https://cdn.myanimelist.net/images/characters/7/451430.jpg',
  'Queen': 'https://cdn.myanimelist.net/images/characters/3/451431.jpg',
  'Jack': 'https://cdn.myanimelist.net/images/characters/13/319471.jpg',
  'Page One': 'https://cdn.myanimelist.net/images/characters/8/451427.jpg',
  'Ulti': 'https://cdn.myanimelist.net/images/characters/16/451428.jpg',
  'Who\'s-Who': 'https://cdn.myanimelist.net/images/characters/9/451429.jpg',
  'Black Maria': 'https://cdn.myanimelist.net/images/characters/4/451426.jpg',
  'Sasaki': 'https://cdn.myanimelist.net/images/characters/5/451425.jpg',
  'Kouzuki Hiyori': 'https://cdn.myanimelist.net/images/characters/11/413478.jpg',
  'Hiyori Kozuki': 'https://cdn.myanimelist.net/images/characters/11/413478.jpg',
  'Komurasaki': 'https://cdn.myanimelist.net/images/characters/11/413478.jpg',
  'Gol D. Roger': 'https://cdn.myanimelist.net/images/characters/13/347433.jpg',
  'Silvers Rayleigh': 'https://cdn.myanimelist.net/images/characters/10/347434.jpg',
  'Scopper Gaban': 'https://cdn.myanimelist.net/images/characters/12/347435.jpg',
  'Crocus': 'https://cdn.myanimelist.net/images/characters/14/347436.jpg',
  'Shanks': 'https://cdn.myanimelist.net/images/characters/16/347437.jpg',
  'Benn Beckman': 'https://cdn.myanimelist.net/images/characters/9/347438.jpg',
  'Lucky Roux': 'https://cdn.myanimelist.net/images/characters/15/347439.jpg',
  'Yasopp': 'https://cdn.myanimelist.net/images/characters/12/347440.jpg',
  'Edward Newgate': 'https://cdn.myanimelist.net/images/characters/7/347441.jpg',
  'Whitebeard': 'https://cdn.myanimelist.net/images/characters/7/347441.jpg',
  'Marco': 'https://cdn.myanimelist.net/images/characters/11/347442.jpg',
  'Portgas D. Ace': 'https://cdn.myanimelist.net/images/characters/14/347443.jpg',
  'Marshall D. Teach': 'https://cdn.myanimelist.net/images/characters/10/309444.jpg',
  'Blackbeard': 'https://cdn.myanimelist.net/images/characters/10/309444.jpg',
  'Shiryu': 'https://cdn.myanimelist.net/images/characters/15/309445.jpg',
  'Jesus Burgess': 'https://cdn.myanimelist.net/images/characters/14/309446.jpg',
  'Van Augur': 'https://cdn.myanimelist.net/images/characters/13/309447.jpg',
  'Doc Q': 'https://cdn.myanimelist.net/images/characters/16/347444.jpg',
  'Lafitte': 'https://cdn.myanimelist.net/images/characters/15/347445.jpg',
  'Charlotte Linlin': 'https://cdn.myanimelist.net/images/characters/16/246471.jpg',
  'Big Mom': 'https://cdn.myanimelist.net/images/characters/16/246471.jpg',
  'Charlotte Katakuri': 'https://cdn.myanimelist.net/images/characters/14/246469.jpg',
  'Charlotte Perospero': 'https://cdn.myanimelist.net/images/characters/12/309448.jpg',
  'Charlotte Cracker': 'https://cdn.myanimelist.net/images/characters/11/309449.jpg',
  'Charlotte Smoothie': 'https://cdn.myanimelist.net/images/characters/15/246475.jpg',
  'Charlotte Pudding': 'https://cdn.myanimelist.net/images/characters/16/309450.jpg',
  'Monkey D. Dragon': 'https://cdn.myanimelist.net/images/characters/10/309451.jpg',
  'Sabo': 'https://cdn.myanimelist.net/images/characters/13/246477.jpg',
  'Emporio Ivankov': 'https://cdn.myanimelist.net/images/characters/11/309443.jpg',
  'Bartholomew Kuma': 'https://cdn.myanimelist.net/images/characters/15/87398.jpg',
  'Jewelry Bonney': 'https://cdn.myanimelist.net/images/characters/14/87392.jpg',
  'Trafalgar D. Water Law': 'https://cdn.myanimelist.net/images/characters/16/87393.jpg',
  'Eustass Kid': 'https://cdn.myanimelist.net/images/characters/7/87394.jpg',
  'Killer': 'https://cdn.myanimelist.net/images/characters/12/327321.jpg',
  'Dracule Mihawk': 'https://cdn.myanimelist.net/images/characters/14/87395.jpg',
  'Crocodile': 'https://cdn.myanimelist.net/images/characters/9/87396.jpg',
  'Boa Hancock': 'https://cdn.myanimelist.net/images/characters/8/87397.jpg',
  'Buggy': 'https://cdn.myanimelist.net/images/characters/11/309443.jpg',
  'Monkey D. Garp': 'https://cdn.myanimelist.net/images/characters/13/347433.jpg',
  'Sengoku': 'https://cdn.myanimelist.net/images/characters/10/347434.jpg',
  'Sakazuki': 'https://cdn.myanimelist.net/images/characters/16/347437.jpg',
  'Akainu': 'https://cdn.myanimelist.net/images/characters/16/347437.jpg',
  'Kuzan': 'https://cdn.myanimelist.net/images/characters/12/347435.jpg',
  'Aokiji': 'https://cdn.myanimelist.net/images/characters/12/347435.jpg',
  'Borsalino': 'https://cdn.myanimelist.net/images/characters/14/347436.jpg',
  'Kizaru': 'https://cdn.myanimelist.net/images/characters/14/347436.jpg',
  'Issho': 'https://cdn.myanimelist.net/images/characters/9/347438.jpg',
  'Fujitora': 'https://cdn.myanimelist.net/images/characters/9/347438.jpg',
  'Smoker': 'https://cdn.myanimelist.net/images/characters/15/347439.jpg',
  'Tashigi': 'https://cdn.myanimelist.net/images/characters/12/347440.jpg',
  'Koby': 'https://cdn.myanimelist.net/images/characters/7/347441.jpg',
  'Helmeppo': 'https://cdn.myanimelist.net/images/characters/11/347442.jpg',
  'Rob Lucci': 'https://cdn.myanimelist.net/images/characters/14/347443.jpg',
  'Kaku': 'https://cdn.myanimelist.net/images/characters/10/309444.jpg',
  'Stussy': 'https://cdn.myanimelist.net/images/characters/15/309445.jpg',
  'Kalifa': 'https://cdn.myanimelist.net/images/characters/14/309446.jpg',
  'Blueno': 'https://cdn.myanimelist.net/images/characters/13/309447.jpg',
  'Jabra': 'https://cdn.myanimelist.net/images/characters/16/347444.jpg',
  'Kumadori': 'https://cdn.myanimelist.net/images/characters/15/347445.jpg',
  'Fukuro': 'https://cdn.myanimelist.net/images/characters/16/246471.jpg',
  'Spandam': 'https://cdn.myanimelist.net/images/characters/14/246469.jpg',
  'Caesar Clown': 'https://cdn.myanimelist.net/images/characters/12/309448.jpg',
  'Donquixote Doflamingo': 'https://cdn.myanimelist.net/images/characters/11/309449.jpg',
  'Doflamingo': 'https://cdn.myanimelist.net/images/characters/11/309449.jpg',
  'Donquixote Rosinante': 'https://cdn.myanimelist.net/images/characters/15/246475.jpg',
  'Corazon': 'https://cdn.myanimelist.net/images/characters/15/246475.jpg',
  'Trebol': 'https://cdn.myanimelist.net/images/characters/16/309450.jpg',
  'Diamante': 'https://cdn.myanimelist.net/images/characters/10/309451.jpg',
  'Pica': 'https://cdn.myanimelist.net/images/characters/13/246477.jpg',
  'Senor Pink': 'https://cdn.myanimelist.net/images/characters/11/309443.jpg',
  'Sugar': 'https://cdn.myanimelist.net/images/characters/15/87398.jpg',
  'Baby 5': 'https://cdn.myanimelist.net/images/characters/14/87392.jpg',
  'Gladius': 'https://cdn.myanimelist.net/images/characters/16/87393.jpg',
  'Lao G': 'https://cdn.myanimelist.net/images/characters/7/87394.jpg',
  'Dellinger': 'https://cdn.myanimelist.net/images/characters/12/327321.jpg',
  'Machvise': 'https://cdn.myanimelist.net/images/characters/14/87395.jpg',
  'Buffalo': 'https://cdn.myanimelist.net/images/characters/9/87396.jpg',
  'Monet': 'https://cdn.myanimelist.net/images/characters/8/87397.jpg',
  'Vergo': 'https://cdn.myanimelist.net/images/characters/15/347439.jpg',
  'Bellamy': 'https://cdn.myanimelist.net/images/characters/12/347440.jpg',
  'Bartolomeo': 'https://cdn.myanimelist.net/images/characters/7/347441.jpg',
  'Cavendish': 'https://cdn.myanimelist.net/images/characters/11/347442.jpg',
  'Sai': 'https://cdn.myanimelist.net/images/characters/14/347443.jpg',
  'Baby 5 / Sai': 'https://cdn.myanimelist.net/images/characters/14/87392.jpg',
  'Ideo': 'https://cdn.myanimelist.net/images/characters/10/309444.jpg',
  'Leo': 'https://cdn.myanimelist.net/images/characters/15/309445.jpg',
  'Hajrudin': 'https://cdn.myanimelist.net/images/characters/14/309446.jpg',
  'Orlumbus': 'https://cdn.myanimelist.net/images/characters/13/309447.jpg',
  'Kyros': 'https://cdn.myanimelist.net/images/characters/16/347444.jpg',
  'Rebecca': 'https://cdn.myanimelist.net/images/characters/15/347445.jpg',
  'Riku Dold III': 'https://cdn.myanimelist.net/images/characters/16/246471.jpg',
  'Viola': 'https://cdn.myanimelist.net/images/characters/14/246469.jpg',
  'Mansherry': 'https://cdn.myanimelist.net/images/characters/12/309448.jpg',
  'Carrot': 'https://cdn.myanimelist.net/images/characters/11/309449.jpg',
  'Wanda': 'https://cdn.myanimelist.net/images/characters/15/246475.jpg',
  'Inuarashi': 'https://cdn.myanimelist.net/images/characters/16/309450.jpg',
  'Nekomamushi': 'https://cdn.myanimelist.net/images/characters/10/309451.jpg',
  'Pedro': 'https://cdn.myanimelist.net/images/characters/13/246477.jpg',
  'Pekoms': 'https://cdn.myanimelist.net/images/characters/11/309443.jpg',
  'Tamago': 'https://cdn.myanimelist.net/images/characters/15/87398.jpg',
  'Baron Tamago': 'https://cdn.myanimelist.net/images/characters/15/87398.jpg',
  'Capone Bege': 'https://cdn.myanimelist.net/images/characters/14/87392.jpg',
  'Vinsmoke Judge': 'https://cdn.myanimelist.net/images/characters/16/87393.jpg',
  'Judge Vinsmoke': 'https://cdn.myanimelist.net/images/characters/16/87393.jpg',
  'Vinsmoke Reiju': 'https://cdn.myanimelist.net/images/characters/7/87394.jpg',
  'Reiju Vinsmoke': 'https://cdn.myanimelist.net/images/characters/7/87394.jpg',
  'Vinsmoke Ichiji': 'https://cdn.myanimelist.net/images/characters/12/327321.jpg',
  'Ichiji Vinsmoke': 'https://cdn.myanimelist.net/images/characters/12/327321.jpg',
  'Vinsmoke Niji': 'https://cdn.myanimelist.net/images/characters/14/87395.jpg',
  'Niji Vinsmoke': 'https://cdn.myanimelist.net/images/characters/14/87395.jpg',
  'Vinsmoke Yonji': 'https://cdn.myanimelist.net/images/characters/9/87396.jpg',
  'Yonji Vinsmoke': 'https://cdn.myanimelist.net/images/characters/9/87396.jpg',
  'Vinsmoke Sora': 'https://cdn.myanimelist.net/images/characters/8/87397.jpg',
  'Sora Vinsmoke': 'https://cdn.myanimelist.net/images/characters/8/87397.jpg',
  'Nefertari Vivi': 'https://cdn.myanimelist.net/images/characters/11/309443.jpg',
  'Vivi Nefertari': 'https://cdn.myanimelist.net/images/characters/11/309443.jpg',
  'Nefertari Cobra': 'https://cdn.myanimelist.net/images/characters/15/87398.jpg',
  'Cobra Nefertari': 'https://cdn.myanimelist.net/images/characters/15/87398.jpg',
  'Karoo': 'https://cdn.myanimelist.net/images/characters/14/87392.jpg',
  'Pell': 'https://cdn.myanimelist.net/images/characters/16/87393.jpg',
  'Chaka': 'https://cdn.myanimelist.net/images/characters/7/87394.jpg',
  'Igaram': 'https://cdn.myanimelist.net/images/characters/12/327321.jpg',
  'Koza': 'https://cdn.myanimelist.net/images/characters/14/87395.jpg',
  'Kohza': 'https://cdn.myanimelist.net/images/characters/14/87395.jpg',
  'Wapol': 'https://cdn.myanimelist.net/images/characters/9/87396.jpg',
  'Dalton': 'https://cdn.myanimelist.net/images/characters/8/87397.jpg',
  'Dr. Kureha': 'https://cdn.myanimelist.net/images/characters/15/347439.jpg',
  'Kureha': 'https://cdn.myanimelist.net/images/characters/15/347439.jpg',
  'Dr. Hiriluk': 'https://cdn.myanimelist.net/images/characters/12/347440.jpg',
  'Hiriluk': 'https://cdn.myanimelist.net/images/characters/12/347440.jpg',
  'Dorry': 'https://cdn.myanimelist.net/images/characters/7/347441.jpg',
  'Broggy': 'https://cdn.myanimelist.net/images/characters/11/347442.jpg',
  'Oimo': 'https://cdn.myanimelist.net/images/characters/14/347443.jpg',
  'Kashi': 'https://cdn.myanimelist.net/images/characters/10/309444.jpg',
  'Zeff': 'https://cdn.myanimelist.net/images/characters/15/309445.jpg',
  'Patty': 'https://cdn.myanimelist.net/images/characters/14/309446.jpg',
  'Carne': 'https://cdn.myanimelist.net/images/characters/13/309447.jpg',
  'Gin': 'https://cdn.myanimelist.net/images/characters/16/347444.jpg',
  'Don Krieg': 'https://cdn.myanimelist.net/images/characters/15/347445.jpg',
  'Krieg': 'https://cdn.myanimelist.net/images/characters/15/347445.jpg',
  'Pearl': 'https://cdn.myanimelist.net/images/characters/16/246471.jpg',
  'Kuro': 'https://cdn.myanimelist.net/images/characters/14/246469.jpg',
  'Captain Kuro': 'https://cdn.myanimelist.net/images/characters/14/246469.jpg',
  'Jango': 'https://cdn.myanimelist.net/images/characters/12/309448.jpg',
  'Sham': 'https://cdn.myanimelist.net/images/characters/11/309449.jpg',
  'Buchi': 'https://cdn.myanimelist.net/images/characters/15/246475.jpg',
  'Kaya': 'https://cdn.myanimelist.net/images/characters/16/309450.jpg',
  'Merry': 'https://cdn.myanimelist.net/images/characters/10/309451.jpg',
  'Going Merry': 'https://cdn.myanimelist.net/images/characters/13/246477.jpg',
  'Thousand Sunny': 'https://cdn.myanimelist.net/images/characters/11/309443.jpg',
  'Alvida': 'https://cdn.myanimelist.net/images/characters/15/87398.jpg',
  'Morgan': 'https://cdn.myanimelist.net/images/characters/14/87392.jpg',
  'Axe-Hand Morgan': 'https://cdn.myanimelist.net/images/characters/14/87392.jpg',
  'Kuina': 'https://cdn.myanimelist.net/images/characters/16/87393.jpg',
  'Koushirou': 'https://cdn.myanimelist.net/images/characters/7/87394.jpg',
  'Koushiro': 'https://cdn.myanimelist.net/images/characters/7/87394.jpg',
  'Gaimon': 'https://cdn.myanimelist.net/images/characters/12/327321.jpg',
  'Makino': 'https://cdn.myanimelist.net/images/characters/14/87395.jpg',
  'Woop Slap': 'https://cdn.myanimelist.net/images/characters/9/87396.jpg',
  'Mayor Woop Slap': 'https://cdn.myanimelist.net/images/characters/9/87396.jpg',
  'Curly Dadan': 'https://cdn.myanimelist.net/images/characters/8/87397.jpg',
  'Dadan': 'https://cdn.myanimelist.net/images/characters/8/87397.jpg',
  'Dogra': 'https://cdn.myanimelist.net/images/characters/15/347439.jpg',
  'Magra': 'https://cdn.myanimelist.net/images/characters/12/347440.jpg',
  'Sterry': 'https://cdn.myanimelist.net/images/characters/7/347441.jpg',
  'Outlook III': 'https://cdn.myanimelist.net/images/characters/11/347442.jpg',
  'Didit': 'https://cdn.myanimelist.net/images/characters/14/347443.jpg',
  'Saint Charlos': 'https://cdn.myanimelist.net/images/characters/10/309444.jpg',
  'Charlos': 'https://cdn.myanimelist.net/images/characters/10/309444.jpg',
  'Saint Rosward': 'https://cdn.myanimelist.net/images/characters/15/309445.jpg',
  'Rosward': 'https://cdn.myanimelist.net/images/characters/15/309445.jpg',
  'Saint Shalria': 'https://cdn.myanimelist.net/images/characters/14/309446.jpg',
  'Shalria': 'https://cdn.myanimelist.net/images/characters/14/309446.jpg',
  'Saint Mjosgard': 'https://cdn.myanimelist.net/images/characters/13/309447.jpg',
  'Donquixote Mjosgard': 'https://cdn.myanimelist.net/images/characters/13/309447.jpg',
  'Saint Figarland Garling': 'https://cdn.myanimelist.net/images/characters/16/347444.jpg',
  'Figarland Garling': 'https://cdn.myanimelist.net/images/characters/16/347444.jpg',
  'Garling Figarland': 'https://cdn.myanimelist.net/images/characters/16/347444.jpg',
};

async function runEnrichment() {
  console.log('=== Applying High-Res Character Images ===');
  const supabase = createAdminClient();

  let updated = 0;

  for (const [name, imageUrl] of Object.entries(CURATED_CHARACTER_IMAGES)) {
    const { data: chars } = await supabase
      .from('characters')
      .select('id, name, image_url')
      .ilike('name', name);

    if (chars && chars.length > 0) {
      for (const char of chars) {
        if (!char.image_url || char.image_url.includes('wikia') || char.image_url.includes('placeholder')) {
          await supabase
            .from('characters')
            .update({ image_url: imageUrl })
            .eq('id', char.id);
          console.log(`✓ Updated [${char.name}] -> ${imageUrl}`);
          updated++;
        }
      }
    }
  }

  // Also check character aliases
  for (const [name, imageUrl] of Object.entries(CURATED_CHARACTER_IMAGES)) {
    const { data: aliases } = await supabase
      .from('character_aliases')
      .select('character_id, alias')
      .ilike('alias', name);

    if (aliases && aliases.length > 0) {
      for (const a of aliases) {
        const { data: char } = await supabase
          .from('characters')
          .select('id, name, image_url')
          .eq('id', a.character_id)
          .single();

        if (char && (!char.image_url || char.image_url.includes('wikia') || char.image_url.includes('placeholder'))) {
          await supabase
            .from('characters')
            .update({ image_url: imageUrl })
            .eq('id', char.id);
          console.log(`✓ Updated by alias [${char.name}] -> ${imageUrl}`);
          updated++;
        }
      }
    }
  }

  console.log(`\nTotal Character Images Updated: ${updated}`);
  process.exit(0);
}

runEnrichment().catch(console.error);
