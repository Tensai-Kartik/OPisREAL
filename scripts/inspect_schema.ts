import { createAdminClient } from '../lib/supabase/admin';

async function inspectSchema() {
  const supabase = createAdminClient();
  const { data: charSample, error } = await supabase.from('characters').select('*').limit(1);
  if (charSample && charSample.length > 0) {
    console.log('Columns in characters table:');
    console.log(Object.keys(charSample[0]));
    console.log('\nSample row:');
    console.log(charSample[0]);
  } else {
    console.error('Error fetching sample:', error);
  }

  const { data: evSample } = await supabase.from('character_field_evidence').select('*').limit(1);
  if (evSample && evSample.length > 0) {
    console.log('\nColumns in character_field_evidence:');
    console.log(Object.keys(evSample[0]));
  }

  process.exit(0);
}

inspectSchema().catch(console.error);
