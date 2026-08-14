import { createAdminClient } from '../lib/supabase/admin';

async function inspectMissing() {
  const supabase = createAdminClient();
  const { data: chars } = await supabase
    .from('characters')
    .select('id, name, age, height, bounty, image_url, status, origin')
    .is('image_url', null)
    .limit(20);

  console.log('Sample characters missing image_url:', chars);

  const { data: bountyMissing } = await supabase
    .from('characters')
    .select('id, name, origin, age, height')
    .is('bounty', null)
    .limit(25);

  console.log('\nSample characters with null bounty:', bountyMissing);
  process.exit(0);
}

inspectMissing().catch(console.error);
