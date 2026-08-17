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

    return data.map((item: Record<string, unknown>) => {
      let rawName = (item.name as string) || (item.french_name as string) || '';
      // Clean up common name formatting inconsistencies
      if (rawName.includes(',')) {
        const parts = rawName.split(',').map((p: string) => p.trim());
        if (parts.length === 2) {
          rawName = `${parts[1]} ${parts[0]}`;
        }
      }

      const crewObj = item.crew as { name?: string } | undefined;
      const crewName = crewObj?.name || (typeof item.crew === 'string' ? item.crew : undefined);
      const fruitObj = item.fruit as { name?: string; type?: string } | undefined;

      return {
        source_id: 'onepieceapi',
        source_character_id: String(item.id || rawName),
        name: rawName,
        japanese_name: item.japanese_name as string | undefined,
        romanized_name: item.romanized_name as string | undefined,
        bounty: item.bounty as number | undefined,
        age: item.age as number | undefined,
        height: (item.height as number) || (item.size as number) || undefined,
        status: item.status as string | undefined,
        origin: (item.origin as string) || (item.sea as string) || undefined,
        first_appearance: (item.first_appearance as string) || (item.debut as string) || undefined,
        devil_fruit_name: fruitObj?.name || (item.fruit_name as string) || undefined,
        devil_fruit_type: fruitObj?.type || (item.fruit_type as string) || undefined,
        occupations: item.job ? [String(item.job)] : [],
        affiliations: crewName ? [crewName] : [],
      };
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('OnePieceAPI fetch failed:', errorMsg);
    return [];
  }
}
