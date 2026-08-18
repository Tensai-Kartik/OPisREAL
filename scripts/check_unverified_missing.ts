import { createAdminClient } from '../lib/supabase/admin';

async function checkUnverifiedMissing() {
  const supabase = createAdminClient();
  let all: any[] = [];
  let from = 0;
  while (true) {
    const { data } = await supabase
      .from('characters')
      .select('id, name, age, height, bounty, image_url, devil_fruit_type, origin, first_appearance, first_arc, alias, romanized_name, verification_status')
      .eq('verification_status', 'sourced')
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  console.log(`Total unverified/sourced characters: ${all.length}`);

  const withMissing = all.filter((c) => {
    return (
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
      (!c.alias && !c.romanized_name)
    );
  });

  console.log(`Unverified characters with missing fields: ${withMissing.length}`);
  console.log('Sample 10 unverified with missing fields:');
  withMissing.slice(0, 10).forEach((c) => {
    const m = [];
    if (c.bounty === null || c.bounty === undefined) m.push('bounty');
    if (!c.age) m.push('age');
    if (!c.height) m.push('height');
    if (!c.image_url) m.push('image');
    if (!c.devil_fruit_type || c.devil_fruit_type === 'Unknown') m.push('fruit');
    if (!c.origin || c.origin === 'Unknown') m.push('origin');
    if (!c.first_appearance && !c.first_arc) m.push('debut');
    if (!c.alias && !c.romanized_name) m.push('alias');
    console.log(`- "${c.name}" -> missing: [${m.join(', ')}]`);
  });

  process.exit(0);
}

checkUnverifiedMissing();
