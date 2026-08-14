import { createAdminClient } from '../lib/supabase/admin';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function compressAndUpload() {
  console.log('=== Compressing and Uploading Backgrounds to Supabase CDN ===');
  const supabase = createAdminClient();
  const bgDir = path.join(process.cwd(), 'public', 'backgrounds');
  const outDir = path.join(process.cwd(), 'public', 'compressed_bg');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Get all files sorted
  const rawFiles = fs.readdirSync(bgDir).filter((f) => /\.(png|jpg|jpeg|avif|webp)$/i.test(f));

  // Sort logically: bg1, bg2, ... bg28
  rawFiles.sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, '') || '0', 10);
    const numB = parseInt(b.replace(/[^0-9]/g, '') || '0', 10);
    return numA - numB;
  });

  console.log(`Processing ${rawFiles.length} background images...`);

  const uploadedUrls: { id: string; filename: string; url: string; sizeKB: number }[] = [];

  for (let i = 0; i < rawFiles.length; i++) {
    const file = rawFiles[i];
    const id = `bg${i + 1}`;
    const targetFilename = `${id}.webp`;
    const inputPath = path.join(bgDir, file);
    const outputPath = path.join(outDir, targetFilename);

    console.log(`[${i + 1}/${rawFiles.length}] Compressing ${file}...`);

    // Convert to webp with max 2560px width, 85 quality
    await sharp(inputPath)
      .resize({ width: 2560, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const stat = fs.statSync(outputPath);
    const sizeKB = Math.round(stat.size / 1024);
    console.log(`  -> Compressed to ${targetFilename} (${sizeKB} KB)`);

    // Upload to Supabase Storage
    const buffer = fs.readFileSync(outputPath);
    const { error: upErr } = await supabase.storage
      .from('backgrounds')
      .upload(targetFilename, buffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (upErr) {
      console.error(`  ✖ Failed to upload ${targetFilename}:`, upErr.message);
    } else {
      const { data: pubData } = supabase.storage.from('backgrounds').getPublicUrl(targetFilename);
      console.log(`  ✓ Uploaded to Supabase CDN: ${pubData.publicUrl}`);
      uploadedUrls.push({ id, filename: targetFilename, url: pubData.publicUrl, sizeKB });
    }
  }

  // Clean up temporary compressed folder
  try {
    fs.rmSync(outDir, { recursive: true, force: true });
  } catch {}

  console.log('\n=== UPLOAD SUMMARY ===');
  console.log(`Total Uploaded to Supabase CDN: ${uploadedUrls.length} / ${rawFiles.length}`);

  // Generate updated lib/game/backgrounds.ts
  const backgroundsTsContent = `export interface GameBackground {
  id: string;
  file: string;
  supabaseUrl: string;
}

const SUPABASE_STORAGE_URL = 'https://pmlrydjsmhfvohzlhkbu.supabase.co/storage/v1/object/public/backgrounds';

export const ALL_BACKGROUNDS: GameBackground[] = [
${uploadedUrls
  .map(
    (u) =>
      `  { id: '${u.id}', file: '${u.url}', supabaseUrl: '${u.url}' },`
  )
  .join('\n')}
];

export function getRandomBackground(): GameBackground {
  const index = Math.floor(Math.random() * ALL_BACKGROUNDS.length);
  return ALL_BACKGROUNDS[index];
}
`;

  fs.writeFileSync(path.join(process.cwd(), 'lib', 'game', 'backgrounds.ts'), backgroundsTsContent);
  console.log('✓ Successfully updated lib/game/backgrounds.ts to use Supabase Storage URLs directly!');

  process.exit(0);
}

compressAndUpload().catch(console.error);
