const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 512x512 SVG Master Icon for Robot Solver
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030712"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Radial Optical Glow -->
    <radialGradient id="opticalGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
      <stop offset="40%" stop-color="#3b82f6" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>

    <!-- Amber Glow -->
    <radialGradient id="amberGlow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>

    <!-- Metallic Gold/Cyan Stroke -->
    <linearGradient id="cyanAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>

    <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Base Dark Canvas -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)"/>
  
  <!-- Optical Glow Backdrops -->
  <circle cx="256" cy="220" r="200" fill="url(#opticalGlow)"/>
  <circle cx="256" cy="220" r="130" fill="url(#amberGlow)"/>

  <!-- Outer Precision Reticle Ring -->
  <circle cx="256" cy="220" r="180" fill="none" stroke="#1e293b" stroke-width="3" stroke-dasharray="4 8"/>
  <circle cx="256" cy="220" r="160" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-opacity="0.4"/>
  <circle cx="256" cy="220" r="120" fill="none" stroke="#06b6d4" stroke-width="2" stroke-opacity="0.6"/>

  <!-- Crosshair Axes -->
  <line x1="256" y1="50" x2="256" y2="390" stroke="#0284c7" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="6 6"/>
  <line x1="86" y1="220" x2="426" y2="220" stroke="#0284c7" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="6 6"/>

  <!-- Anatomical Vertebral Body Contour (Stylized Spine Geometry) -->
  <path d="M 190 190 C 210 170, 302 170, 322 190 C 345 215, 335 270, 310 290 C 285 305, 227 305, 202 290 C 177 270, 167 215, 190 190 Z" 
        fill="#0f172a" stroke="#38bdf8" stroke-width="3.5" fill-opacity="0.8"/>
  
  <!-- Spinal Canal Void -->
  <ellipse cx="256" cy="235" rx="35" ry="25" fill="#030712" stroke="#06b6d4" stroke-width="2" stroke-dasharray="3 3"/>

  <!-- Spinous Process (Posterior Anchor) -->
  <path d="M 245 295 L 256 345 L 267 295 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>

  <!-- Left & Right Transverse Processes -->
  <path d="M 180 205 L 120 185 L 140 225 L 175 225 Z" fill="#1e293b" stroke="#06b6d4" stroke-width="2.5"/>
  <path d="M 332 205 L 392 185 L 372 225 L 337 225 Z" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>

  <!-- Robotic Trajectory Guides (Laser Cannula Paths converging on Pedicles) -->
  <!-- Left Excelsius Cyan Trajectory -->
  <line x1="130" y1="100" x2="220" y2="215" stroke="#06b6d4" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
  <circle cx="130" cy="100" r="7" fill="#06b6d4" filter="url(#glow)"/>
  <circle cx="220" cy="215" r="5" fill="#22d3ee"/>

  <!-- Right Mazor Amber Trajectory -->
  <line x1="382" y1="100" x2="292" y2="215" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
  <circle cx="382" cy="100" r="7" fill="#f59e0b" filter="url(#glow)"/>
  <circle cx="292" cy="215" r="5" fill="#fbbf24"/>

  <!-- Target Acquisition Reticles on Bilateral Pedicles -->
  <circle cx="220" cy="215" r="14" fill="none" stroke="#22d3ee" stroke-width="2" stroke-dasharray="2 4"/>
  <circle cx="292" cy="215" r="14" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="2 4"/>

  <!-- Center Robotic Isocenter Target -->
  <circle cx="256" cy="220" r="6" fill="#10b981" filter="url(#glow)"/>
  <circle cx="256" cy="220" r="2" fill="#ffffff"/>

  <!-- Active Tracking Nodes (Triangulation Array Points) -->
  <circle cx="256" cy="90" r="6" fill="#06b6d4" stroke="#ffffff" stroke-width="1.5" filter="url(#glow)"/>
  <circle cx="150" cy="310" r="5" fill="#06b6d4" stroke="#ffffff" stroke-width="1.5"/>
  <circle cx="362" cy="310" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>

  <!-- Bottom Titanium Emblem Badge -->
  <rect x="76" y="405" width="360" height="68" rx="16" fill="url(#goldPlate)" stroke="url(#cyanAmberGrad)" stroke-width="2.5" filter="url(#glow)"/>
  <rect x="82" y="411" width="348" height="56" rx="12" fill="#030712" fill-opacity="0.95"/>

  <!-- Status Indicator Dot inside Badge -->
  <circle cx="112" cy="439" r="6" fill="#10b981" filter="url(#glow)"/>
  <circle cx="112" cy="439" r="2.5" fill="#ffffff"/>

  <!-- Bold Monospace App Title Text -->
  <text x="260" y="446" 
        font-family="system-ui, -apple-system, 'JetBrains Mono', 'Segoe UI', monospace" 
        font-size="23" 
        font-weight="900" 
        letter-spacing="4" 
        fill="#f8fafc" 
        text-anchor="middle">ROBOT SOLVER</text>
</svg>`;

async function generateIcons() {
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVG icons
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), svgContent, 'utf8');
  console.log('Saved SVG icon files.');

  // 2. Generate PNGs with sharp
  const svgBuffer = Buffer.from(svgContent);

  const targets = [
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'apple-touch-icon-180x180.png', size: 180 },
    { file: 'apple-touch-icon-167x167.png', size: 167 },
    { file: 'apple-touch-icon-152x152.png', size: 152 },
    { file: 'apple-touch-icon-120x120.png', size: 120 },
    { file: 'favicon-192x192.png', size: 192 },
    { file: 'pwa-512x512.png', size: 512 },
    { file: 'favicon-32x32.png', size: 32 }
  ];

  for (const t of targets) {
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, t.file));
    console.log(`Generated ${t.file} (${t.size}x${t.size})`);
  }

  // 3. Generate 180x180 Base64 for zero-network inline index.html embedding
  const b64_180 = await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toBuffer();
  
  const b64_180_str = b64_180.toString('base64');
  console.log('Base64 180x180 length:', b64_180_str.length);

  // Update index.html inline data URLs
  const indexPath = path.join(__dirname, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Replace apple-touch-icon hrefs with new base64
  indexHtml = indexHtml.replace(
    /href="data:image\/png;base64,[^"]+"/g,
    `href="data:image/png;base64,${b64_180_str}"`
  );

  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('Updated index.html with inline Base64 Apple Touch Icon.');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
