import { createAdminClient } from '../lib/supabase/admin';

async function diagnoseImages() {
  console.log('=== Diagnosing Character Image URLs in Supabase ===');
  const supabase = createAdminClient();

  const { data: chars, error } = await supabase
    .from('characters')
    .select('id, name, slug, image_url, verification_status')
    .order('name');

  if (error || !chars) {
    console.error('Error fetching characters:', error);
    return;
  }

  console.log(`Total Characters: ${chars.length}`);

  let missingCount = 0;
  let placeholderCount = 0;
  let fandomCount = 0;
  let malCount = 0;
  let otherCount = 0;

  const missingList: { id: string; name: string }[] = [];
  const fandomList: { id: string; name: string; url: string }[] = [];
  const placeholderList: { id: string; name: string; url: string }[] = [];

  for (const c of chars) {
    if (!c.image_url || c.image_url.trim() === '') {
      missingCount++;
      missingList.push({ id: c.id, name: c.name });
    } else if (c.image_url.includes('placeholder')) {
      placeholderCount++;
      placeholderList.push({ id: c.id, name: c.name, url: c.image_url });
    } else if (c.image_url.includes('wikia.nocookie.net') || c.image_url.includes('fandom.com')) {
      fandomCount++;
      fandomList.push({ id: c.id, name: c.name, url: c.image_url });
    } else if (c.image_url.includes('myanimelist.net')) {
      malCount++;
    } else {
      otherCount++;
    }
  }

  console.log('\n--- Image URL Breakdown ---');
  console.log(`Missing Image:      ${missingCount}`);
  console.log(`Placeholder Image:  ${placeholderCount}`);
  console.log(`Fandom / Wikia:     ${fandomCount} (Commonly blocked with 403 Forbidden / Hotlink protection!)`);
  console.log(`MyAnimeList CDN:    ${malCount}`);
  console.log(`Other Sources:      ${otherCount}`);

  if (fandomList.length > 0) {
    console.log('\nSample Fandom URLs throwing 403/errors:');
    console.log(fandomList.slice(0, 5));
  }

  if (missingList.length > 0) {
    console.log('\nSample Missing Characters:');
    console.log(missingList.slice(0, 10));
  }
}

diagnoseImages().catch(console.error);
