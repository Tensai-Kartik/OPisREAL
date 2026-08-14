import { createAdminClient } from '../lib/supabase/admin';

interface OnePieceAPIRecord {
  id: number;
  name: string;
  size?: string | null;
  age?: string | null;
  bounty?: string | null;
  crew?: {
    id: number;
    name: string;
    roman_name?: string | null;
  } | null;
  fruit?: {
    id: number;
    name: string;
    type: string;
    roman_name?: string | null;
  } | null;
  job?: string | null;
  status?: string | null;
}

// Known Canon Debuts map (Character Name / Keyword -> { chapter, arc })
const CANON_DEBUTS: Record<string, { chapter: string; arc: string; origin?: string; race?: string }> = {
  'monkey d. luffy': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'roronoa zoro': { chapter: 'Chapter 3', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'nami': { chapter: 'Chapter 8', arc: 'Orange Town', origin: 'East Blue', race: 'Human' },
  'usopp': { chapter: 'Chapter 23', arc: 'Syrup Village', origin: 'East Blue', race: 'Human' },
  'sanji': { chapter: 'Chapter 43', arc: 'Baratie', origin: 'North Blue', race: 'Human' },
  'tony tony chopper': { chapter: 'Chapter 134', arc: 'Drum Island', origin: 'Grand Line', race: 'Animal' },
  'nico robin': { chapter: 'Chapter 114', arc: 'Whiskey Peak', origin: 'West Blue', race: 'Human' },
  'franky': { chapter: 'Chapter 329', arc: 'Water 7', origin: 'South Blue', race: 'Cyborg' },
  'brook': { chapter: 'Chapter 442', arc: 'Thriller Bark', origin: 'West Blue', race: 'Human' },
  'jinbe': { chapter: 'Chapter 528', arc: 'Impel Down', origin: 'Fish-Man Island', race: 'Fish-Man' },
  'shanks': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'West Blue', race: 'Human' },
  'benn beckman': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'North Blue', race: 'Human' },
  'lucky roux': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'South Blue', race: 'Human' },
  'yasopp': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'makino': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'woop slap': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'higuma': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'gol d. roger': { chapter: 'Chapter 1', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'koby': { chapter: 'Chapter 2', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'alvida': { chapter: 'Chapter 2', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'helmeppo': { chapter: 'Chapter 3', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'morgan': { chapter: 'Chapter 4', arc: 'Romance Dawn', origin: 'East Blue', race: 'Human' },
  'buggy': { chapter: 'Chapter 9', arc: 'Orange Town', origin: 'Grand Line', race: 'Human' },
  'mohnji': { chapter: 'Chapter 9', arc: 'Orange Town', origin: 'East Blue', race: 'Human' },
  'cabaji': { chapter: 'Chapter 11', arc: 'Orange Town', origin: 'East Blue', race: 'Human' },
  'chouchou': { chapter: 'Chapter 12', arc: 'Orange Town', origin: 'East Blue', race: 'Animal' },
  'boodle': { chapter: 'Chapter 13', arc: 'Orange Town', origin: 'East Blue', race: 'Human' },
  'gaimon': { chapter: 'Chapter 22', arc: 'Island of Rare Animals', origin: 'East Blue', race: 'Human' },
  'kuro': { chapter: 'Chapter 23', arc: 'Syrup Village', origin: 'East Blue', race: 'Human' },
  'kaya': { chapter: 'Chapter 23', arc: 'Syrup Village', origin: 'East Blue', race: 'Human' },
  'jango': { chapter: 'Chapter 25', arc: 'Syrup Village', origin: 'East Blue', race: 'Human' },
  'sham': { chapter: 'Chapter 31', arc: 'Syrup Village', origin: 'East Blue', race: 'Human' },
  'buchi': { chapter: 'Chapter 31', arc: 'Syrup Village', origin: 'East Blue', race: 'Human' },
  'merry': { chapter: 'Chapter 41', arc: 'Syrup Village', origin: 'East Blue', race: 'Human' },
  'zeff': { chapter: 'Chapter 43', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'gin': { chapter: 'Chapter 44', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'don krieg': { chapter: 'Chapter 45', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'pearl': { chapter: 'Chapter 46', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'patty': { chapter: 'Chapter 43', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'carne': { chapter: 'Chapter 43', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'dracule mihawk': { chapter: 'Chapter 49', arc: 'Baratie', origin: 'Grand Line', race: 'Human' },
  'arlong': { chapter: 'Chapter 69', arc: 'Arlong Park', origin: 'Fish-Man Island', race: 'Fish-Man' },
  'hatchan': { chapter: 'Chapter 69', arc: 'Arlong Park', origin: 'Fish-Man Island', race: 'Fish-Man' },
  'chew': { chapter: 'Chapter 69', arc: 'Arlong Park', origin: 'Fish-Man Island', race: 'Fish-Man' },
  'kuroobi': { chapter: 'Chapter 69', arc: 'Arlong Park', origin: 'Fish-Man Island', race: 'Fish-Man' },
  'bellemere': { chapter: 'Chapter 77', arc: 'Arlong Park', origin: 'East Blue', race: 'Human' },
  'nojiko': { chapter: 'Chapter 70', arc: 'Arlong Park', origin: 'East Blue', race: 'Human' },
  'genzo': { chapter: 'Chapter 70', arc: 'Arlong Park', origin: 'East Blue', race: 'Human' },
  'johnny': { chapter: 'Chapter 42', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'yosaku': { chapter: 'Chapter 42', arc: 'Baratie', origin: 'East Blue', race: 'Human' },
  'smoker': { chapter: 'Chapter 97', arc: 'Loguetown', origin: 'Grand Line', race: 'Human' },
  'tashigi': { chapter: 'Chapter 96', arc: 'Loguetown', origin: 'East Blue', race: 'Human' },
  'monkey d. dragon': { chapter: 'Chapter 100', arc: 'Loguetown', origin: 'East Blue', race: 'Human' },
  'laboon': { chapter: 'Chapter 102', arc: 'Reverse Mountain', origin: 'West Blue', race: 'Animal' },
  'crocus': { chapter: 'Chapter 102', arc: 'Reverse Mountain', origin: 'Grand Line', race: 'Human' },
  'nefertari vivi': { chapter: 'Chapter 103', arc: 'Reverse Mountain', origin: 'Grand Line', race: 'Human' },
  'mr. 9': { chapter: 'Chapter 103', arc: 'Reverse Mountain', origin: 'Grand Line', race: 'Human' },
  'igaram': { chapter: 'Chapter 106', arc: 'Whiskey Peak', origin: 'Grand Line', race: 'Human' },
  'miss monday': { chapter: 'Chapter 106', arc: 'Whiskey Peak', origin: 'Grand Line', race: 'Human' },
  'mr. 5': { chapter: 'Chapter 110', arc: 'Whiskey Peak', origin: 'South Blue', race: 'Human' },
  'miss valentine': { chapter: 'Chapter 110', arc: 'Whiskey Peak', origin: 'West Blue', race: 'Human' },
  'dorry': { chapter: 'Chapter 116', arc: 'Little Garden', origin: 'Grand Line', race: 'Giant' },
  'brogy': { chapter: 'Chapter 116', arc: 'Little Garden', origin: 'Grand Line', race: 'Giant' },
  'mr. 3': { chapter: 'Chapter 117', arc: 'Little Garden', origin: 'South Blue', race: 'Human' },
  'galdino': { chapter: 'Chapter 117', arc: 'Little Garden', origin: 'South Blue', race: 'Human' },
  'miss goldenweek': { chapter: 'Chapter 117', arc: 'Little Garden', origin: 'North Blue', race: 'Human' },
  'crocodile': { chapter: 'Chapter 126', arc: 'Little Garden', origin: 'Grand Line', race: 'Human' },
  'wapol': { chapter: 'Chapter 131', arc: 'Drum Island', origin: 'Grand Line', race: 'Human' },
  'dalton': { chapter: 'Chapter 132', arc: 'Drum Island', origin: 'Grand Line', race: 'Human' },
  'kureha': { chapter: 'Chapter 134', arc: 'Drum Island', origin: 'Grand Line', race: 'Human' },
  'hiriluk': { chapter: 'Chapter 141', arc: 'Drum Island', origin: 'Grand Line', race: 'Human' },
  'portgas d. ace': { chapter: 'Chapter 154', arc: 'Drum Island', origin: 'South Blue', race: 'Human' },
  'nefertari cobra': { chapter: 'Chapter 155', arc: 'Alabasta', origin: 'Grand Line', race: 'Human' },
  'pell': { chapter: 'Chapter 155', arc: 'Alabasta', origin: 'Grand Line', race: 'Human' },
  'chaka': { chapter: 'Chapter 155', arc: 'Alabasta', origin: 'Grand Line', race: 'Human' },
  'kohza': { chapter: 'Chapter 163', arc: 'Alabasta', origin: 'Grand Line', race: 'Human' },
  'daz bonez': { chapter: 'Chapter 155', arc: 'Alabasta', origin: 'West Blue', race: 'Human' },
  'bentham': { chapter: 'Chapter 129', arc: 'Little Garden', origin: 'South Blue', race: 'Human' },
  'mr. 2 bon clay': { chapter: 'Chapter 129', arc: 'Little Garden', origin: 'South Blue', race: 'Human' },
  'miss doublefinger': { chapter: 'Chapter 155', arc: 'Alabasta', origin: 'Grand Line', race: 'Human' },
  'mr. 4': { chapter: 'Chapter 160', arc: 'Alabasta', origin: 'Grand Line', race: 'Human' },
  'miss merry christmas': { chapter: 'Chapter 160', arc: 'Alabasta', origin: 'Grand Line', race: 'Human' },
  'bellamy': { chapter: 'Chapter 222', arc: 'Jaya', origin: 'North Blue', race: 'Human' },
  'sarquiss': { chapter: 'Chapter 222', arc: 'Jaya', origin: 'North Blue', race: 'Human' },
  'marshall d. teach': { chapter: 'Chapter 223', arc: 'Jaya', origin: 'Grand Line', race: 'Human' },
  'jesus burgess': { chapter: 'Chapter 222', arc: 'Jaya', origin: 'Grand Line', race: 'Human' },
  'van augur': { chapter: 'Chapter 222', arc: 'Jaya', origin: 'East Blue', race: 'Human' },
  'doc q': { chapter: 'Chapter 223', arc: 'Jaya', origin: 'North Blue', race: 'Human' },
  'laffitte': { chapter: 'Chapter 234', arc: 'Jaya', origin: 'West Blue', race: 'Human' },
  'mont blanc cricket': { chapter: 'Chapter 227', arc: 'Jaya', origin: 'North Blue', race: 'Human' },
  'masira': { chapter: 'Chapter 219', arc: 'Jaya', origin: 'North Blue', race: 'Human' },
  'shoujou': { chapter: 'Chapter 226', arc: 'Jaya', origin: 'South Blue', race: 'Human' },
  'edward newgate': { chapter: 'Chapter 234', arc: 'Jaya', origin: 'Grand Line', race: 'Human' },
  'marco': { chapter: 'Chapter 234', arc: 'Jaya', origin: 'Grand Line', race: 'Human' },
  'jozu': { chapter: 'Chapter 234', arc: 'Jaya', origin: 'West Blue', race: 'Human' },
  'sengoku': { chapter: 'Chapter 234', arc: 'Jaya', origin: 'South Blue', race: 'Human' },
  'donquixote doflamingo': { chapter: 'Chapter 234', arc: 'Jaya', origin: 'North Blue', race: 'Human' },
  'bartholomew kuma': { chapter: 'Chapter 233', arc: 'Jaya', origin: 'South Blue', race: 'Buccaneer' },
  'enel': { chapter: 'Chapter 254', arc: 'Skypiea', origin: 'Sky Island', race: 'Birkan' },
  'gan fall': { chapter: 'Chapter 238', arc: 'Skypiea', origin: 'Sky Island', race: 'Skypiean' },
  'conis': { chapter: 'Chapter 239', arc: 'Skypiea', origin: 'Sky Island', race: 'Skypiean' },
  'wyper': { chapter: 'Chapter 237', arc: 'Skypiea', origin: 'Sky Island', race: 'Shandia' },
  'mont blanc noland': { chapter: 'Chapter 286', arc: 'Skypiea', origin: 'North Blue', race: 'Human' },
  'kalgara': { chapter: 'Chapter 286', arc: 'Skypiea', origin: 'Sky Island', race: 'Shandia' },
  'foxy': { chapter: 'Chapter 305', arc: 'Long Ring Long Land', origin: 'South Blue', race: 'Human' },
  'kuzan': { chapter: 'Chapter 319', arc: 'Long Ring Long Land', origin: 'South Blue', race: 'Human' },
  'iceburg': { chapter: 'Chapter 323', arc: 'Water 7', origin: 'Grand Line', race: 'Human' },
  'paulie': { chapter: 'Chapter 323', arc: 'Water 7', origin: 'Grand Line', race: 'Human' },
  'rob lucci': { chapter: 'Chapter 323', arc: 'Water 7', origin: 'Grand Line', race: 'Human' },
  'kaku': { chapter: 'Chapter 323', arc: 'Water 7', origin: 'East Blue', race: 'Human' },
  'kalifa': { chapter: 'Chapter 323', arc: 'Water 7', origin: 'Grand Line', race: 'Human' },
  'blueno': { chapter: 'Chapter 325', arc: 'Water 7', origin: 'Grand Line', race: 'Human' },
  'spandam': { chapter: 'Chapter 355', arc: 'Water 7', origin: 'Grand Line', race: 'Human' },
  'jabra': { chapter: 'Chapter 375', arc: 'Enies Lobby', origin: 'North Blue', race: 'Human' },
  'monkey d. garp': { chapter: 'Chapter 431', arc: 'Post-Enies Lobby', origin: 'East Blue', race: 'Human' },
  'gecko moria': { chapter: 'Chapter 449', arc: 'Thriller Bark', origin: 'West Blue', race: 'Human' },
  'perona': { chapter: 'Chapter 443', arc: 'Thriller Bark', origin: 'West Blue', race: 'Human' },
  'absalom': { chapter: 'Chapter 444', arc: 'Thriller Bark', origin: 'West Blue', race: 'Human' },
  'hogback': { chapter: 'Chapter 446', arc: 'Thriller Bark', origin: 'West Blue', race: 'Human' },
  'ryuma': { chapter: 'Chapter 450', arc: 'Thriller Bark', origin: 'Wano Country', race: 'Human' },
  'oars': { chapter: 'Chapter 456', arc: 'Thriller Bark', origin: 'North Blue', race: 'Giant' },
  'eustass kid': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'South Blue', race: 'Human' },
  'killer': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'South Blue', race: 'Human' },
  'trafalgar d. water law': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'North Blue', race: 'Human' },
  'jewelry bonney': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'South Blue', race: 'Human' },
  'capone bege': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'West Blue', race: 'Human' },
  'basil hawkins': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'North Blue', race: 'Human' },
  'scratchmen apoo': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'Grand Line', race: 'Longarm' },
  'x drake': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'North Blue', race: 'Human' },
  'urouge': { chapter: 'Chapter 498', arc: 'Sabaody Archipelago', origin: 'Sky Island', race: 'Birkan' },
  'silvers rayleigh': { chapter: 'Chapter 500', arc: 'Sabaody Archipelago', origin: 'Grand Line', race: 'Human' },
  'borsalino': { chapter: 'Chapter 504', arc: 'Sabaody Archipelago', origin: 'North Blue', race: 'Human' },
  'boa hancock': { chapter: 'Chapter 516', arc: 'Amazon Lily', origin: 'Calm Belt', race: 'Human' },
  'magellan': { chapter: 'Chapter 528', arc: 'Impel Down', origin: 'Grand Line', race: 'Human' },
  'hannyabal': { chapter: 'Chapter 526', arc: 'Impel Down', origin: 'South Blue', race: 'Human' },
  'emporio ivankov': { chapter: 'Chapter 537', arc: 'Impel Down', origin: 'Grand Line', race: 'Human' },
  'shiryu': { chapter: 'Chapter 542', arc: 'Impel Down', origin: 'Grand Line', race: 'Human' },
  'sakazuki': { chapter: 'Chapter 397', arc: 'Enies Lobby', origin: 'North Blue', race: 'Human' },
  'sabo': { chapter: 'Chapter 583', arc: 'Post-War', origin: 'East Blue', race: 'Human' },
  'hody jones': { chapter: 'Chapter 607', arc: 'Fish-Man Island', origin: 'Fish-Man Island', race: 'Fish-Man' },
  'shirahoshi': { chapter: 'Chapter 612', arc: 'Fish-Man Island', origin: 'Fish-Man Island', race: 'Merfolk' },
  'fisher tiger': { chapter: 'Chapter 620', arc: 'Fish-Man Island', origin: 'Fish-Man Island', race: 'Fish-Man' },
  'charlotte linlin': { chapter: 'Chapter 651', arc: 'Fish-Man Island', origin: 'Grand Line', race: 'Human' },
  'caesar clown': { chapter: 'Chapter 658', arc: 'Punk Hazard', origin: 'Grand Line', race: 'Human' },
  'kin\'emon': { chapter: 'Chapter 656', arc: 'Punk Hazard', origin: 'Wano Country', race: 'Human' },
  'momonosuke': { chapter: 'Chapter 684', arc: 'Punk Hazard', origin: 'Wano Country', race: 'Human' },
  'issho': { chapter: 'Chapter 701', arc: 'Dressrosa', origin: 'Grand Line', race: 'Human' },
  'kaido': { chapter: 'Chapter 795', arc: 'Dressrosa', origin: 'Grand Line', race: 'Oni' },
  'jack': { chapter: 'Chapter 801', arc: 'Zou', origin: 'Grand Line', race: 'Fish-Man' },
  'carrot': { chapter: 'Chapter 804', arc: 'Zou', origin: 'Zou', race: 'Mink' },
  'pedro': { chapter: 'Chapter 805', arc: 'Zou', origin: 'Zou', race: 'Mink' },
  'inuarashi': { chapter: 'Chapter 808', arc: 'Zou', origin: 'Zou', race: 'Mink' },
  'nekomamushi': { chapter: 'Chapter 809', arc: 'Zou', origin: 'Zou', race: 'Mink' },
  'charlotte katakuri': { chapter: 'Chapter 860', arc: 'Whole Cake Island', origin: 'Grand Line', race: 'Human' },
  'king': { chapter: 'Chapter 925', arc: 'Wano Country', origin: 'Grand Line', race: 'Lunarian' },
  'queen': { chapter: 'Chapter 925', arc: 'Wano Country', origin: 'Grand Line', race: 'Cyborg' },
  'yamato': { chapter: 'Chapter 983', arc: 'Wano Country', origin: 'Grand Line', race: 'Oni' },
  'kozuki oden': { chapter: 'Chapter 818', arc: 'Zou', origin: 'Wano Country', race: 'Human' },
  'vegapunk': { chapter: 'Chapter 1061', arc: 'Egghead', origin: 'Grand Line', race: 'Human' },
};

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseFrenchAge(ageStr?: string | null): number | null {
  if (!ageStr) return null;
  const match = ageStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function parseHeight(sizeStr?: string | null): number | null {
  if (!sizeStr) return null;
  const cmMatch = sizeStr.match(/(\d+)\s*cm/i);
  if (cmMatch) return parseInt(cmMatch[1], 10);
  const mMatch = sizeStr.match(/(\d+(?:\.\d+)?)\s*m/i);
  if (mMatch) return Math.round(parseFloat(mMatch[1]) * 100);
  const digits = sizeStr.match(/(\d+)/);
  return digits ? parseInt(digits[1], 10) : null;
}

function parseBounty(bountyStr?: string | null): number | null {
  if (!bountyStr) return null;
  const clean = bountyStr.replace(/[^0-9]/g, '');
  if (!clean) return null;
  const val = parseInt(clean, 10);
  return val > 0 ? val : null;
}

async function runFastEnrichment() {
  const supabase = createAdminClient();
  console.log('Fetching OnePieceAPI records for global enrichment...');

  let apiChars: OnePieceAPIRecord[] = [];
  try {
    const res = await fetch('https://api.api-onepiece.com/v2/characters/en');
    if (res.ok) {
      apiChars = await res.json();
      console.log(`Loaded ${apiChars.length} characters from OnePieceAPI.`);
    }
  } catch (err: any) {
    console.warn('Could not fetch from OnePieceAPI:', err.message);
  }

  // Create API lookup map
  const apiMap = new Map<string, OnePieceAPIRecord>();
  for (const item of apiChars) {
    if (item.name) {
      apiMap.set(normalizeName(item.name), item);
    }
  }

  // Fetch all characters in DB
  const { data: dbChars, error: dbErr } = await supabase
    .from('characters')
    .select('id, name, slug, age, height, bounty, origin, first_appearance, first_arc, devil_fruit_name, devil_fruit_type, race, gender, status, image_url');

  if (dbErr || !dbChars) {
    console.error('Failed to fetch db characters:', dbErr);
    process.exit(1);
  }

  console.log(`Analyzing ${dbChars.length} characters in Supabase...`);

  const updates: Array<{ id: string; payload: any }> = [];

  for (const char of dbChars) {
    const norm = normalizeName(char.name);
    const apiMatch = apiMap.get(norm);
    const canonDebut = CANON_DEBUTS[char.name.toLowerCase()] || CANON_DEBUTS[char.slug];

    let updatedAge = char.age;
    let updatedHeight = char.height;
    let updatedBounty = char.bounty;
    let updatedOrigin = char.origin;
    let updatedFirstAppearance = char.first_appearance;
    let updatedFirstArc = char.first_arc;
    let updatedFruitName = char.devil_fruit_name;
    let updatedFruitType = char.devil_fruit_type;
    let updatedRace = char.race;

    // Fill from Canon Debuts
    if (canonDebut) {
      if (!updatedFirstAppearance) updatedFirstAppearance = canonDebut.chapter;
      if (!updatedFirstArc) updatedFirstArc = canonDebut.arc;
      if (!updatedOrigin || updatedOrigin === 'Unknown') updatedOrigin = canonDebut.origin || updatedOrigin;
      if (!updatedRace || updatedRace === 'Unknown') updatedRace = canonDebut.race || updatedRace;
    }

    // Fill from OnePieceAPI match
    if (apiMatch) {
      if (!updatedAge && apiMatch.age) {
        updatedAge = parseFrenchAge(apiMatch.age);
      }
      if (!updatedHeight && apiMatch.size) {
        updatedHeight = parseHeight(apiMatch.size);
      }
      if ((updatedBounty === null || updatedBounty === undefined) && apiMatch.bounty) {
        updatedBounty = parseBounty(apiMatch.bounty);
      }
      if ((!updatedFruitName || updatedFruitName === 'None') && apiMatch.fruit) {
        updatedFruitName = apiMatch.fruit.roman_name || apiMatch.fruit.name;
        let fType = apiMatch.fruit.type || 'Unknown';
        if (fType.includes('Zoan Mythique') || fType.includes('Mythical')) fType = 'Mythical Zoan';
        else if (fType.includes('Zoan Antique') || fType.includes('Ancient')) fType = 'Ancient Zoan';
        else if (fType.includes('Zoan')) fType = 'Zoan';
        else if (fType.includes('Logia')) fType = 'Logia';
        else if (fType.includes('Paramecia')) fType = 'Paramecia';
        updatedFruitType = fType;
      }
    }

    // Default origin to Grand Line if blank
    if (!updatedOrigin || updatedOrigin.trim() === '') {
      updatedOrigin = 'Grand Line';
    }

    const hasChanged =
      updatedAge !== char.age ||
      updatedHeight !== char.height ||
      updatedBounty !== char.bounty ||
      updatedOrigin !== char.origin ||
      updatedFirstAppearance !== char.first_appearance ||
      updatedFirstArc !== char.first_arc ||
      updatedFruitName !== char.devil_fruit_name ||
      updatedFruitType !== char.devil_fruit_type ||
      updatedRace !== char.race;

    if (hasChanged) {
      updates.push({
        id: char.id,
        payload: {
          age: updatedAge,
          height: updatedHeight,
          bounty: updatedBounty,
          origin: updatedOrigin,
          first_appearance: updatedFirstAppearance,
          first_arc: updatedFirstArc,
          devil_fruit_name: updatedFruitName,
          devil_fruit_type: updatedFruitType,
          race: updatedRace,
          updated_at: new Date().toISOString(),
        },
      });
    }
  }

  console.log(`Found ${updates.length} characters needing update. Executing parallel batch updates...`);

  // Batch update in chunks of 25 concurrently
  const chunkSize = 25;
  let successCount = 0;

  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (u) => {
        const { error } = await supabase.from('characters').update(u.payload).eq('id', u.id);
        if (!error) successCount++;
        else console.error(`Error updating ${u.id}:`, error.message);
      })
    );
    process.stdout.write(`Updated ${Math.min(i + chunkSize, updates.length)} / ${updates.length}...\r`);
  }

  console.log(`\n\n=== ENRICHMENT SUMMARY ===`);
  console.log(`Total characters updated successfully: ${successCount}`);
  process.exit(0);
}

runFastEnrichment().catch(console.error);
