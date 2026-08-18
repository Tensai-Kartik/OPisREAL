import { createAdminClient } from '../lib/supabase/admin';

function getArcFromChapterOrEpisode(chapStr: string | null): string | null {
  if (!chapStr) return null;

  const chapMatch = chapStr.match(/Chapter\s*(\d+)/i);
  if (chapMatch) {
    const c = parseInt(chapMatch[1], 10);
    if (c <= 7) return 'Romance Dawn';
    if (c <= 21) return 'Orange Town';
    if (c <= 41) return 'Syrup Village';
    if (c <= 68) return 'Baratie';
    if (c <= 95) return 'Arlong Park';
    if (c <= 100) return 'Loguetown';
    if (c <= 105) return 'Reverse Mountain';
    if (c <= 114) return 'Whiskey Peak';
    if (c <= 129) return 'Little Garden';
    if (c <= 154) return 'Drum Island';
    if (c <= 217) return 'Arabasta';
    if (c <= 236) return 'Jaya';
    if (c <= 302) return 'Skypiea';
    if (c <= 321) return 'Long Ring Long Land';
    if (c <= 374) return 'Water 7';
    if (c <= 430) return 'Enies Lobby';
    if (c <= 441) return 'Post-Enies Lobby';
    if (c <= 489) return 'Thriller Bark';
    if (c <= 513) return 'Sabaody Archipelago';
    if (c <= 524) return 'Amazon Lily';
    if (c <= 548) return 'Impel Down';
    if (c <= 580) return 'Marineford';
    if (c <= 597) return 'Post-War';
    if (c <= 602) return 'Return to Sabaody';
    if (c <= 653) return 'Fish-Man Island';
    if (c <= 700) return 'Punk Hazard';
    if (c <= 801) return 'Dressrosa';
    if (c <= 824) return 'Zou';
    if (c <= 902) return 'Whole Cake Island';
    if (c <= 908) return 'Levely';
    if (c <= 1057) return 'Wano Country';
    return 'Egghead';
  }

  const epMatch = chapStr.match(/Episode\s*(\d+)/i);
  if (epMatch) {
    const ep = parseInt(epMatch[1], 10);
    if (ep <= 3) return 'Romance Dawn';
    if (ep <= 8) return 'Orange Town';
    if (ep <= 18) return 'Syrup Village';
    if (ep <= 30) return 'Baratie';
    if (ep <= 44) return 'Arlong Park';
    if (ep <= 53) return 'Loguetown';
    if (ep <= 63) return 'Reverse Mountain';
    if (ep <= 67) return 'Whiskey Peak';
    if (ep <= 77) return 'Little Garden';
    if (ep <= 91) return 'Drum Island';
    if (ep <= 130) return 'Arabasta';
    if (ep <= 152) return 'Jaya';
    if (ep <= 195) return 'Skypiea';
    if (ep <= 219) return 'Long Ring Long Land';
    if (ep <= 263) return 'Water 7';
    if (ep <= 312) return 'Enies Lobby';
    if (ep <= 325) return 'Post-Enies Lobby';
    if (ep <= 381) return 'Thriller Bark';
    if (ep <= 405) return 'Sabaody Archipelago';
    if (ep <= 417) return 'Amazon Lily';
    if (ep <= 452) return 'Impel Down';
    if (ep <= 489) return 'Marineford';
    if (ep <= 516) return 'Post-War';
    if (ep <= 522) return 'Return to Sabaody';
    if (ep <= 574) return 'Fish-Man Island';
    if (ep <= 625) return 'Punk Hazard';
    if (ep <= 746) return 'Dressrosa';
    if (ep <= 751) return 'Zou';
    if (ep <= 877) return 'Whole Cake Island';
    if (ep <= 889) return 'Levely';
    if (ep <= 1085) return 'Wano Country';
    return 'Egghead';
  }

  return null;
}

function stripAllTemplates(wikitext: string): string {
  let result = '';
  let depth = 0;
  for (let i = 0; i < wikitext.length; i++) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') {
      depth++;
      i++;
    } else if (wikitext[i] === '}' && wikitext[i + 1] === '}') {
      depth--;
      i++;
    } else if (depth === 0) {
      result += wikitext[i];
    }
  }
  return result;
}

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

