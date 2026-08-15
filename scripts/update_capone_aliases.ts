import { createAdminClient } from '../lib/supabase/admin';

async function updateCaponeAliases() {
  const supabase = createAdminClient();

  const { data: bege } = await supabase
    .from('characters')
    .select('id, name, alias')
    .ilike('name', '%Capone Bege%')
    .single();

  if (bege) {
    const fullAlias = 'Gang Bege, Father Bege, Capone Gang Bege, Bege, Bege Capone, Godfather';
    await supabase.from('characters').update({
      alias: fullAlias,
      romanized_name: fullAlias,
      verification_status: 'verified',
      is_active: true
    }).eq('id', bege.id);

    for (const a of ['Gang Bege', 'Father Bege', 'Capone Gang Bege', 'Bege', 'Bege Capone', 'Godfather']) {
      await supabase.from('character_aliases').upsert({
        character_id: bege.id,
        alias: a,
        alias_type: 'alias'
      }, { onConflict: 'character_id,alias' });
    }
    console.log('Updated Capone Bege aliases successfully!');
  }
}

updateCaponeAliases();
