import { createAdminClient } from '../lib/supabase/admin';

async function inspectVerified() {
  const supabase = createAdminClient();
  const { data: verifiedChars, error } = await supabase
    .from('characters')
    .select('id, name, age, height, bounty, image_url, devil_fruit_name, devil_fruit_type, origin, first_appearance, first_arc, alias, romanized_name, verification_status, updated_at')
    .eq('verification_status', 'verified')
    .order('updated_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Error fetching verified characters:', error);
    process.exit(1);
  }

  console.log(`Found ${(verifiedChars || []).length} verified characters (sorted by recently updated):`);
  for (const c of (verifiedChars || [])) {
    const missing: string[] = [];
    if (c.bounty === null || c.bounty === undefined) missing.push('Bounty');
    if (!c.age) missing.push('Age');
    if (!c.height) missing.push('Height');
    if (!c.image_url) missing.push('Image');
    if (!c.devil_fruit_type || c.devil_fruit_type === 'Unknown') missing.push('Fruit');
    if (!c.origin || c.origin === 'Unknown') missing.push('Origin');
    if (!c.first_appearance && !c.first_arc) missing.push('Debut');
    if (!c.alias && !c.romanized_name) missing.push('Alias');

    console.log(`- "${c.name}" (Updated: ${c.updated_at}) -> Missing fields according to strict checklist: [${missing.join(', ')}]`);
  }
  process.exit(0);
}

inspectVerified().catch(console.error);