function extractLeadParagraph(wikitext: string): string {
  let text = stripAllTemplates(wikitext);
  const firstSection = text.indexOf('==');
  if (firstSection !== -1) {
    text = text.substring(0, firstSection);
  }
  const clean = cleanWikiText(text);
  const paras = clean
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 25 && !p.startsWith('|'));

  if (paras.length > 0) {
    let summary = paras[0].replace(/\s+/g, ' ');
    if (summary.length > 350) {
      summary = summary.substring(0, 350).trim() + '...';
    }
    return summary;
  }
  return '';
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

  const cmMatch = clean.match(/(\d+)\s*(?:cm|CM)/);
  if (cmMatch) return parseInt(cmMatch[1], 10);

  const afterTsMatch = clean.match(/(?:after timeskip|post-timeskip|current)[^0-9]*(\d+)/i);
  if (afterTsMatch) return parseInt(afterTsMatch[1], 10);

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

function cleanBirthday(val: string): string | null {
  if (!val) return null;
  const clean = cleanWikiText(val);
  const match = clean.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}/i);
  if (match) return match[0];
  return clean.split(/[,;]/)[0].trim() || null;
}

function cleanBloodType(val: string): string | null {
  if (!val) return null;
  const clean = cleanWikiText(val);
  if (/XF/i.test(clean)) return 'XF';
  if (/X/i.test(clean)) return 'X';
  if (/F/i.test(clean)) return 'F';
  if (/S/i.test(clean)) return 'S';
  return clean.split(/[,;(]/)[0].trim() || null;
}

async function fetchWikiDetails(charName: string): Promise<any | null> {
  try {
    const cleanName = charName.replace(/\s*\(.*?\)\s*/g, '').trim();
    let url = `https://onepiece.fandom.com/api.php?action=parse&page=${encodeURIComponent(cleanName)}&prop=wikitext&redirects=1&format=json`;
    let res = await fetch(url, { headers: { 'User-Agent': 'OnePieceCuration/2.0' } });
    let data = await res.json();

    let wikitext = data.parse?.wikitext?.['*'];

    if (!wikitext) {
      const searchUrl = `https://onepiece.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanName)}&format=json`;
      const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'OnePieceCuration/2.0' } });
      const searchData = await searchRes.json();
      const firstHit = searchData.query?.search?.[0]?.title;

      if (firstHit) {
        url = `https://onepiece.fandom.com/api.php?action=parse&page=${encodeURIComponent(firstHit)}&prop=wikitext&redirects=1&format=json`;
        res = await fetch(url, { headers: { 'User-Agent': 'OnePieceCuration/2.0' } });
        data = await res.json();
        wikitext = data.parse?.wikitext?.['*'];
      }
    }

    if (!wikitext) return null;

    const charbox = extractCharBox(wikitext);
    const fields = charbox ? parseInfoboxFields(charbox) : {};

    const jname = cleanWikiText(fields.jname || '');
    const rname = cleanWikiText(fields.rname || '');
    const epithet = cleanWikiText(fields.epithet || fields.alias || '');
    const age = extractNumber(fields.age || '');
    const height = extractNumber(fields.height || '');
    const bounty = extractBounty(fields.bounty || '');
    const birthday = cleanBirthday(fields.birth || fields.birthday || '');
    const bloodType = cleanBloodType(fields.blood || fields.bloodtype || '');
    const origin = normalizeOrigin(fields.origin || fields.birthplace || '');
    const firstRaw = cleanWikiText(fields.first || '');
    const dfname = cleanWikiText(fields.dfname || fields.dfename || '');
    const dftype = normalizeFruitType(fields.dftype || '');
    const desc = extractLeadParagraph(wikitext);

    let firstAppearance: string | null = null;
    let firstArc: string | null = null;
    if (firstRaw) {
      const chapMatch = firstRaw.match(/Chapter\s*\d+/i);
      if (chapMatch) firstAppearance = chapMatch[0];
      const epMatch = firstRaw.match(/Episode\s*\d+/i);
      if (!firstAppearance && epMatch) firstAppearance = epMatch[0];
      firstArc = getArcFromChapterOrEpisode(firstAppearance || firstRaw);
    }

    return {
      japanese_name: jname || null,
      romanized_name: rname || null,
      alias: epithet || rname || null,
      age: age || null,
      height: height || null,
      bounty: bounty !== null ? bounty : null,
      birthday: birthday || null,
      blood_type: bloodType || null,
      origin: origin || null,
      first_appearance: firstAppearance,
      first_arc: firstArc,
      description: desc || null,
      devil_fruit_name: dfname && dfname !== 'None' ? dfname : null,
      devil_fruit_type: dfname && dfname !== 'None' ? dftype : 'None',
    };
  } catch (err) {
    return null;
  }
}

