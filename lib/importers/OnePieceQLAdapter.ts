import { RawCharacterRecord } from '@/types/source';

export async function fetchOnePieceQLCharacters(): Promise<RawCharacterRecord[]> {
  const endpoint = 'https://onepieceql.com/api/graphql';
  const query = `
    query GetCharacters {
      characters {
        nodes {
          id
          name
          japaneseName
          romanizedName
          age
          birthday
          bounty
          size
          fruit {
            name
            type
          }
          avatar
        }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error(`OnePieceQL response status ${res.status}`);
    }

    const json = await res.json();
    const nodes = json?.data?.characters?.nodes || [];

    return nodes.map((node: any) => ({
      source_id: 'onepieceql',
      source_character_id: String(node.id || node.name),
      name: node.name,
      japanese_name: node.japaneseName,
      romanized_name: node.romanizedName,
      age: node.age,
      birthday: node.birthday,
      bounty: node.bounty,
      height: node.size,
      devil_fruit_name: node.fruit?.name,
      devil_fruit_type: node.fruit?.type,
      image_url: node.avatar,
    }));
  } catch (err: any) {
    console.warn('OnePieceQL fetch failed, using fallback dataset:', err.message);
    return [];
  }
}
