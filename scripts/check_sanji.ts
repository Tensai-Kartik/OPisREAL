import { createAdminClient } from '../lib/supabase/admin';

async function checkSanji() {
  const supabase = createAdminClient();
  const { data: chars } = await supabase.from('characters').select('id, name, slug').ilike('name', '%Sanji%');
  console.log('Sanji matches:', chars);
  process.exit(0);
}
checkSanji();
