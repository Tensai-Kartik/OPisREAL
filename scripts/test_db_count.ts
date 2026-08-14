import { createAdminClient } from '../lib/supabase/admin';

async function checkDb() {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from('characters')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching count:', error);
  } else {
    console.log(`Current characters count in Supabase: ${count}`);
  }
}

checkDb().catch(console.log);
