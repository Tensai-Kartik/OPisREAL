import { RawCharacterRecord } from '@/types/source';

export async function fetchJikanCharacters(): Promise<RawCharacterRecord[]> {
  const endpoint = 'https://api.jikan.moe/v4/anime/21/characters';

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Jikan API status ${res.status}`);
    }

    const json = await res.json();
    const list = json?.data || [];

    if (!Array.isArray(list)) return [];

    return list.map((item: Record<string, unknown>) => {
      const char = (item.character as Record<string, unknown>) || {};
      const images = char.images as Record<string, Record<string, string>> | undefined;
      const img = images?.jpg?.image_url || images?.webp?.image_url;

      // Reverse "Luffy, Monkey D." -> "Monkey D. Luffy" if comma separated
      let formattedName = (char.name as string) || '';
      if (formattedName.includes(',')) {
        const parts = formattedName.split(',').map((p: string) => p.trim());
        if (parts.length === 2) {
          formattedName = `${parts[1]} ${parts[0]}`;
        }
      }

      return {
        source_id: 'jikan',
        source_character_id: String(char.mal_id || formattedName),
        name: formattedName,
        japanese_name: (char.name_kanji as string) || undefined,
        image_url: img || undefined,
        raw_payload: { role: item.role, favorites: item.favorites },
      };
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('Jikan API fetch failed:', errorMsg);
    return [];
  }
}
