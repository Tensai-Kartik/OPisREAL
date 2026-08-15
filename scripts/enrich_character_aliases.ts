import { createAdminClient } from '../lib/supabase/admin';

// Exhaustive dictionary of known One Piece characters to their canon epithets, aliases, titles, and nicknames
const ALIAS_DICTIONARY: Record<string, string[]> = {
  // Straw Hat Pirates
  'monkey d. luffy': ['Straw Hat Luffy', 'Straw Hat', 'Joy Boy', 'Fifth Emperor', 'Lucy', 'Sun God Nika', 'Mugiwara'],
  'roronoa zoro': ['The Pirate Hunter', 'Pirate Hunter', 'King of Hell', 'Marimo', 'Zorojuro', 'Mr. Bushido'],
  'nami': ['Cat Burglar', 'Weather Fairy', 'O-Nami', 'Madam Nami'],
  'usopp': ['God Usopp', 'Sogeking', 'Sniper King', 'Uso-hachi', 'Captain Usopp', 'King of Snipers'],
  'sanji': ['Black Leg', 'Black Leg Sanji', 'Stealth Black', 'Soba Mask', 'Sangoro', 'Prince', 'O-Soba Mask', 'Vinsmoke Sanji'],
  'tony tony chopper': ['Cotton Candy Lover', 'Cotton Candy Lover Chopper', 'Chopper-emon', 'Emergency Food', 'Doctor Chopper', 'Tony-kun'],
  'nico robin': ['Devil Child', 'Light of the Revolution', 'O-Robi', 'Miss All Sunday', 'Demon Child'],
  'franky': ['Cyborg Franky', 'Cutty Flam', 'Iron Man Franky', 'Franosuke', 'Battle Franky', 'Bakafuranky'],
  'brook': ['Soul King', 'Humming Brook', 'Bonekichi', 'Dead Bones', 'Gentleman Skeleton'],
  'jinbe': ['Knight of the Sea', 'First Son of the Sea', 'Boss Jinbe', 'Helmsman of the Sea'],
  'nefertari vivi': ['Miss Wednesday', 'Princess Vivi', 'Vivi'],

  // Four Emperors & Great Pirates
  'gol d. roger': ['Pirate King', 'Gold Roger', 'King of the Pirates'],
  'edward newgate': ['Whitebeard', 'Strongest Man in the World', 'Man Closest to One Piece', 'Oyaji'],
  'shanks': ['Red-Haired Shanks', 'Red Hair', 'Four Emperors Shanks', 'Chief Shanks', 'Akagami'],
  'marshall d. teach': ['Blackbeard', 'Commodore Blackbeard', 'Teach', 'Kurohige'],
  'charlotte linlin': ['Big Mom', 'Great Pirate Big Mom', 'Mama', 'O-Lin'],
  'kaido': ['Kaido of the Beasts', 'King of the Beasts', 'Strongest Creature', 'Governor-General Kaido'],
  'buggy': ['Buggy the Star Clown', 'Genius Jester', 'Buggy the Clown', 'Cross Guild Leader', 'Lord Buggy', 'Captain Buggy', 'Star Clown'],

  // Old Era Legends & Rogues
  'silvers rayleigh': ['Dark King', 'Right Hand of the Pirate King', 'Rayleigh', 'Meiou'],
  'scopper gaban': ['Left Hand of the Pirate King', 'Gaban'],
  'shiki': ['Golden Lion', 'Flying Pirate', 'Golden Lion Shiki'],
  'rocks d. xebec': ['Captain of Rocks', 'Xebec'],
  'don chinjao': ['Chinjao the Drill', 'The Drill', 'Kano Country Hero'],

  // Warlords of the Sea
  'dracule mihawk': ['Hawk-Eye', 'Hawk Eyes', "World's Greatest Swordsman", 'Clermont Hawk-Eye'],
  'crocodile': ['Sir Crocodile', 'Mr. 0', 'Desert King', 'King of the Desert'],
  'donquixote doflamingo': ['Heavenly Yaksha', 'Joker', 'Young Master', 'Doffy', 'Charisma of Evil'],
  'bartholomew kuma': ['Tyrant Kuma', 'Pacifista PX-0', 'Sorbet King', 'Bartholomew the Tyrant'],
  'boa hancock': ['Pirate Empress', 'Snake Princess', 'Gorgon Sister', 'Empress of Amazon Lily'],
  'gecko moria': ['Master of Shadows', 'Lord Moria', 'Former Warlord Moria'],
  'edward weevil': ['Whitebeard Jr.', 'Self-Proclaimed Son of Whitebeard'],
  'donquixote rosinante': ['Corazon', 'Cora-san', 'Commander Rosinante'],

  // Worst Generation
  'trafalgar d. water law': ['Surgeon of Death', 'Trafalgar Law', 'Law', 'Torafaru-ya', 'Captain Law'],
  'eustass kid': ['Captain Kid', 'Eustass Captain Kid', 'Jik-Jik'],
  'killer': ['Massacre Soldier', 'Kamazo the Manslayer', 'Murder Machine'],
  'jewelry bonney': ['Big Eater', 'Princess Bonney'],
  'basil hawkins': ['The Magician', 'Magician Hawkins'],
  'capone bege': ['Gang Bege', 'Father Bege', 'Capone Gang Bege'],
  'scratchmen apoo': ['Roar of the Sea', 'Apoo'],
  'x drake': ['Red Flag', 'Captain Drake', 'SWORD Leader Drake', 'Diez Drake'],
  'urouge': ['Mad Monk', 'Mad Monk Urouge'],

  // Revolutionary Army
  'monkey d. dragon': ["World's Worst Criminal", 'Dragon the Revolutionary', 'Supreme Commander Dragon', 'The Revolutionary'],
  'sabo': ['Flame Emperor', 'Chief of Staff', 'Lucy', 'Flame Emperor Sabo'],
  'emporio ivankov': ['Miracle Person', 'Queen of Kamabakka', 'Iva-chan', 'Okama King'],
  'inazuma': ['Crab Inazuma', 'Revolutionary Scissors'],
  'karasu': ['North Army Commander', 'Crow Karasu'],
  'belo betty': ['East Army Commander', 'Belo'],
  'lindbergh': ['South Army Commander', 'Inventor Lindbergh'],
  'morley': ['West Army Commander', 'Giant Morley'],
  'koala': ['Fish-Man Karate Assistant Instructor', 'Koala-chan'],
  'hack': ['100th Dan Fish-Man Karate', 'Black Belt Hack'],

  // Marine Admirals & High Command
  'sakazuki': ['Akainu', 'Red Dog', 'Fleet Admiral Akainu', 'Magma Monster'],
  'kuzan': ['Aokiji', 'Blue Pheasant', 'Former Admiral Aokiji', 'Wandering Kuzan'],
  'borusalino': ['Kizaru', 'Yellow Monkey', 'Admiral Kizaru', 'Light Human'],
  'borusarino': ['Kizaru', 'Yellow Monkey', 'Admiral Kizaru'],
  'issho': ['Fujitora', 'Wisteria Tiger', 'Admiral Fujitora', 'Blind Swordsman'],
  'aramaki': ['Ryokugyu', 'Green Bull', 'Admiral Ryokugyu'],
  'sengoku': ['Sengoku the Buddha', 'The Buddha', 'Former Fleet Admiral', 'Resourceful General'],
  'monkey d. garp': ['Garp the Fist', 'Hero of the Marines', 'Garp the Hero', 'Vice Admiral Garp', 'Demon Garp'],
  'tsuru': ['Great Staff Officer', 'Vice Admiral Tsuru', 'Clean-Clean Tsuru'],
  'smoker': ['White Hunter', 'Vice Admiral Smoker', 'White Hound'],
  'tashigi': ['Captain Tashigi', 'Sword Maiden'],
  'koby': ['Hero of Rocky Port', 'Captain Koby', 'Honesty Impact Koby', 'Future of the Marines'],
  'helmeppo': ['Lieutenant Commander Helmeppo', 'Dual Kukri Helmeppo'],
  'hina': ['Black Cage Hina', 'Rear Admiral Hina'],
  'jaguar d. saul': ['Giant Saul', 'Vice Admiral Saul'],
  'sentomaru': ["World's Strongest Defense", 'Captain Sentomaru', 'Bodyguard Sentomaru'],

  // World Government, Gorosei, CP0 & Cipher Pol
  'imu': ['Imu-sama', 'Sovereign of the Empty Throne', 'King of the World'],
  'saint jaygarcia saturn': ['Warrior God of Science and Defense', 'Elder Saturn'],
  'saint marcus mars': ['Warrior God of Environment', 'Elder Mars'],
  'saint topman warcury': ['Warrior God of Justice', 'Elder Warcury'],
  'saint ethanbaron v. nusjuro': ['Warrior God of Finance', 'Elder Nusjuro', 'Venus'],
  'saint shepherd ju peter': ['Warrior God of Agriculture', 'Elder Ju Peter', 'Jupiter'],
  'saint figarland garling': ["Supreme Commander of God's Knights", 'Hero of God Valley'],
  'rob lucci': ['Slaughter Weapon', 'CP0 Chief', 'Leopard Lucci', 'Killing Machine Lucci'],
  'kaku': ['Mountain Wind Kaku', 'Giraffe Kaku'],
  'stussy': ['Queen of the Pleasure District', 'Buckingham Stussy Clone', 'Agent Stussy'],
  'spandam': ['Chief Spandam', 'Former CP9 Chief'],
  'kalifa': ['Soap Woman Kalifa', 'Secretary Kalifa'],
  'blueno': ['Doorman Blueno'],
  'jabra': ['Wolf Jabra'],
  'kumadori': ['Lion Kumadori', 'Yoyoi Kumadori'],
  'fukuro': ['Silent Fukuro', 'Chapapa Fukuro'],

  // Beasts Pirates & Wano Country
  'yamato': ['Oni Princess', 'Son of Kaido', 'Self-Proclaimed Kozuki Oden', 'Boku Yamato'],
  'king': ['King the Wildfire', 'The Conflagration', 'Alber', 'Lunarian Survivor'],
  'queen': ['Queen the Plague', 'Scientist Queen', 'Brachiosaurus Queen'],
  'jack': ['Jack the Drought', 'Mammoth Jack', 'All-Star Jack'],
  'who\'s-who': ['Who\'s Who', 'Former CP9 Prodigy', 'Saber-Tooth Who\'s-Who'],
  'sasaki': ['Triceratops Sasaki', 'Armored Sasaki'],
  'black maria': ['Spider Woman Black Maria', 'Madam Maria'],
  'ulti': ['Pachycephalosaurus Ulti', 'Sister Ulti'],
  'page one': ['Pay-Pay', 'Spinosaurus Page One'],
  'kozuki oden': ['Lord of Kuri', 'Foolish Lord', 'Great Samurai Oden', 'Lord Oden'],
  'kozuki momonosuke': ['Lord Momonosuke', 'Shogun of Wano', 'Dragon of Wano', 'Momo'],
  'kozuki hiyori': ['Komurasaki', 'Courtesan Komurasaki', 'Princess Hiyori'],
  'kozuki sukiyaki': ['Tenguyama Hitetsu', 'Former Shogun Sukiyaki', 'Master Swordsmith Hitetsu'],
  'kurozumi orochi': ['Shogun Orochi', 'Eight-Headed Serpent'],
  'kurozumi kanjuro': ['Evening Shower Kanjuro', 'Traitor Kanjuro', 'Phantom Painter'],
  'kin\'emon': ['Foxfire Kin\'emon', 'Leader of the Nine Red Scabbards'],
  'denjiro': ['Kyoshiro', 'Napping Kyoshiro', 'Samurai Denjiro'],
  'raizo': ['Raizo of the Mist', 'Ninja Raizo'],
  'kikunojo': ['Kikunojo of the Lingering Snow', 'O-Kiku'],
  'kiku': ['Kikunojo of the Lingering Snow', 'O-Kiku'],
  'ashura doji': ['Shutenmaru', 'Strongest Monster of Kuri', 'Bandit Shutenmaru'],
  'kawamatsu': ['Kawamatsu the Kappa', 'Yokozuna Kawamatsu'],
  'inuarashi': ['Duke Inuarashi', 'Ruler of Day', 'Dog Duke'],
  'nekomamushi': ['Master Nekomamushi', 'Ruler of Night', 'Cat Viper'],
  'shinobu': ['Captivating Ninja Shinobu', 'Mature Ninja Shinobu'],
  'hyogoro': ['Hyogoro of the Flower', 'Old Man Hyo', 'Boss Hyogoro'],
  'shimotsuki yasuie': ['Tonoyasu', 'Yasu the Hedgehog', 'Daimyo Yasuie'],
  'shimotsuki ryuma': ['Sword God Ryuma', 'Dragon Slayer Ryuma', 'King Ryuma', 'Ryuma the King'],

  // Big Mom Pirates & Sweet Commanders
  'charlotte katakuri': ['Sweet Commander Katakuri', 'Dogtooth', 'Undefeated Katakuri'],
  'charlotte perospero': ['Candy Minister Perospero', 'Perorin'],
  'charlotte cracker': ['Thousand Arms Cracker', 'Sweet Commander Cracker', 'Biscuit Knight'],
  'charlotte smoothie': ['Sweet Commander Smoothie', 'Juice Minister'],
  'charlotte oven': ['Minister of Baking', 'High-Heat Oven'],
  'charlotte daifuku': ['Minister of Beans', 'Genie Daifuku'],
  'charlotte brulee': ['Mirror Woman Brulee', 'Branch Brulee'],
  'charlotte pudding': ['Three-Eyed Pudding', 'Chocolatier Pudding'],
  'baron tamago': ['Viscount Hiyoko', 'Count Niwatori', 'Egg Baron'],
  'pekoms': ['Lion Pekoms', 'Turtle Pekoms'],

  // Whitebeard Pirates
  'portgas d. ace': ['Fire Fist Ace', 'Fire Fist', 'Gol D. Ace', 'Commander Ace'],
  'marco': ['Marco the Phoenix', 'Phoenix Marco', '1st Division Commander Marco', 'Pineapple Head'],
  'jozu': ['Diamond Jozu', '3rd Division Commander Jozu'],
  'vista': ['Flower Sword Vista', '5th Division Commander Vista'],
  'izo': ['16th Division Commander Izo', 'Retainer of Oden'],

  // Red Hair Pirates
  'benn beckman': ['Beckman', 'First Mate Beckman', 'Vice Captain Beckman'],
  'lucky roux': ['Lucky Roo', 'Roux'],
  'yasopp': ['Chaser Yasopp', 'Sniper Yasopp', 'Father of Usopp'],

  // Blackbeard Pirates
  'shiryu': ['Shiryu of the Rain', 'Invisible Shiryu', 'Former Head Jailer Shiryu'],
  'jesus burgess': ['Champion Burgess', 'Lucha Burgess'],
  'van augur': ['Supersonic Van Augur', 'The Supersonic'],
  'doc q': ['Death God Doc Q', 'Grim Reaper Doc Q'],
  'laffitte': ['Demon Sheriff Laffitte', 'Hypnotist Laffitte'],
  'avalo pizarro': ['Corrupt King Pizarro'],
  'catarina devon': ['Crescent Moon Hunter Devon'],
  'vasco shot': ['Heavy Drinker Vasco'],
  'sanjuan wolf': ['Colossal Battleship Wolf'],

  // Fish-Man Island & Sky Island
  'fisher tiger': ['Hero of the Slaves', 'Founder of Sun Pirates', 'Tiger'],
  'otohime': ['Queen Otohime', 'Mother of Mermaid Princess'],
  'shirahoshi': ['Ancient Weapon Poseidon', 'Mermaid Princess', 'Princess Shirahoshi'],
  'neptune': ['God of the Sea', 'King Neptune', 'Great Knight of the Sea'],
  'hody jones': ['Captain Hody Jones', 'New Fish-Man Leader'],
  'vander decken ix': ['Flying Dutchman Captain', 'Decken'],
  'enel': ['God Enel', 'Kami Enel', 'Thunder God Enel'],
  'wyper': ['Berserker Wyper', 'Descendant of Calgara'],
  'calgara': ['Great Warrior Calgara', 'Demon of Shandora'],
  'mont blanc noland': ['Noland the Liar', 'Botanist Noland', 'Great Explorer Noland'],
  'gan fall': ['Knight of the Sky', 'God Gan Fall'],

  // Dressrosa & Grand Fleet
  'bartolomeo': ['Barto the Cannibal', 'Cannibal Bartolomeo', 'Straw Hat Fanboy #1'],
  'cavendish': ['Pirate Prince', 'Hakuba', 'Cavendish of the White Horse', 'Prince Cavendish'],
  'sai': ['Don Sai', 'Happo Navy 13th Leader'],
  'baby 5': ['Maid Assassin Baby 5'],
  'leo': ['Tontatta Chief Leo', 'Warrior Leo'],
  'hajrudin': ['Giant Mercenary Hajrudin', 'New Giant Pirate Captain'],
  'ideo': ['Destruction Cannon Ideo', 'Double-Jointed Ideo'],
  'blue gilly': ['Jat Kun Do Blue Gilly'],
  'orlumbus': ['Massacre Ruler Orlumbus', 'Admiral Orlumbus'],
  'bellamy': ['Bellamy the Hyena', 'The Hyena', 'Spring Human'],
  'kyros': ['Thunder Soldier of Rage', 'Gladiator Kyros', 'One-Legged Soldier'],
  'rebecca': ['Undefeated Woman Rebecca', 'Phantom Princess'],
  'viola': ['Violet', 'Princess Viola'],
  'mansherry': ['Tontatta Princess Mansherry'],

  // Alabasta & Baroque Works
  'bentham': ['Mr. 2 Bon Kurei', 'Bon Clay', 'Mr. 2', 'Okama Bentham'],
  'galdino': ['Mr. 3', 'Wax Master Galdino', 'Loan Shark Galdino'],
  'daz bonez': ['Mr. 1', 'Blade Human', 'Daz Bones'],
  'pell': ['Pell the Falcon', 'Strongest Warrior of Alabasta'],
  'chaka': ['Chaka the Jackal'],
  'nefertari cobra': ['King Cobra', '12th King of Alabasta'],

  // East Blue & Early Villains
  'arlong': ['Saw-Tooth Arlong', 'Arlong the Saw', 'Captain Arlong'],
  'kuro': ['Captain Kuro', 'Klahadore', 'Kuro of a Hundred Plans'],
  'don krieg': ['Foul Play Krieg', 'Pirate Fleet Admiral Krieg'],
  'alvida': ['Iron Mace Alvida', 'Smooth Lady Alvida'],
  'morgan': ['Axe-Hand Morgan', 'Captain Morgan'],
  'zeff': ['Red Leg Zeff', 'Owner Zeff', 'Chef Zeff'],
  'hatchan': ['Hachi', 'Takoyaki Hachi', 'Six-Sword Hachi'],
  'gin': ['Man-Demon Gin', 'Commander Gin'],
  'pearl': ['Iron Wall Pearl', 'Fire Pearl'],
  'jango': ['Hypnotist Jango', 'Marine Seaman Jango'],
  'gaimon': ['Chest Man Gaimon', 'Island Guardian'],

  // Thriller Bark & Sabaody
  'perona': ['Ghost Princess', 'Hollow Perona'],
  'dr. hogback': ['Genius Surgeon Hogback'],
  'absalom': ['Absalom the Graveyard', 'Invisibility Human'],
  'duval': ['Iron Mask Duval', 'Handsome Duval'],
  'shakuyaku': ['Shakky', 'Former Empress Shakky'],
  'camie': ['Keimi', 'Mermaid Camie'],
  'pappag': ['Criminal Brand Designer Pappag'],

  // Germa 66 & Science
  'vinsmoke judge': ['Garuda', 'King of Germa', 'Top Scientist Judge'],
  'vinsmoke reiju': ['Poison Pink', 'Princess Reiju'],
  'vinsmoke ichiji': ['Sparking Red', 'Commander Ichiji'],
  'vinsmoke niji': ['Dengeki Blue', 'Electric Niji'],
  'vinsmoke yonji': ['Winch Green', 'Cyborg Yonji'],
  'caesar clown': ['Master Caesar', 'Gangster Gastino', 'CC', 'Gas Human'],
  'vegapunk': ['Dr. Vegapunk', "World's Greatest Genius", 'Stella'],

  // Movies & Special Characters
  'douglas bullet': ['Demon Heir', 'Monster Bullet', 'Former Roger Pirate Bullet'],
  'zephyr': ['Black Arm Zephyr', 'Z', 'Former Marine Admiral Zephyr'],
  'uta': ['World Diva', 'Daughter of Shanks', 'Singer of New Genesis'],
  'gild tesoro': ['Gold King', 'Monster of the New World', 'Casino King Tesoro'],
};

