import { createAdminClient } from '../lib/supabase/admin';
import fs from 'fs';
import path from 'path';

export async function uploadBackgroundsToSupabase() {
  console.log('--- Starting Background Upload to Supabase Storage ---');
  const supabase = createAdminClient();
  const bgDir = path.join(process.cwd(), 'public', 'backgrounds');

  if (!fs.existsSync(bgDir)) {
    console.error('Directory public/backgrounds does not exist');
    return;
  }

  // 1. Ensure 'backgrounds' bucket exists
  try {
    const { error: createErr } = await supabase.storage.createBucket('backgrounds', {
      public: true,
    });
    if (createErr) {
      console.log('Bucket check/create message:', createErr.message);
    } else {
      console.log('✓ Successfully created "backgrounds" public storage bucket');
    }
  } catch (e: any) {
    console.log('Bucket check note:', e.message);
  }

  const files = fs.readdirSync(bgDir);
  console.log(`Found ${files.length} background images to process...`);

  const results: { file: string; url?: string; success: boolean; error?: string }[] = [];

  for (const file of files) {
    const filePath = path.join(bgDir, file);
    const stat = fs.statSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const contentType =
      ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.avif' ? 'image/avif' : 'application/octet-stream';

    console.log(`Uploading ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const { data, error } = await supabase.storage
        .from('backgrounds')
        .upload(file, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        console.error(`✖ Failed to upload ${file}:`, error.message);
        results.push({ file, success: false, error: error.message });
      } else {
        const { data: pubData } = supabase.storage.from('backgrounds').getPublicUrl(file);
        console.log(`✓ Uploaded ${file} -> ${pubData.publicUrl}`);
        results.push({ file, success: true, url: pubData.publicUrl });
      }
    } catch (err: any) {
      console.error(`✖ Error processing ${file}:`, err.message);
      results.push({ file, success: false, error: err.message });
    }
  }

  console.log('====================================');
  console.log('BACKGROUND UPLOAD SUMMARY');
  console.log('====================================');
  console.log(`Total files: ${files.length}`);
  console.log(`Successful:  ${results.filter((r) => r.success).length}`);
  console.log(`Failed:      ${results.filter((r) => !r.success).length}`);

  return results;
}

if (require.main === module) {
  uploadBackgroundsToSupabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
