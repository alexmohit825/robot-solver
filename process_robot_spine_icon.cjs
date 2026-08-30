const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceImagePath = 'C:/Users/mohal/.gemini/antigravity/brain/383c5d13-65df-495d-9941-a8a3b3e5b3a9/robot_holding_spine_icon_1788124843075.jpg';
const publicDir = path.join(__dirname, 'public');

async function processIcons() {
  if (!fs.existsSync(sourceImagePath)) {
    throw new Error(`Source image not found: ${sourceImagePath}`);
  }

  const targets = [
    { file: 'pwa-512x512.png', size: 512 },
    { file: 'favicon-192x192.png', size: 192 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'apple-touch-icon-180x180.png', size: 180 },
    { file: 'apple-touch-icon-167x167.png', size: 167 },
    { file: 'apple-touch-icon-152x152.png', size: 152 },
    { file: 'apple-touch-icon-120x120.png', size: 120 },
    { file: 'favicon-32x32.png', size: 32 }
  ];

  for (const t of targets) {
    const destPath = path.join(publicDir, t.file);
    await sharp(sourceImagePath)
      .resize(t.size, t.size, { fit: 'cover' })
      .png({ quality: 100 })
      .toFile(destPath);
    console.log(`Generated ${t.file} (${t.size}x${t.size})`);
  }

  // Create favicon.ico from 32x32 png
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));

  // Generate 180x180 Base64 for inline index.html embedding
  const b64_180 = await sharp(sourceImagePath)
    .resize(180, 180, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();

  const b64_180_str = b64_180.toString('base64');
  console.log(`Base64 180x180 length: ${b64_180_str.length}`);

  // Update index.html inline data URLs
  const indexPath = path.join(__dirname, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  indexHtml = indexHtml.replace(
    /href="data:image\/png;base64,[^"]+"/g,
    `href="data:image/png;base64,${b64_180_str}"`
  );

  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('Successfully updated index.html with new inline Apple Touch Icon Base64.');
}

processIcons().catch(err => {
  console.error('Error processing icons:', err);
  process.exit(1);
});
