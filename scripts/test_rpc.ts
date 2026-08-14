import { createAdminClient } from '../lib/supabase/admin';

async function checkRpc() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('create_bucket', { bucket_name: 'backgrounds' });
  console.log('rpc result:', { data, error: error?.message });
  process.exit(0);
}

checkRpc().catch(e => {
  console.error(e);
  process.exit(1);
});
