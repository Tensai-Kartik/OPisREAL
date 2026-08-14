import { createAdminClient } from '../lib/supabase/admin';

async function checkLuffy() {
  const supabase = createAdminClient();

  const { data: chars, error } = await supabase
    .from('characters')
    .select('id, name, slug, bounty, age, height, first_appearance, first_arc, devil_fruit_name, image_url')
    .ilike('name', '%Luffy%');

  if (error) {
    console.error('Error fetching Luffy characters:', error);
    return;
  }

  console.log('Found characters matching "Luffy":', chars);
  process.exit(0);
}

checkLuffy().catch(console.error);
