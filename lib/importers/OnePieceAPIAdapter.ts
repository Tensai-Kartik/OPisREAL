import { RawCharacterRecord } from '@/types/source';

export async function fetchOnePieceAPICharacters(): Promise<RawCharacterRecord[]> {
  const endpoint = 'https://api.api-onepiece.com/v2/characters/en';

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`One Piece REST API status ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => {
      let rawName = item.name || item.french_name || '';
      // Clean up common name formatting inconsistencies
      if (rawName.includes(',')) {
        const parts = rawName.split(',').map((p: string) => p.trim());
        if (parts.length === 2) {
          rawName = `${parts[1]} ${parts[0]}`;
        }
      }

      const crewName = item.crew?.name || (typeof item.crew === 'string' ? item.crew : undefined);

      return {
        source_id: 'onepieceapi',
        source_character_id: String(item.id || rawName),
        name: rawName,
        japanese_name: item.japanese_name,
        romanized_name: item.romanized_name,
        bounty: item.bounty,
        age: item.age,
        height: item.height || item.size,
        status: item.status,
        origin: item.origin || item.sea,
        first_appearance: item.first_appearance || item.debut,
        devil_fruit_name: item.fruit?.name || item.fruit_name,
        devil_fruit_type: item.fruit?.type || item.fruit_type,
        occupations: item.job ? [item.job] : [],
        affiliations: crewName ? [crewName] : [],
      };
    });
  } catch (err: any) {
    console.warn('OnePieceAPI fetch failed:', err.message);
    return [];
  }
}
