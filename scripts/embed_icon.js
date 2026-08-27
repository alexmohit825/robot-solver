import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImage = 'C:\\Users\\mohal\\.gemini\\antigravity\\brain\\0539c6b6-90e5-4912-90e2-e67c2d1ba83c\\vigilor_ios_icon_1787712101302.jpg';
const publicDir = path.resolve('public');
const distDir = path.resolve('dist');

async function buildBulletproofIcons() {
  console.log('Generating bulletproof iOS icons...');

  // Create clean 180x180 sRGB PNG
  const icon180Buffer = await sharp(sourceImage)
    .flatten({ background: '#020617' })
    .resize(180, 180, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const base64Icon = icon180Buffer.toString('base64');
  const dataUri = `data:image/png;base64,${base64Icon}`;

  // Write files
  const fileNames = [
    'apple-touch-icon.png',
    'apple-touch-icon-180x180.png',
    'apple-touch-icon-152x152.png',
    'apple-touch-icon-167x167.png',
    'apple-touch-icon-120x120.png',
    'apple-touch-icon-precomposed.png',
    'favicon-192x192.png',
    'favicon-32x32.png',
  ];

  for (const f of fileNames) {
    fs.writeFileSync(path.join(publicDir, f), icon180Buffer);
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, f), icon180Buffer);
    }
  }

  // Inject Base64 data URI directly into index.html
  const htmlTemplate = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    
    <!-- iOS Safari Native Embedded Touch Icons (Base64 Inline - 100% Zero Network Delay) -->
    <link rel="apple-touch-icon" href="${dataUri}" />
    <link rel="apple-touch-icon-precomposed" href="${dataUri}" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />

    <!-- Standard Favicons -->
    <link rel="icon" type="image/png" sizes="180x180" href="${dataUri}" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="manifest" href="/manifest.json" />

    <!-- iOS Safari Web App Directives -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="VigilOR" />
    <meta name="theme-color" content="#020617" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <title>VigilOR | Autonomous OR Schedule Sentinel</title>
    
    <!-- Typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen selection:bg-emerald-500 selection:text-white overscroll-none">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  fs.writeFileSync(path.resolve('index.html'), htmlTemplate);
  console.log('Successfully embedded base64 icon into index.html and generated all PNG assets.');
}

buildBulletproofIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
