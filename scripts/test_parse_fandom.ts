import { createAdminClient } from '../lib/supabase/admin';

function cleanWikiText(val: string): string {
  if (!val) return '';
  return val
    .replace(/\{\{Qref[^}]*\}\}/gi, '')
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

function parseInfobox(wikitext: string) {
  const charboxMatch = wikitext.match(/\{\{Char Box\b([\s\S]*?)\n\}\}/i);
  if (!charboxMatch) return null;

  const body = charboxMatch[1];
  const fields: Record<string, string> = {};

  const lines = body.split(/\n\s*\|/);
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
  
  // Look for cm height or after timeskip
  const cmMatch = clean.match(/(\d+)\s*(?:cm|CM)/);
  if (cmMatch) return parseInt(cmMatch[1], 10);

  // Look for after timeskip age or latest age
  const afterTsMatch = clean.match(/(?:after timeskip|post-timeskip|current)[^0-9]*(\d+)/i);
  if (afterTsMatch) return parseInt(afterTsMatch[1], 10);

  // Look for any standard number
  const numMatch = clean.match(/(\d+)/);
  if (numMatch) return parseInt(numMatch[1], 10);

  return null;
}

function extractBounty(val: string): number | null {
  if (!val) return null;
  const clean = cleanWikiText(val);
  if (/none|unknown|undisclosed/i.test(clean)) return 0;
  
  // Look for biggest number / latest bounty
  const numbers = clean.replace(/,/g, '').match(/\d{4,12}/g);
  if (numbers && numbers.length > 0) {
    const parsed = numbers.map(n => parseInt(n, 10));
    return Math.max(...parsed);
  }
  return null;
}

async function testParseCharacter(name: string) {
  const url = `https://onepiece.fandom.com/api.php?action=parse&page=${encodeURIComponent(name)}&prop=wikitext&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'OnePieceApp/1.0' } });
  const data = await res.json();
  if (!data.parse?.wikitext) {
    console.log(`Failed to fetch page for ${name}`);
    return;
  }

  const wikitext = data.parse.wikitext['*'];
  const info = parseInfobox(wikitext);
  if (!info) {
    console.log(`No Char Box found for ${name}`);
    return;
  }

  console.log(`\n=== PARSED FOR ${name} ===`);
  console.log('jname:', cleanWikiText(info.jname || ''));
  console.log('rname:', cleanWikiText(info.rname || ''));
  console.log('epithet/alias:', cleanWikiText(info.epithet || info.alias || ''));
  console.log('age:', extractNumber(info.age || ''));
  console.log('height:', extractNumber(info.height || ''));
  console.log('bounty:', extractBounty(info.bounty || ''));
  console.log('origin:', cleanWikiText(info.origin || info.birthplace || ''));
  console.log('first:', cleanWikiText(info.first || ''));
  console.log('dfname:', cleanWikiText(info.dfname || ''));
  console.log('dftype:', cleanWikiText(info.dftype || ''));
  console.log('status:', cleanWikiText(info.status || ''));
}

async function run() {
  await testParseCharacter('Koby');
  await testParseCharacter('Rob Lucci');
  await testParseCharacter('Shirahoshi');
  await testParseCharacter('Yamato');
  process.exit(0);
}

run().catch(console.error);
