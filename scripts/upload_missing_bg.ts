import { createAdminClient } from '../lib/supabase/admin';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function uploadMissing() {
  const supabase = createAdminClient();
  const bgDir = path.join(process.cwd(), 'public', 'backgrounds');

  const missing = [
    { file: 'bg1.jpg', target: 'bg1.webp' },
    { file: 'bg2.png', target: 'bg2.webp' },
  ];

  for (const m of missing) {
    const inputPath = path.join(bgDir, m.file);
    const buf = await sharp(inputPath)
      .resize({ width: 2560, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const { error } = await supabase.storage
      .from('backgrounds')
      .upload(m.target, buf, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) console.error(`Error uploading ${m.target}:`, error.message);
    else console.log(`✓ Uploaded ${m.target}`);
  }

  process.exit(0);
}

uploadMissing().catch(console.error);
