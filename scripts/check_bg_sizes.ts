import fs from 'fs';
import path from 'path';

const bgDir = path.join(process.cwd(), 'public', 'backgrounds');
const files = fs.readdirSync(bgDir);

let total = 0;
for (const f of files) {
  const sz = fs.statSync(path.join(bgDir, f)).size;
  total += sz;
  console.log(`${f}: ${(sz / 1024 / 1024).toFixed(2)} MB`);
}

console.log(`\nTotal background folder size: ${(total / 1024 / 1024).toFixed(2)} MB`);
