import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImage = 'C:\\Users\\mohal\\.gemini\\antigravity\\brain\\0539c6b6-90e5-4912-90e2-e67c2d1ba83c\\vigilor_ios_icon_1787712101302.jpg';
const publicDir = path.resolve('public');
const distDir = path.resolve('dist');

async function processIcons() {
  console.log('Generating crisp, flattened iOS touch icons for Safari...');

  const targets = [
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'apple-touch-icon-152x152.png', size: 152 },
    { name: 'apple-touch-icon-167x167.png', size: 167 },
    { name: 'apple-touch-icon-120x120.png', size: 120 },
    { name: 'apple-touch-icon-precomposed.png', size: 180 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon.ico', size: 64 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'apple-touch-icon-512x512.png', size: 512 },
  ];

  for (const t of targets) {
    const pubPath = path.join(publicDir, t.name);
    // Flatten with solid background #020617 so iOS never renders black letter fallback
    await sharp(sourceImage)
      .flatten({ background: '#020617' })
      .resize(t.size, t.size, { fit: 'cover' })
      .png()
      .toFile(pubPath);

    if (fs.existsSync(distDir)) {
      const distPath = path.join(distDir, t.name);
      await sharp(sourceImage)
        .flatten({ background: '#020617' })
        .resize(t.size, t.size, { fit: 'cover' })
        .png()
        .toFile(distPath);
    }
  }

  console.log('All iOS touch icons generated and flattened successfully.');
}

processIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
