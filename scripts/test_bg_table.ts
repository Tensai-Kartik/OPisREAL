import { createAdminClient } from '../lib/supabase/admin';

async function checkBackgroundsTable() {
  const supabase = createAdminClient();

  console.log('--- Checking table: backgrounds ---');
  const { data: b1, error: e1 } = await supabase.from('backgrounds').select('*').limit(1);
  console.log('backgrounds select result:', { data: b1, error: e1?.message });

  console.log('--- Checking table: game_backgrounds ---');
  const { data: b2, error: e2 } = await supabase.from('game_backgrounds').select('*').limit(1);
  console.log('game_backgrounds select result:', { data: b2, error: e2?.message });

  process.exit(0);
}

checkBackgroundsTable().catch(e => {
  console.error(e);
  process.exit(1);
});