async function runEnrichment() {
  const supabase = createAdminClient();

  console.log('Fetching all unverified characters...');
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

  console.log(`Found ${allUnverified.length} unverified characters to inspect.`);

  let updatedCount = 0;
  const concurrency = 6;

  for (let i = 0; i < allUnverified.length; i += concurrency) {
    const batch = allUnverified.slice(i, i + concurrency);

    await Promise.all(
      batch.map(async (char) => {
        // STRICT SAFETY: NEVER touch verified characters
        if (char.verification_status === 'verified') return;

        const updates: Record<string, any> = {};

        // 1. Auto-fill first_arc from first_appearance if arc is missing
        if (!char.first_arc && char.first_appearance) {
          const arc = getArcFromChapterOrEpisode(char.first_appearance);
          if (arc) updates.first_arc = arc;
        }

        // 2. Fetch full wiki facts
        const wikiData = await fetchWikiDetails(char.name);
        if (wikiData) {
          if (!char.japanese_name && wikiData.japanese_name) updates.japanese_name = wikiData.japanese_name;
          if (!char.romanized_name && wikiData.romanized_name) updates.romanized_name = wikiData.romanized_name;
          if (!char.alias && wikiData.alias) updates.alias = wikiData.alias;
          if ((char.age === null || char.age === undefined) && wikiData.age) updates.age = wikiData.age;
          if ((char.height === null || char.height === undefined) && wikiData.height) updates.height = wikiData.height;
          if ((char.bounty === null || char.bounty === undefined) && wikiData.bounty !== null) updates.bounty = wikiData.bounty;
          if ((!char.origin || char.origin === 'Unknown') && wikiData.origin) updates.origin = wikiData.origin;
          if (!char.first_appearance && wikiData.first_appearance) updates.first_appearance = wikiData.first_appearance;
          if (!char.first_arc && wikiData.first_arc) updates.first_arc = wikiData.first_arc;
          if (!char.birthday && wikiData.birthday) updates.birthday = wikiData.birthday;
          if (!char.blood_type && wikiData.blood_type) updates.blood_type = wikiData.blood_type;
          if (!char.description && wikiData.description) updates.description = wikiData.description;
          if ((!char.devil_fruit_name || char.devil_fruit_name === 'None') && wikiData.devil_fruit_name) {
            updates.devil_fruit_name = wikiData.devil_fruit_name;
            updates.devil_fruit_type = wikiData.devil_fruit_type;
          }
        }

        // 3. Ensure verification_status is STRICTLY KEPT as 'sourced'
        updates.verification_status = 'sourced';

        if (Object.keys(updates).length > 1) { // more than just verification_status
          updates.updated_at = new Date().toISOString();
          const { error: updateErr } = await supabase.from('characters').update(updates).eq('id', char.id);
          if (!updateErr) {
            updatedCount++;
            console.log(`[${updatedCount}] Sourced facts for "${char.name}":`, Object.keys(updates).filter(k => k !== 'verification_status' && k !== 'updated_at'));
          }
        }
      })
    );

    if (i % 60 === 0 && i > 0) {
      console.log(`Progress: ${i} / ${allUnverified.length} unverified characters processed...`);
    }
  }

  console.log(`\n=== COMPLETE ENRICHMENT SUMMARY ===`);
  console.log(`Total unverified inspected: ${allUnverified.length}`);
  console.log(`Updated characters with filled data: ${updatedCount}`);
  console.log(`All updated characters kept in unverified ('sourced') status as requested.`);
  process.exit(0);
}

runEnrichment().catch(console.error);
