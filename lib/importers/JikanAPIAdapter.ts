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

    return list.map((item: any) => {
      const char = item.character || {};
      const img = char.images?.jpg?.image_url || char.images?.webp?.image_url;

      // Reverse "Luffy, Monkey D." -> "Monkey D. Luffy" if comma separated
      let formattedName = char.name || '';
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
        japanese_name: char.name_kanji || undefined,
        image_url: img || undefined,
        raw_payload: { role: item.role, favorites: item.favorites },
      };
    });
  } catch (err: any) {
    console.warn('Jikan API fetch failed:', err.message);
    return [];
  }
}
