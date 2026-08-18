import { createAdminClient } from '../lib/supabase/admin';

async function testMetrics() {
  const supabase = createAdminClient();
  let allChars: any[] = [];
  let from = 0;
  const chunkSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, age, height, bounty, image_url, devil_fruit_type, origin, first_appearance, first_arc, alias, romanized_name, verification_status')
      .range(from, from + chunkSize - 1);

    if (error) {
      console.error('Error fetching chunk:', error);
      break;
    }

    if (!data || data.length === 0) break;
    allChars = allChars.concat(data);
    if (data.length < chunkSize) break;
    from += chunkSize;
  }

  const totalCount = allChars.length;
  const verifiedCount = allChars.filter((c) => c.verification_status === 'verified').length;
  const conflictCount = allChars.filter((c) => c.verification_status === 'conflict').length;

  let missingCount = 0;
  for (const c of allChars) {
    const isMissing =
      c.bounty === null ||
      c.bounty === undefined ||
      !c.age ||
      !c.height ||
      !c.image_url ||
      !c.devil_fruit_type ||
      c.devil_fruit_type === 'Unknown' ||
      !c.origin ||
      c.origin === 'Unknown' ||
      (!c.first_appearance && !c.first_arc) ||
      (!c.alias && !c.romanized_name);

    if (isMissing) {
      missingCount++;
    }
  }

  console.log('--- DASHBOARD METRICS ---');
  console.log('Total characters:', totalCount);
  console.log('Verified characters:', verifiedCount);
  console.log('Conflicts count:', conflictCount);
  console.log('Missing count (all fields):', missingCount);
  console.log('Verified %:', Math.round((verifiedCount / totalCount) * 100));
  process.exit(0);
}

testMetrics().catch(console.error);
