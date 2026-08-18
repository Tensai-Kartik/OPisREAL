import { createAdminClient } from '../lib/supabase/admin';

async function testSearch(q: string) {
  const supabase = createAdminClient();
  const qLower = q.toLowerCase();

  const { data: chars } = await supabase
    .from('characters')
    .select('id, name, slug, japanese_name, alias, romanized_name, image_url, verification_status')
    .eq('is_active', true)
    .eq('verification_status', 'verified')
    .or(`name.ilike.%${q}%,alias.ilike.%${q}%,romanized_name.ilike.%${q}%,japanese_name.ilike.%${q}%`)
    .limit(15);

  const { data: aliases } = await supabase
    .from('character_aliases')
    .select('character_id, alias, characters!inner(id, name, slug, alias, romanized_name, image_url, is_active, verification_status)')
    .ilike('alias', `%${q}%`)
    .eq('characters.is_active', true)
    .eq('characters.verification_status', 'verified')
    .limit(15);

  const map = new Map<string, any>();

  const calculateScore = (name: string, aliasStr: string | null, matchedAliasStr: string | null, isVerified: boolean) => {
    let score = 0;
    const n = name.toLowerCase();
    if (n === qLower) score += 100;
    else if (n.startsWith(qLower)) score += 80;
    else if (n.includes(qLower)) score += 50;

    if (matchedAliasStr) {
      const ma = matchedAliasStr.toLowerCase();
      if (ma === qLower) score += 95;
      else if (ma.startsWith(qLower)) score += 75;
      else if (ma.includes(qLower)) score += 40;
    }

    if (aliasStr) {
      const a = aliasStr.toLowerCase();
      if (a.includes(qLower)) score += 30;
    }

    if (isVerified) score += 10;
    return score;
  };

  if (chars) {
    for (const c of chars) {
      const aliasVal = c.alias || c.romanized_name || null;
      let matchedAlias: string | null = null;

      if (aliasVal && aliasVal.toLowerCase().includes(qLower)) {
        const parts = aliasVal.split(/,\s*/);
        const found = parts.find((p: string) => p.toLowerCase().includes(qLower));
        if (found) matchedAlias = found;
      }

      const score = calculateScore(c.name, aliasVal, matchedAlias, c.verification_status === 'verified');
      map.set(c.id, {
        id: c.id,
        name: c.name,
        slug: c.slug,
        image_url: c.image_url,
        alias: aliasVal,
        matchedAlias,
        japanese_name: c.japanese_name,
        score,
      });
    }
  }

  if (aliases) {
    for (const a of aliases) {
      const char = a.characters as any;
      if (!char) continue;

      const aliasVal = char.alias || char.romanized_name || a.alias || null;
      const score = calculateScore(char.name, aliasVal, a.alias, char.verification_status === 'verified');

      if (!map.has(char.id)) {
        map.set(char.id, {
          id: char.id,
          name: char.name,
          slug: char.slug,
          image_url: char.image_url,
          alias: aliasVal,
          matchedAlias: a.alias,
          score,
        });
      } else {
        const existing = map.get(char.id)!;
        if (!existing.matchedAlias) {
          existing.matchedAlias = a.alias;
          existing.score = Math.max(existing.score || 0, score);
        }
      }
    }
  }

  const results = Array.from(map.values())
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  console.log(`\n=== QUERY: "${q}" ===`);
  results.forEach((r, i) => {
    console.log(` ${i + 1}. Real Name: "${r.name}" | Display Subtitle: "${r.matchedAlias ? `"${r.matchedAlias}"` : r.alias}" (Score: ${r.score})`);
  });
}

async function runAllTests() {
  await testSearch('zoro');
  await testSearch('roronoa');
  await testSearch('the pirate hunter');
  await testSearch('straw hat');
  await testSearch('black leg');
  await testSearch('sogeking');
  await testSearch('whitebeard');
  await testSearch('soul king');
  process.exit(0);
}

runAllTests().catch(console.error);