async function enrichAllAliases() {
  const supabase = createAdminClient();
  console.log('Fetching all characters from database...');

  // Fetch all characters
  let allCharacters: any[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, slug, japanese_name, romanized_name')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error || !data || data.length === 0) break;
    allCharacters = allCharacters.concat(data);
    if (data.length < pageSize) break;
    page++;
  }

  console.log(`Found ${allCharacters.length} characters in database.`);

  let updatedCount = 0;
  let totalAliasesInserted = 0;

  const chunkSize = 30;
  for (let i = 0; i < allCharacters.length; i += chunkSize) {
    const chunk = allCharacters.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (char) => {
        const charNameLower = char.name.toLowerCase().trim();
        const charSlugLower = (char.slug || '').toLowerCase().trim();

        // Determine aliases from dictionary
        let matchedAliases: string[] = [];

        // Direct match
        if (ALIAS_DICTIONARY[charNameLower]) {
          matchedAliases = matchedAliases.concat(ALIAS_DICTIONARY[charNameLower]);
        } else if (ALIAS_DICTIONARY[charSlugLower]) {
          matchedAliases = matchedAliases.concat(ALIAS_DICTIONARY[charSlugLower]);
        } else {
          // Check partial key matches
          for (const [key, aliases] of Object.entries(ALIAS_DICTIONARY)) {
            if (charNameLower.includes(key) || key.includes(charNameLower) || charSlugLower.includes(key)) {
              matchedAliases = matchedAliases.concat(aliases);
              break;
            }
          }
        }

        // Also include any existing romanized_name/aliases on the record
        if (char.romanized_name) {
          const parts = char.romanized_name.split(',').map((s: string) => s.trim()).filter(Boolean);
          for (const part of parts) {
            if (part.toLowerCase() !== charNameLower && !matchedAliases.map((a) => a.toLowerCase()).includes(part.toLowerCase())) {
              matchedAliases.push(part);
            }
          }
        }

        // If character name has standard title prefix, extract alias (e.g., "Captain Kuro" -> "Captain")
        const titleMatch = char.name.match(/^(Captain|Doctor|Dr\.|Vice Admiral|Admiral|Fleet Admiral|Shogun|Princess|Prince|King|Queen|Lord|Saint|Master|Boss)\s+(.+)/i);
        if (titleMatch) {
          const shortName = titleMatch[2];
          if (!matchedAliases.map((a) => a.toLowerCase()).includes(shortName.toLowerCase())) {
            matchedAliases.push(shortName);
          }
        }

        // Clean, trim, deduplicate
        const finalAliases = Array.from(
          new Set(
            matchedAliases
              .map((a) => a.trim())
              .filter((a) => a.length > 0 && a.toLowerCase() !== charNameLower && a !== char.japanese_name)
          )
        );

        if (finalAliases.length > 0) {
          const aliasString = finalAliases.join(', ');

          // 1. Update characters.romanized_name column
          await supabase
            .from('characters')
            .update({ romanized_name: aliasString, updated_at: new Date().toISOString() })
            .eq('id', char.id);

          // 2. Delete and insert to character_aliases table
          await supabase.from('character_aliases').delete().eq('character_id', char.id);

          const aliasRows = finalAliases.map((al) => ({
            character_id: char.id,
            alias: al,
            alias_type: 'alias',
          }));

          await supabase.from('character_aliases').insert(aliasRows);

          updatedCount++;
          totalAliasesInserted += finalAliases.length;
        }
      })
    );
    console.log(`Processed ${Math.min(i + chunkSize, allCharacters.length)}/${allCharacters.length} characters...`);
  }

  console.log(`\n🎉 Alias Enrichment Complete!`);
  console.log(`Updated ${updatedCount} characters with aliases.`);
  console.log(`Inserted ${totalAliasesInserted} total alias records in character_aliases table.`);
}

enrichAllAliases().catch(console.error);
