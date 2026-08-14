import { createAdminClient } from '../lib/supabase/admin';

async function listTables() {
  const supabase = createAdminClient();
  const tables = [
    'characters',
    'character_field_evidence',
    'character_affiliations',
    'character_occupations',
    'character_haki',
    'character_aliases',
    'game_sessions',
    'game_guesses',
    'feedbacks',
    'backgrounds',
    'game_backgrounds',
    'data_sources',
    'clues'
  ];

  for (const t of tables) {
    const { error, count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table "${t}": NOT FOUND or error (${error.message})`);
    } else {
      console.log(`Table "${t}": EXISTS (count: ${count})`);
    }
  }

  process.exit(0);
}

listTables().catch((e) => {
  console.error(e);
  process.exit(1);
});
