import { DevilFruitType, GenderType, HakiType, RaceType, StatusType } from '@/types/character';
import { RawCharacterRecord } from '@/types/source';

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function parseBounty(raw: number | string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return isNaN(raw) || raw < 0 ? null : raw;

  const str = String(raw).trim();
  if (!str || str.toLowerCase().includes('unknown') || str.toLowerCase().includes('none') || str === '0') return null;

  // Handle format like "3.0B" or "1.5 Billion"
  if (/([\d.]+)\s*B(?:illion)?/i.test(str)) {
    const match = str.match(/([\d.]+)\s*B(?:illion)?/i);
    if (match) return Math.round(parseFloat(match[1]) * 1000000000);
  }
  if (/([\d.]+)\s*M(?:illion)?/i.test(str)) {
    const match = str.match(/([\d.]+)\s*M(?:illion)?/i);
    if (match) return Math.round(parseFloat(match[1]) * 1000000);
  }

  // Remove dots used as thousand separators, spaces, symbols
  // e.g. "3.000.000.000" -> "3000000000"
  const cleanStr = str.replace(/[^\d]/g, '');
  if (!cleanStr) return null;

  const parsed = parseInt(cleanStr, 10);
  return isNaN(parsed) || parsed < 0 ? null : parsed;
}

export function parseHeightCm(raw: number | string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return isNaN(raw) || raw <= 0 ? null : Math.round(raw);

  const str = String(raw).trim();
  if (!str || str.toLowerCase().includes('unknown')) return null;

  // Handle meters e.g., "1.91m", "1.91 m", "1.91 meters"
  if (/([\d.]+)\s*m/i.test(str) && !str.toLowerCase().includes('cm')) {
    const match = str.match(/([\d.]+)\s*m/i);
    if (match) {
      const meters = parseFloat(match[1]);
      if (!isNaN(meters) && meters > 0) return Math.round(meters * 100);
    }
  }

  // Handle cm e.g., "191cm", "191 cm"
  const cleanStr = str.replace(/[^\d.]/g, '');
  if (!cleanStr) return null;

  const parsed = parseFloat(cleanStr);
  if (isNaN(parsed) || parsed <= 0) return null;

  // If number is small (< 15), assume meters
  if (parsed < 15) return Math.round(parsed * 100);

  return Math.round(parsed);
}

export function parseAge(raw: number | string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return isNaN(raw) || raw < 0 ? null : raw;

  const str = String(raw).trim();
  if (!str || str.toLowerCase().includes('unknown')) return null;

  // If format is like "19 (pre), 21 (post)" or "19 ans" take 21 or 19
  const numbers = str.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;

  const lastNum = parseInt(numbers[numbers.length - 1], 10);
  return isNaN(lastNum) || lastNum < 0 || lastNum > 2000 ? null : lastNum;
}

export function normalizeGender(raw?: string): GenderType {
  if (!raw) return 'Unknown';
  const str = raw.toLowerCase().trim();
  if (str.includes('male') || str === 'homme' || str === 'man') return 'Male';
  if (str.includes('female') || str === 'femme' || str === 'woman') return 'Female';
  return 'Unknown';
}

export function normalizeRace(raw?: string): RaceType {
  if (!raw) return 'Unknown';
  const str = raw.toLowerCase().trim();
  if (str.includes('human') || str.includes('homme')) return 'Human';
  if (str.includes('fish') || str.includes('gyojin') || str.includes('homme-poisson')) return 'Fish-Man';
  if (str.includes('merfolk') || str.includes('mermaid') || str.includes('merman') || str.includes('sirène')) return 'Merfolk';
  if (str.includes('mink')) return 'Mink';
  if (str.includes('ancient giant')) return 'Ancient Giant';
  if (str.includes('giant') || str.includes('géant')) return 'Giant';
  if (str.includes('lunarian')) return 'Lunarian';
  if (str.includes('cyborg')) return 'Cyborg';
  if (str.includes('sky') || str.includes('skypiea') || str.includes('birkan') || str.includes('shandian')) return 'Sky Island';
  return 'Human';
}

export function normalizeStatus(raw?: string): StatusType {
  if (!raw) return 'Unknown';
  const str = raw.toLowerCase().trim();
  if (str.includes('alive') || str.includes('vivant') || str.includes('active') || str.includes('living')) return 'Alive';
  if (str.includes('dead') || str.includes('décédé') || str.includes('decede') || str.includes('deceased') || str.includes('killed') || str.includes('morte') || str.includes('died') || str.includes('mort')) return 'Dead';
  return 'Unknown';
}

