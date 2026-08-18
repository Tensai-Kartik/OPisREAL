import { createAdminClient } from '../lib/supabase/admin';

// Helper to clean wikitext formatting
function cleanWikiText(val: string): string {
  if (!val) return '';
  return val
    .replace(/\{\{Qref[^}]*\}\}/gi, '')
    .replace(/\{\{Ruby\|([^|]+)\|[^}]*\}\}/gi, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<br\s*\/?>/gi, ', ')
    .replace(/&nbsp;/g, ' ')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/''+/g, '')
    .trim();
}

function extractCharBox(wikitext: string): string | null {
  const idx = wikitext.indexOf('{{Char Box');
  if (idx === -1) return null;

  let depth = 0;
  for (let i = idx; i < wikitext.length - 1; i++) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') {
      depth++;
      i++;
    } else if (wikitext[i] === '}' && wikitext[i + 1] === '}') {
      depth--;
      i++;
      if (depth === 0) {
        return wikitext.substring(idx, i + 1);
      }
    }
  }
  return null;
}

function parseInfoboxFields(charboxText: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const lines = charboxText.split(/\n\s*\|/);
  for (const line of lines) {
    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.substring(0, eqIdx).trim().toLowerCase();
      const val = line.substring(eqIdx + 1).trim();
      fields[key] = val;
    }
  }
  return fields;
}

function extractNumber(val: string): number | null {
  if (!val) return null;
  const clean = cleanWikiText(val);

  // Height cm match
  const cmMatch = clean.match(/(\d+)\s*(?:cm|CM)/);
  if (cmMatch) return parseInt(cmMatch[1], 10);

  // Post-timeskip age match
  const afterTsMatch = clean.match(/(?:after timeskip|post-timeskip|current)[^0-9]*(\d+)/i);
  if (afterTsMatch) return parseInt(afterTsMatch[1], 10);

  // First plain number
  const numMatch = clean.match(/(\d+)/);
  if (numMatch) return parseInt(numMatch[1], 10);

  return null;
}

function extractBounty(val: string): number | null {
  if (!val) return null;
  const clean = cleanWikiText(val);
  if (/none|unknown|undisclosed|frozen|0/i.test(clean)) return 0;

  const numbers = clean.replace(/,/g, '').match(/\d{4,12}/g);
  if (numbers && numbers.length > 0) {
    const parsed = numbers.map((n) => parseInt(n, 10));
    return Math.max(...parsed);
  }
  return null;
}

function normalizeOrigin(val: string): string | null {
  if (!val) return null;
  const clean = cleanWikiText(val);
  if (/East Blue/i.test(clean)) return 'East Blue';
  if (/West Blue/i.test(clean)) return 'West Blue';
  if (/North Blue/i.test(clean)) return 'North Blue';
  if (/South Blue/i.test(clean)) return 'South Blue';
  if (/Grand Line/i.test(clean)) return 'Grand Line';
  if (/Red Line/i.test(clean)) return 'Red Line';
  if (/Calm Belt/i.test(clean)) return 'Calm Belt';
  if (/Sky Island|Skypiea|Weatheria|Bilka/i.test(clean)) return 'Sky Island';
  if (/Wano/i.test(clean)) return 'Wano Country';
  if (/Elbaf/i.test(clean)) return 'Elbaf';
  if (/Fish-Man Island|Ryugu/i.test(clean)) return 'Fish-Man Island';
  return clean.split(/[,;(]/)[0].trim() || 'Grand Line';
}

function normalizeFruitType(val: string): string {
  if (!val) return 'None';
  const clean = cleanWikiText(val);
  if (/Mythical/i.test(clean)) return 'Mythical Zoan';
  if (/Ancient/i.test(clean)) return 'Ancient Zoan';
  if (/Special Paramecia/i.test(clean)) return 'Special Paramecia';
  if (/Paramecia/i.test(clean)) return 'Paramecia';
  if (/Zoan/i.test(clean)) return 'Zoan';
  if (/Logia/i.test(clean)) return 'Logia';
  if (/SMILE/i.test(clean)) return 'SMILE';
  if (/None/i.test(clean)) return 'None';
  return 'None';
}

async function fetchWikiCharData(charName: string): Promise<any | null> {
  try {
    // 1. Direct page fetch with redirects
    const cleanName = charName.replace(/\s*\(.*?\)\s*/g, '').trim();
    let url = `https://onepiece.fandom.com/api.php?action=parse&page=${encodeURIComponent(cleanName)}&prop=wikitext&redirects=1&format=json`;
    let res = await fetch(url, { headers: { 'User-Agent': 'OnePieceCurationBot/1.0' } });
    let data = await res.json();

    let wikitext = data.parse?.wikitext?.['*'];

    // 2. If direct name didn't work, try search API
    if (!wikitext) {
      const searchUrl = `https://onepiece.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanName)}&format=json`;
      const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'OnePieceCurationBot/1.0' } });
      const searchData = await searchRes.json();
      const firstHit = searchData.query?.search?.[0]?.title;

      if (firstHit) {
        url = `https://onepiece.fandom.com/api.php?action=parse&page=${encodeURIComponent(firstHit)}&prop=wikitext&redirects=1&format=json`;
        res = await fetch(url, { headers: { 'User-Agent': 'OnePieceCurationBot/1.0' } });
        data = await res.json();
        wikitext = data.parse?.wikitext?.['*'];
      }
    }

    if (!wikitext) return null;

    const charbox = extractCharBox(wikitext);
    if (!charbox) return null;

    const fields = parseInfoboxFields(charbox);

    const jname = cleanWikiText(fields.jname || '');
    const rname = cleanWikiText(fields.rname || '');
    const epithet = cleanWikiText(fields.epithet || fields.alias || '');
    const age = extractNumber(fields.age || '');
    const height = extractNumber(fields.height || '');
    const bounty = extractBounty(fields.bounty || '');
    const origin = normalizeOrigin(fields.origin || fields.birthplace || '');
    const firstRaw = cleanWikiText(fields.first || '');
    const dfname = cleanWikiText(fields.dfname || fields.dfename || '');
    const dftype = normalizeFruitType(fields.dftype || '');
    const status = cleanWikiText(fields.status || '');
    const imageFile = cleanWikiText(fields.image || '');

    // Extract first chapter / arc
    let firstAppearance: string | null = null;
    let firstArc: string | null = null;
    if (firstRaw) {
      const chapMatch = firstRaw.match(/Chapter\s*\d+/i);
      if (chapMatch) firstAppearance = chapMatch[0];
      const epMatch = firstRaw.match(/Episode\s*\d+/i);
      if (!firstAppearance && epMatch) firstAppearance = epMatch[0];
    }

    return {
      japanese_name: jname || null,
      romanized_name: rname || null,
      alias: epithet || rname || null,
      age: age || null,
      height: height || null,
      bounty: bounty !== null ? bounty : null,
      origin: origin || null,
      first_appearance: firstAppearance,
      first_arc: firstArc,
      devil_fruit_name: dfname && dfname !== 'None' ? dfname : null,
      devil_fruit_type: dfname && dfname !== 'None' ? dftype : 'None',
      status: /dead|deceased/i.test(status) ? 'Dead' : (/alive/i.test(status) ? 'Alive' : null),
    };
  } catch (err) {
    return null;
  }
}

