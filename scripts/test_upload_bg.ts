import { createAdminClient } from '../lib/supabase/admin';
import fs from 'fs';
import path from 'path';

async function testUpload() {
  const supabase = createAdminClient();

  console.log('1. Creating "backgrounds" storage bucket without custom fileSizeLimit...');
  const { data: bucket, error: bErr } = await supabase.storage.createBucket('backgrounds', {
    public: true,
  });

  if (bErr) {
    console.log('Bucket creation note:', bErr.message);
  } else {
    console.log('Created bucket:', bucket);
  }

  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('Current buckets:', buckets);

  const testFile = path.join(process.cwd(), 'public', 'backgrounds', 'bg1.jpg');
  if (fs.existsSync(testFile)) {
    const fileBuffer = fs.readFileSync(testFile);
    console.log('Uploading test file bg1.jpg (size:', fileBuffer.length, 'bytes)...');
    const { data: uploadData, error: upErr } = await supabase.storage
      .from('backgrounds')
      .upload('bg1.jpg', fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (upErr) {
      console.error('Upload error:', upErr);
    } else {
      console.log('Upload success:', uploadData);
      const { data: publicUrlData } = supabase.storage.from('backgrounds').getPublicUrl('bg1.jpg');
      console.log('Public URL:', publicUrlData.publicUrl);
    }
  }

  process.exit(0);
}

testUpload().catch((err) => {
  console.error(err);
  process.exit(1);
});
