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
    .limit(20);

  const { data: aliases } = await supabase
    .from('character_aliases')
    .select('character_id, alias, characters!inner(id, name, slug, alias, romanized_name, image_url, is_active, verification_status, bounty)')
    .ilike('alias', `%${q}%`)
    .eq('characters.is_active', true)
    .limit(20);

  const map = new Map<string, any>();

  const calculateScore = (name: string, aliasStr: string | null, matchedAliasStr: string | null, isVerified: boolean, bounty?: number | null) => {
    let score = 0;
    const n = name.toLowerCase();
    const nameWords = n.split(/[\s,.-]+/);

    if (n === qLower) score += 1000;
    else if (n.startsWith(qLower)) score += 600;
    else if (nameWords.some(w => w === qLower)) score += 550;
    else if (nameWords.some(w => w.startsWith(qLower))) score += 450;
    else if (n.includes(qLower)) score += 100;

    if (matchedAliasStr) {
      const ma = matchedAliasStr.toLowerCase();
      const aliasWords = ma.split(/[\s,.-]+/);
      if (ma === qLower) score += 500;
      else if (ma.startsWith(qLower)) score += 400;
      else if (aliasWords.some(w => w === qLower)) score += 380;
      else if (aliasWords.some(w => w.startsWith(qLower))) score += 320;
      else if (ma.includes(qLower)) score += 80;
    }

    if (aliasStr) {
      const a = aliasStr.toLowerCase();
      const parts = a.split(/,\s*/);
      for (const p of parts) {
        const words = p.split(/[\s,.-]+/);
        if (p === qLower) score += 400;
        else if (p.startsWith(qLower)) score += 300;
        else if (words.some(w => w === qLower)) score += 280;
        else if (words.some(w => w.startsWith(qLower))) score += 240;
      }
    }

    if (isVerified) score += 15;
    if (bounty && bounty > 1000000000) score += 5;
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
      map.set(c.id, { id: c.id, name: c.name, score, matchedAlias, alias: aliasVal });
    }
  }

  if (aliases) {
    for (const a of aliases) {
      const char = a.characters as any;
      if (!char) continue;
      const aliasVal = char.alias || char.romanized_name || a.alias || null;
      const score = calculateScore(char.name, aliasVal, a.alias, char.verification_status === 'verified', char.bounty);
      if (!map.has(char.id)) {
        map.set(char.id, { id: char.id, name: char.name, score, matchedAlias: a.alias, alias: aliasVal });
      } else {
        const existing = map.get(char.id)!;
        existing.matchedAlias = existing.matchedAlias || a.alias;
        existing.score = Math.max(existing.score || 0, score);
      }
    }
  }

  const results = Array.from(map.values())
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  console.log(`\nResults for query: "${q}"`);
  results.forEach((r, idx) => console.log(`  ${idx + 1}. ${r.name} (score: ${r.score}) - matchedAlias: "${r.matchedAlias || ''}"`));
}

async function runAll() {
  await testSearch('bege');
  await testSearch('capone');
  await testSearch('gang bege');
  await testSearch('benn');
  await testSearch('beckman');
  await testSearch('zoro');
  await testSearch('pirate hunter');
  await testSearch('whitebeard');
  await testSearch('edward');
}

runAll();
