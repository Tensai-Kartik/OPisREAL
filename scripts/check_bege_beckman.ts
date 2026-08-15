import { createAdminClient } from '../lib/supabase/admin';

async function checkInvertedNames() {
  const supabase = createAdminClient();
  const { data: chars } = await supabase
    .from('characters')
    .select('id, name, alias, romanized_name, bounty, verification_status')
    .ilike('name', '%bege%');

  console.log('Bege records:', chars);

  const { data: benn } = await supabase
    .from('characters')
    .select('id, name, alias, romanized_name, bounty, verification_status')
    .ilike('name', '%beckman%');

  console.log('Beckman records:', benn);
}

checkInvertedNames();
