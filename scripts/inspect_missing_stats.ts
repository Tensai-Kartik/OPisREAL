import { createAdminClient } from '../lib/supabase/admin';

async function checkMissingStats() {
  const supabase = createAdminClient();

  const { data: allChars, error } = await supabase
    .from('characters')
    .select('id, name, age, height, bounty, origin, first_appearance, first_arc, devil_fruit_type, image_url');

  if (error || !allChars) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total Characters: ${allChars.length}`);

  const missingAge = allChars.filter(c => !c.age);
  const missingHeight = allChars.filter(c => !c.height);
  const missingBounty = allChars.filter(c => c.bounty === null || c.bounty === undefined);
  const missingOrigin = allChars.filter(c => !c.origin || c.origin === 'Unknown');
  const missingDebut = allChars.filter(c => !c.first_appearance && !c.first_arc);
  const missingImage = allChars.filter(c => !c.image_url);

  console.log(`Missing Age: ${missingAge.length}`);
  console.log(`Missing Height: ${missingHeight.length}`);
  console.log(`Missing Bounty: ${missingBounty.length}`);
  console.log(`Missing Origin: ${missingOrigin.length}`);
  console.log(`Missing Debut: ${missingDebut.length}`);
  console.log(`Missing Image: ${missingImage.length}`);

  process.exit(0);
}

checkMissingStats().catch(console.error);
