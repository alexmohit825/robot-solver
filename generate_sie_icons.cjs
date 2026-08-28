const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const svgPath = path.join(__dirname, 'public', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const sizes = [
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'apple-touch-icon-152x152.png', size: 152 },
    { name: 'apple-touch-icon-120x120.png', size: 120 },
    { name: 'apple-touch-icon-512x512.png', size: 512 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'favicon.ico', size: 64 }
  ];

  for (const s of sizes) {
    const outPath = path.join(__dirname, 'public', s.name);
    await sharp(svgBuffer)
      .resize(s.size, s.size)
      .png()
      .toFile(outPath);
    console.log(`Generated: ${s.name} (${s.size}x${s.size})`);
  }

  // Also copy to dist if dist exists
  const distPublic = path.join(__dirname, 'dist');
  if (fs.existsSync(distPublic)) {
    for (const s of sizes) {
      fs.copyFileSync(path.join(__dirname, 'public', s.name), path.join(distPublic, s.name));
    }
  }

  console.log('ALL ICONS GENERATED SUCCESSFULLY');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