async function runEnrichment() {
  const supabase = createAdminClient();

  console.log('Fetching all unverified/sourced characters...');
  let allUnverified: any[] = [];
  let from = 0;
  while (true) {
    const { data } = await supabase
      .from('characters')
      .select('*')
      .eq('verification_status', 'sourced')
      .range(from, from + 999);

    if (!data || data.length === 0) break;
    allUnverified = allUnverified.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  console.log(`Found ${allUnverified.length} unverified characters.`);

  let updatedCount = 0;
  let notFoundCount = 0;

  // Process with concurrency of 6
  const concurrency = 6;
  for (let i = 0; i < allUnverified.length; i += concurrency) {
    const batch = allUnverified.slice(i, i + concurrency);

    await Promise.all(
      batch.map(async (char) => {
        // Double safety check: NEVER touch verified characters
        if (char.verification_status === 'verified') return;

        const wikiData = await fetchWikiCharData(char.name);
        if (!wikiData) {
          notFoundCount++;
          return;
        }

        const updates: Record<string, any> = {};

        // Only fill missing fields! Never overwrite existing non-null data
        if (!char.japanese_name && wikiData.japanese_name) updates.japanese_name = wikiData.japanese_name;
        if (!char.romanized_name && wikiData.romanized_name) updates.romanized_name = wikiData.romanized_name;
        if (!char.alias && wikiData.alias) updates.alias = wikiData.alias;
        if ((char.age === null || char.age === undefined) && wikiData.age) updates.age = wikiData.age;
        if ((char.height === null || char.height === undefined) && wikiData.height) updates.height = wikiData.height;
        if ((char.bounty === null || char.bounty === undefined) && wikiData.bounty !== null) updates.bounty = wikiData.bounty;
        if ((!char.origin || char.origin === 'Unknown') && wikiData.origin) updates.origin = wikiData.origin;
        if (!char.first_appearance && wikiData.first_appearance) updates.first_appearance = wikiData.first_appearance;
        if ((!char.devil_fruit_name || char.devil_fruit_name === 'None') && wikiData.devil_fruit_name) {
          updates.devil_fruit_name = wikiData.devil_fruit_name;
          updates.devil_fruit_type = wikiData.devil_fruit_type;
        }

        if (Object.keys(updates).length > 0) {
          updates.updated_at = new Date().toISOString();
          const { error: updateErr } = await supabase.from('characters').update(updates).eq('id', char.id);
          if (!updateErr) {
            updatedCount++;
            console.log(`[${updatedCount}] Filled missing data for "${char.name}":`, Object.keys(updates));
          }
        }
      })
    );

    if (i % 60 === 0 && i > 0) {
      console.log(`Progress: ${i} / ${allUnverified.length} characters processed...`);
    }
  }

  console.log(`\n=== ENRICHMENT SUMMARY ===`);
  console.log(`Total unverified inspected: ${allUnverified.length}`);
  console.log(`Updated characters with filled wiki data: ${updatedCount}`);
  console.log(`Unmatched/No new wiki data: ${notFoundCount}`);
  process.exit(0);
}

runEnrichment().catch(console.error);
