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

    return nodes.map((node: Record<string, unknown>) => {
      const fruit = node.fruit as { name?: string; type?: string } | undefined;
      return {
        source_id: 'onepieceql',
        source_character_id: String(node.id || node.name),
        name: (node.name as string) || '',
        japanese_name: node.japaneseName as string | undefined,
        romanized_name: node.romanizedName as string | undefined,
        age: node.age as number | undefined,
        birthday: node.birthday as string | undefined,
        bounty: node.bounty as number | undefined,
        height: node.size as number | undefined,
        devil_fruit_name: fruit?.name,
        devil_fruit_type: fruit?.type,
        image_url: node.avatar as string | undefined,
      };
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('OnePieceQL fetch failed, using fallback dataset:', errorMsg);
    return [];
  }
}