export function normalizeDevilFruitType(raw?: string, name?: string): DevilFruitType {
  const combined = `${raw || ''} ${name || ''}`.toLowerCase();
  if (combined.includes('mythical zoan') || combined.includes('zoan mythique')) return 'Mythical Zoan';
  if (combined.includes('ancient zoan') || combined.includes('zoan antique')) return 'Ancient Zoan';
  if (combined.includes('zoan')) return 'Zoan';
  if (combined.includes('logia')) return 'Logia';
  if (combined.includes('paramecia')) return 'Paramecia';
  if (combined.includes('none') || combined.includes('aucun') || combined.includes('no fruit') || combined.includes('n/a')) return 'None';
  if (name && name.length > 0 && name.toLowerCase() !== 'none') return 'Paramecia';
  return 'None';
}

export function normalizeHakiList(rawList?: string[]): { hakiType: HakiType; custom?: string }[] {
  if (!rawList || rawList.length === 0) return [];
  const results: { hakiType: HakiType; custom?: string }[] = [];
  const added = new Set<string>();

  for (const item of rawList) {
    const lower = item.toLowerCase();
    if (lower.includes('observation') || lower.includes('kenbunshoku')) {
      if (!added.has('Observation')) {
        results.push({ hakiType: 'Observation' });
        added.add('Observation');
      }
    }
    if (lower.includes('armament') || lower.includes('busoshoku')) {
      if (!added.has('Armament')) {
        results.push({ hakiType: 'Armament' });
        added.add('Armament');
      }
    }
    if (lower.includes('conqueror') || lower.includes('haoshoku')) {
      if (!added.has('Conqueror')) {
        results.push({ hakiType: 'Conqueror' });
        added.add('Conqueror');
      }
    }
  }

  return results;
}

export interface NormalizedCharacterData {
  name: string;
  slug: string;
  japanese_name: string | null;
  alias: string | null;
  romanized_name: string | null;
  gender: GenderType;
  race: RaceType;
  status: StatusType;
  age: number | null;
  height: number | null;
  bounty: number | null;
  birthday: string | null;
  blood_type: string | null;
  origin: string;
  first_appearance: string | null;
  first_arc: string | null;
  devil_fruit_name: string | null;
  devil_fruit_type: DevilFruitType;
  devil_fruit_model: string | null;
  description: string | null;
  image_url: string | null;
  aliases: string[];
  affiliations: string[];
  occupations: string[];
  haki: { hakiType: HakiType; custom?: string }[];
}

export function normalizeRawCharacter(raw: RawCharacterRecord): NormalizedCharacterData {
  const name = raw.name.trim();
  const slug = createSlug(name);
  const bounty = parseBounty(raw.bounty);
  const height = parseHeightCm(raw.height);
  const age = parseAge(raw.age);
  const gender = normalizeGender(raw.gender);
  const race = normalizeRace(raw.race);
  const status = normalizeStatus(raw.status);
  const fruitType = normalizeDevilFruitType(raw.devil_fruit_type, raw.devil_fruit_name);
  const haki = normalizeHakiList(raw.haki_types);

  const cleanAliases = (raw.aliases || []).map((a) => a.trim()).filter((a) => a.length > 0);
  const cleanAffiliations = (raw.affiliations || []).map((a) => a.trim()).filter((a) => a.length > 0);
  const cleanOccupations = (raw.occupations || []).map((o) => o.trim()).filter((o) => o.length > 0);

  const aliasString = cleanAliases.join(', ') || raw.romanized_name?.trim() || null;

  return {
    name,
    slug,
    japanese_name: raw.japanese_name?.trim() || null,
    alias: aliasString,
    romanized_name: raw.romanized_name?.trim() || aliasString,
    gender,
    race,
    status,
    age,
    height,
    bounty,
    birthday: raw.birthday?.trim() || null,
    blood_type: raw.blood_type?.trim() || null,
    origin: raw.origin?.trim() || 'Grand Line',
    first_appearance: raw.first_appearance?.trim() || null,
    first_arc: raw.first_arc?.trim() || null,
    devil_fruit_name: raw.devil_fruit_name?.trim() || null,
    devil_fruit_type: fruitType,
    devil_fruit_model: raw.devil_fruit_model?.trim() || null,
    description: raw.description?.trim() || null,
    image_url: raw.image_url?.trim() || null,
    aliases: Array.from(new Set(cleanAliases)),
    affiliations: Array.from(new Set(cleanAffiliations)),
    occupations: Array.from(new Set(cleanOccupations)),
    haki,
  };
}
