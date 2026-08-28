const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function buildSafariProofIcons() {
  const svgPath = path.join(__dirname, 'public', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Copy SVG as apple-touch-icon.svg
  fs.copyFileSync(svgPath, path.join(__dirname, 'public', 'apple-touch-icon.svg'));

  const sizes = [
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-precomposed.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'apple-touch-icon-167x167.png', size: 167 },
    { name: 'apple-touch-icon-152x152.png', size: 152 },
    { name: 'apple-touch-icon-120x120.png', size: 120 },
    { name: 'apple-touch-icon-512x512.png', size: 512 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon.ico', size: 64 }
  ];

  for (const s of sizes) {
    const outPath = path.join(__dirname, 'public', s.name);
    // Flatten onto solid #020617 background to guarantee 100% opaque RGB for iOS Safari
    await sharp(svgBuffer)
      .flatten({ background: '#020617' })
      .resize(s.size, s.size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outPath);
    console.log(`Generated solid PNG: ${s.name} (${s.size}x${s.size})`);
  }

  // Generate clean Base64 Data URI from the 180x180 touch icon
  const touchIcon180Buffer = fs.readFileSync(path.join(__dirname, 'public', 'apple-touch-icon.png'));
  const base64TouchIcon = `data:image/png;base64,${touchIcon180Buffer.toString('base64')}`;

  const favicon32Buffer = fs.readFileSync(path.join(__dirname, 'public', 'favicon-32x32.png'));
  const base64Favicon = `data:image/png;base64,${favicon32Buffer.toString('base64')}`;

  // Update public/manifest.json with absolute and relative PNG paths
  const manifestContent = {
    name: "Surgical Innovation Engine",
    short_name: "SurgicalSIE",
    description: "Surgical Innovation Engine (SIE) • Cross-Disciplinary R&D & Patent Studio",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    orientation: "any",
    icons: [
      {
        src: "apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };
  fs.writeFileSync(path.join(__dirname, 'public', 'manifest.json'), JSON.stringify(manifestContent, null, 2), 'utf8');

  // Update index.html with inline base64 icons + all fallback variants
  const indexHtmlContent = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    
    <!-- Anti-Caching Directives for Mobile Safari -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />

    <!-- 100% SAFARI-PROOF EMBEDDED APPLE TOUCH ICONS (Inline Base64 - Zero Network Dependency) -->
    <link rel="apple-touch-icon" href="${base64TouchIcon}" />
    <link rel="apple-touch-icon-precomposed" href="${base64TouchIcon}" />
    
    <!-- Resolution Specific Apple Touch Icons (Relative & Absolute) -->
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon-180x180.png" />
    <link rel="apple-touch-icon" sizes="167x167" href="./apple-touch-icon-167x167.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="./apple-touch-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="./apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon-precomposed" sizes="180x180" href="./apple-touch-icon.png" />

    <!-- Standard Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="${base64Favicon}" />
    <link rel="icon" type="image/png" sizes="192x192" href="./favicon-192x192.png" />
    <link rel="icon" type="image/svg+xml" href="./icon.svg" />
    <link rel="shortcut icon" href="./favicon.ico" />
    <link rel="manifest" href="./manifest.json" />

    <!-- iOS Safari Web App Optimization -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="SurgicalSIE" />
    <meta name="application-name" content="SurgicalSIE" />
    <meta name="theme-color" content="#020617" />
    <meta name="msapplication-TileColor" content="#020617" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Surgical Innovation Engine (SIE) | Top 100 Portfolio & Patent Studio</title>
    
    <!-- Typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-titanium-950 text-slate-100 font-sans antialiased min-h-screen selection:bg-cyan-500 selection:text-slate-950 overscroll-none">
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
`;

  fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtmlContent, 'utf8');
  console.log('INDEX.HTML COMPILED WITH SAFARI-PROOF SOLID BASE64 TOUCH ICONS');
}

buildSafariProofIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
