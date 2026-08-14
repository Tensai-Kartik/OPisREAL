import { createAdminClient } from '../lib/supabase/admin';

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchJikan(name: string): Promise<string | null> {
  try {
    const cleanName = encodeURIComponent(
      name
        .replace(/^(St\.|Saint|Dr\.|Captain|Mayor|Baron|Lord)\s+/i, '')
        .replace(/\/.*$/, '')
        .trim()
    );

    const res = await fetch(`https://api.jikan.moe/v4/characters?q=${cleanName}&limit=3`, {
      headers: { 'User-Agent': 'OPisReal-ImagePipeline/1.0' },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      const char = data.data[0];
      const img = char.images?.jpg?.image_url || char.images?.webp?.image_url;
      if (img && !img.includes('questionmark')) {
        return img;
      }
    }
  } catch (e) {
    // ignore fetch error
  }
  return null;
}

async function populateRemainingImages() {
  console.log('=== Populating Remaining Character Images from Jikan MAL API ===');
  const supabase = createAdminClient();

  const { data: missingChars, error } = await supabase
    .from('characters')
    .select('id, name, slug, image_url')
    .or('image_url.is.null,image_url.eq.');

  if (error || !missingChars) {
    console.error('Error fetching missing characters:', error);
    return;
  }

  console.log(`Found ${missingChars.length} characters currently missing images.`);

  let updatedCount = 0;

  for (let i = 0; i < missingChars.length; i++) {
    const c = missingChars[i];
    // Skip French numbered placeholder names like '1er Doyen'
    if (/^\d+(er|e)\s+/i.test(c.name)) continue;

    console.log(`[${i + 1}/${missingChars.length}] Searching for: ${c.name}...`);
    const imgUrl = await searchJikan(c.name);

    if (imgUrl) {
      await supabase
        .from('characters')
        .update({ image_url: imgUrl })
        .eq('id', c.id);
      console.log(`  ✓ Found & Updated [${c.name}] -> ${imgUrl}`);
      updatedCount++;
    } else {
      console.log(`  - No MAL image found for ${c.name}`);
    }

    // Rate limit delay for Jikan (3 requests per second)
    await delay(350);
  }

  console.log(`\n=== COMPLETED: Updated ${updatedCount} character images ===`);
  process.exit(0);
}

populateRemainingImages().catch(console.error);
