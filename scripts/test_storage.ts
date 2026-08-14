import { createAdminClient } from '../lib/supabase/admin';

async function checkStorageAndDb() {
  const supabase = createAdminClient();

  console.log('--- Listing Supabase Storage Buckets ---');
  try {
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
      console.error('Bucket list error:', bErr);
    } else {
      console.log('Buckets:', buckets?.map(b => ({ name: b.name, id: b.id, public: b.public })));
    }
  } catch (e: any) {
    console.error('Storage catch error:', e.message);
  }

  console.log('--- Checking DB tables related to backgrounds ---');
  try {
    const { data: bgData, error: bgErr } = await supabase.from('backgrounds').select('*').limit(5);
    if (bgErr) {
      console.log('Table "backgrounds" error:', bgErr.message);
    } else {
      console.log('Table "backgrounds" data count:', bgData?.length);
    }
  } catch (e: any) {
    console.error('DB catch error:', e.message);
  }

  process.exit(0);
}

checkStorageAndDb().catch(e => {
  console.error(e);
  process.exit(1);
});
