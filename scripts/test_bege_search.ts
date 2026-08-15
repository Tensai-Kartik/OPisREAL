import { createAdminClient } from '../lib/supabase/admin';

async function main() {
  const supabase = createAdminClient();
  const q = 'bege';

  const { data: chars, error } = await supabase
    .from('characters')
    .select('id, name, slug, japanese_name, alias, romanized_name, image_url, verification_status, bounty')
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,alias.ilike.%${q}%,romanized_name.ilike.%${q}%,japanese_name.ilike.%${q}%`)
    .order('verification_status', { ascending: false })
    .limit(15);

  console.log('Error:', error);
  console.log('CHARS length:', chars?.length);
  chars?.forEach(c => {
    console.log(`- name: "${c.name}", alias: "${c.alias}", rom: "${c.romanized_name}", jap: "${c.japanese_name}"`);
  });

  const { data: aliases } = await supabase
    .from('character_aliases')
    .select('character_id, alias, characters!inner(id, name, slug, alias, romanized_name, image_url, is_active, verification_status, bounty)')
    .ilike('alias', `%${q}%`)
    .eq('characters.is_active', true)
    .limit(15);

  console.log('ALIASES length:', aliases?.length);
  aliases?.forEach(a => {
    console.log(`- char: "${(a.characters as any)?.name}", alias: "${a.alias}"`);
  });
}

main();
