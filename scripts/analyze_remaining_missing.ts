import { createAdminClient } from '../lib/supabase/admin';

async function analyzeRemainingMissing() {
  const supabase = createAdminClient();
  let all: any[] = [];
  let from = 0;
  while (true) {
    const { data } = await supabase
      .from('characters')
      .select('id, name, age, height, bounty, origin, first_appearance, first_arc, birthday, blood_type, description, devil_fruit_name, devil_fruit_type, image_url, verification_status')
      .eq('verification_status', 'sourced')
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  console.log(`Total unverified characters: ${all.length}`);
  
  let missingAge = 0;
  let missingHeight = 0;
  let missingBounty = 0;
  let missingOrigin = 0;
  let missingDebut = 0;
  let missingArc = 0;
  let missingBirthday = 0;
  let missingBlood = 0;
  let missingDesc = 0;
  let missingImage = 0;

  for (const c of all) {
    if (!c.age) missingAge++;
    if (!c.height) missingHeight++;
    if (c.bounty === null || c.bounty === undefined) missingBounty++;
    if (!c.origin || c.origin === 'Unknown') missingOrigin++;
    if (!c.first_appearance) missingDebut++;
    if (!c.first_arc) missingArc++;
    if (!c.birthday) missingBirthday++;
    if (!c.blood_type) missingBlood++;
    if (!c.description) missingDesc++;
    if (!c.image_url) missingImage++;
  }

  console.log('--- REMAINING MISSING FIELDS (UNVERIFIED) ---');
  console.log(`Missing Age: ${missingAge}`);
  console.log(`Missing Height: ${missingHeight}`);
  console.log(`Missing Bounty: ${missingBounty}`);
  console.log(`Missing Origin: ${missingOrigin}`);
  console.log(`Missing Debut: ${missingDebut}`);
  console.log(`Missing First Arc: ${missingArc}`);
  console.log(`Missing Birthday: ${missingBirthday}`);
  console.log(`Missing Blood Type: ${missingBlood}`);
  console.log(`Missing Description: ${missingDesc}`);
  console.log(`Missing Image: ${missingImage}`);
  process.exit(0);
}

analyzeRemainingMissing();
