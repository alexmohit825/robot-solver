import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.resolve(__dirname, '../public/icon.svg');
const publicDir = path.resolve(__dirname, '../public');

async function generatePngs() {
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'apple-touch-icon-precomposed.png', size: 180 },
    { file: 'apple-touch-icon-180x180.png', size: 180 },
    { file: 'apple-touch-icon-512x512.png', size: 512 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'favicon-192x192.png', size: 192 },
    { file: 'pwa-512x512.png', size: 512 }
  ];

  for (const t of targets) {
    const destPath = path.join(publicDir, t.file);
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(destPath);
    console.log(`Generated: ${t.file} (${t.size}x${t.size})`);
  }

  console.log('All Apple Touch PNG icons successfully generated!');
}

generatePngs().catch(console.error);
