import fs from 'fs';
import path from 'path';

const bgDir = path.join(process.cwd(), 'public', 'backgrounds');
const files = fs.readdirSync(bgDir);

console.log(`Found ${files.length} background files:`);
files.forEach((f) => {
  const stat = fs.statSync(path.join(bgDir, f));
  console.log(`- ${f}: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
});
