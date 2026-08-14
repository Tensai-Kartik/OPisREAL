import { createAdminClient } from '../../lib/supabase/admin';

export async function validateDatabase() {
  const supabase = createAdminClient();
  console.log('--- Running Data Validation Checks ---');

  const { data: chars, error } = await supabase.from('characters').select('*');
  if (error || !chars) {
    console.error('Validation failed to fetch characters:', error?.message);
    return;
  }

  let valid = 0;
  let invalid = 0;

  for (const c of chars) {
    const issues: string[] = [];
    if (!c.name) issues.push('Missing name');
    if (!c.slug) issues.push('Missing slug');
    if (c.age !== null && c.age < 0) issues.push('Negative age');
    if (c.bounty !== null && c.bounty < 0) issues.push('Negative bounty');
    if (c.height !== null && c.height <= 0) issues.push('Invalid height');

    if (issues.length > 0) {
      console.warn(`[INVALID] ${c.name || c.id}: ${issues.join(', ')}`);
      invalid++;
    } else {
      valid++;
    }
  }

  console.log(`Validation Complete: ${valid} valid characters, ${invalid} issues detected.`);
}

if (require.main === module) {
  validateDatabase().catch(console.error);
}
