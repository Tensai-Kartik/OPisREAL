import { createAdminClient } from '../lib/supabase/admin';

async function testSearch(q: string) {
  const supabase = createAdminClient();
  const qLower = q.toLowerCase();

  const { data: chars } = await supabase
    .from('characters')
    .select('id, name, slug, japanese_name, alias, romanized_name, image_url, verification_status, bounty')
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,alias.ilike.%${q}%,romanized_name.ilike.%${q}%,japanese_name.ilike.%${q}%`)
    .order('verification_status', { ascending: false })
    .limit(15);

  const { data: aliases } = await supabase
    .from('character_aliases')
    .select('character_id, alias, characters!inner(id, name, slug, alias, romanized_name, image_url, is_active, verification_status, bounty)')
    .ilike('alias', `%${q}%`)
    .eq('characters.is_active', true)
    .limit(15);

  const map = new Map<string, any>();

  const calculateScore = (name: string, aliasStr: string | null, matchedAliasStr: string | null, isVerified: boolean, bounty?: number | null) => {
    let score = 0;
    const n = name.toLowerCase();
    if (n === qLower) score += 120;
    else if (n.startsWith(qLower)) score += 80;
    else if (n.includes(qLower)) score += 50;

    if (matchedAliasStr) {
      const ma = matchedAliasStr.toLowerCase();
      if (ma === qLower) score += 100;
      else if (ma.startsWith(qLower)) score += 75;
      else if (ma.includes(qLower)) score += 40;
    }

    if (aliasStr) {
      const a = aliasStr.toLowerCase();
      if (a.includes(qLower)) score += 30;
    }

    if (isVerified) score += 30;
    if (bounty && bounty > 500000000) score += 15;
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
      const score = calculateScore(c.name, aliasVal, matchedAlias, c.verification_status === 'verified', c.bounty);
      map.set(c.id, { id: c.id, name: c.name, score, matchedAlias });
    }
  }

  if (aliases) {
    for (const a of aliases) {
      const char = a.characters as any;
      if (!char) continue;
      const aliasVal = char.alias || char.romanized_name || a.alias || null;
      const score = calculateScore(char.name, aliasVal, a.alias, char.verification_status === 'verified', char.bounty);
      if (!map.has(char.id)) {
        map.set(char.id, { id: char.id, name: char.name, score, matchedAlias: a.alias });
      } else {
        const existing = map.get(char.id)!;
        existing.matchedAlias = existing.matchedAlias || a.alias;
        existing.score = Math.max(existing.score || 0, score);
      }
    }
  }

  const results = Array.from(map.values())
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 8);

  console.log(`Results for "${q}":`);
  results.forEach((r, idx) => console.log(`  ${idx + 1}. ${r.name} (score: ${r.score}, matchedAlias: "${r.matchedAlias}")`));
}

async function run() {
  await testSearch('be');
  console.log('---');
  await testSearch('bege');
}
run();
