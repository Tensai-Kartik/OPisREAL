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
    if (ep <= 779) return 'Zou';
    if (ep <= 877) return 'Whole Cake Island';
    if (ep <= 889) return 'Levely';
    if (ep <= 1085) return 'Wano Country';
    return 'Egghead';
  }

  return null;
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
  // Remove templates
  let text = wikitext.replace(/\{\{[\s\S]*?\}\}/g, '');
  // Cut at first section header
  const firstSection = text.indexOf('==');
  if (firstSection !== -1) {
    text = text.substring(0, firstSection);
  }
  const clean = cleanWikiText(text);
  const paras = clean.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 30);
  if (paras.length > 0) {
    // Limit to max 350 characters for clean summary notes
    let summary = paras[0];
    if (summary.length > 350) {
      summary = summary.substring(0, 350).trim() + '...';
    }
    return summary;
  }
  return '';
}

async function testExtraction() {
  const url = `https://onepiece.fandom.com/api.php?action=parse&page=Koby&prop=wikitext&redirects=1&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'OnePieceApp/1.0' } });
  const data = await res.json();
  const wikitext = data.parse?.wikitext?.['*'] || '';

  const arc = getArcFromChapterOrEpisode('Chapter 2; Episode 1');
  const lead = extractLeadParagraph(wikitext);
  console.log('Arc calculated:', arc);
  console.log('Lead summary extracted:');
  console.log(lead);
}

testExtraction();
