import { createAdminClient } from '../lib/supabase/admin';

function normalizeTokens(name: string): string {
  return name
    .toLowerCase()
    .replace(/^sir\s+/i, '')
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(' ');
}

async function findAndCleanDuplicates() {
  const supabase = createAdminClient();

  const { data: allChars, error } = await supabase
    .from('characters')
    .select('id, name, slug, verification_status, bounty, age, height, origin, first_appearance, first_arc, devil_fruit_type, image_url')
    .order('created_at', { ascending: true });

  if (error || !allChars) {
    console.error('Error:', error);
    return;
  }

  console.log(`Analyzing ${allChars.length} characters for duplicates...`);

  // Group by sorted token key
  const groups = new Map<string, typeof allChars>();

  for (const c of allChars) {
    const key = normalizeTokens(c.name);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(c);
  }

  let duplicateGroupsCount = 0;
  let deletedCount = 0;

  for (const [key, list] of groups.entries()) {
    if (list.length > 1) {
      duplicateGroupsCount++;
      console.log(`\nDuplicate Group for "${key}" (${list.length} records):`);

      // Score each candidate: higher score for verified, non-null fields, valid image, canon naming
      const scored = list.map((char) => {
        let score = 0;
        if (char.verification_status === 'verified') score += 100;
        if (char.image_url && !char.image_url.includes('placeholder')) score += 20;
        if (char.bounty !== null && char.bounty !== undefined) score += 15;
        if (char.age) score += 10;
        if (char.height) score += 10;
        if (char.first_appearance) score += 10;
        if (char.first_arc) score += 10;
        if (char.origin && char.origin !== 'Unknown') score += 5;
        if (char.devil_fruit_type && char.devil_fruit_type !== 'Unknown') score += 5;

        // Prefer standard western naming over inverted (e.g. "Dracule Mihawk" over "Mihawk Dracule", "Crocodile" over "Sir Crocodile")
        if (char.name === 'Dracule Mihawk') score += 50;
        if (char.name === 'Crocodile') score += 50;
        if (char.name === 'Monkey D. Luffy') score += 50;
        if (char.name === 'Roronoa Zoro') score += 50;
        if (char.name === 'Marshall D. Teach') score += 50;
        if (char.name === 'Edward Newgate') score += 50;
        if (char.name === 'Charlotte Linlin') score += 50;
        if (char.name === 'Donquixote Doflamingo') score += 50;
        if (char.name === 'Boa Hancock') score += 50;
        if (char.name === 'Trafalgar D. Water Law') score += 50;

        return { char, score };
      });

      scored.sort((a, b) => b.score - a.score);

      const best = scored[0].char;
      const duplicatesToDelete = scored.slice(1).map((s) => s.char);

      console.log(`  -> KEEPING BEST: "${best.name}" (ID: ${best.id}, score: ${scored[0].score}, verified: ${best.verification_status})`);

      for (const dup of duplicatesToDelete) {
        console.log(`  -> DELETING DUPLICATE: "${dup.name}" (ID: ${dup.id})`);

        // Clean relational tables before deleting character
        await supabase.from('character_affiliations').delete().eq('character_id', dup.id);
        await supabase.from('character_occupations').delete().eq('character_id', dup.id);
        await supabase.from('character_haki').delete().eq('character_id', dup.id);
        await supabase.from('character_conflicts').delete().eq('character_id', dup.id);
        await supabase.from('raw_character_sources').delete().eq('character_id', dup.id);

        const { error: delErr } = await supabase.from('characters').delete().eq('id', dup.id);
        if (!delErr) {
          deletedCount++;
        } else {
          console.error(`Failed to delete ${dup.id}:`, delErr.message);
        }
      }
    }
  }

  console.log(`\n=== DEDUPLICATION COMPLETE ===`);
  console.log(`Found ${duplicateGroupsCount} duplicate groups.`);
  console.log(`Deleted ${deletedCount} redundant character records.`);
  process.exit(0);
}

findAndCleanDuplicates().catch(console.error);
