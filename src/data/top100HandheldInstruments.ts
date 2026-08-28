import { HandheldInstrument, HandheldCategory, BlueprintDiagramType } from '../types';

const SEED_HANDHELD: Partial<HandheldInstrument>[] = [
  // 1. Suctions & Fluidics
  {
    rank: 1,
    title: 'Bayoneted Teardrop-Regulated Anti-Clog Frazier Suction Wand',
    category: 'Suctions & Fluidic Scavengers',
    primaryTarget: 'MIS Tubular Lumbar Discectomy & Transsphenoidal Skull Base',
    machiningMethod: 'CNC Swiss Lathe + Mandrel Tube Bending + Electro-Polished ID (ASTM F899 316L Stainless)',
    estimatedPrototypingCost: '$350 - $650',
    prototypingLeadTimeDays: 14,
    clinicalAdvantage: 'Stops instantaneous suction clogging from bone dust sludge while clearing the exoscope line-of-sight.',
    mechanicalInnovation: 'Includes an internal coaxial bypass lumen and an elongated teardrop vacuum control port with +35° bayonet step.',
    ergonomicHandpieceDesign: 'Knurled textured titanium thumb-pad with micro-venturi flow regulator.',
    materials: 'Medical 316L Stainless Steel with Matte Bead-Blasted Finish',
    patentStrategy: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)',
    blueprint: {
      partNumber: 'HHI-SUC-001-REV-A',
      materialSpec: 'ASTM F899 Type 316L Stainless Steel Seamless Tube',
      finish: 'Matte Satin Bead-Blast (Ra 0.4 µm) with Electro-Polished Bore',
      scale: '1:1',
      diagramType: 'frazier_suction',
      views: ['Isometric 3D', 'Side Elevation', 'Plan View', 'Section A-A'],
      dimensions: [
        { label: 'Overall Working Reach (L1)', value: '135.00 mm', tolerance: '±0.20 mm' },
        { label: 'Bayonet Step Height (H1)', value: '32.00 mm', tolerance: '±0.50 mm' },
        { label: 'Distal Outer Diameter (OD)', value: '2.67 mm (8 French)', tolerance: '±0.03 mm' },
        { label: 'Internal Bore ID (D_in)', value: '1.95 mm', tolerance: '±0.02 mm' },
        { label: 'Teardrop Vent Length (L2)', value: '12.50 mm', tolerance: '±0.10 mm' }
      ],
      criticalFeatures: [
        'Seamless hydro-bent 35° bayonet transition with zero wall thinning',
        'Electro-chemically deburred distal suction eyelet with radiused perimeter (R 0.3mm)',
        'Standard ACMI/Luer taper suction barb with anti-slip hex grip'
      ]
    }
  },
  // 2. Rongeurs & Micro-Punches
  {
    rank: 2,
    title: 'Zero-Ejection-Failure Take-Apart Micro-Kerrison Rongeur (1mm / 40° Up-Bite)',
    category: 'Rongeurs & Micro-Punches',
    primaryTarget: 'Cervical Foraminotomy & Lumbar Recess Decompression',
    machiningMethod: 'Wire-EDM + 5-Axis CNC Milling + Vacuum Hardening (Custom 455 Stainless Steel)',
    estimatedPrototypingCost: '$850 - $1,400',
    prototypingLeadTimeDays: 21,
    clinicalAdvantage: 'Prevents bone chips from jamming inside the shaft; releases without tools in 2 seconds for complete OR sterilization.',
    mechanicalInnovation: 'Spring-loaded sliding ejector pin integrated into top cutting bar with quick-release rotational pivot pin.',
    ergonomicHandpieceDesign: 'Gold-plated German palm grip with widened leverage curve reducing pinch fatigue by 40%.',
    materials: 'High-Tensile Custom 455 Stainless Steel with TiAlN Black Ceramic Cutting Footplate',
    patentStrategy: 'RECOMMENDED: FILE PROVISIONAL PATENT',
    blueprint: {
      partNumber: 'HHI-RON-002-REV-B',
      materialSpec: 'ASTM F899 Custom 455 Stainless Steel (52-54 HRC)',
      finish: 'Matte Passivated Satin with Black TiAlN PVD Footplate',
      scale: '1:1',
      diagramType: 'kerrison_rongeur',
      views: ['Isometric 3D', 'Side Elevation', 'Plan View', 'Section A-A'],
      dimensions: [
        { label: 'Shaft Length (L1)', value: '180.00 mm', tolerance: '±0.10 mm' },
        { label: 'Footplate Thickness (T1)', value: '0.95 mm', tolerance: '±0.02 mm' },
        { label: 'Bite Width (W1)', value: '1.50 mm', tolerance: '±0.03 mm' },
        { label: 'Cutting Angle (A1)', value: '40.0° Up-Bite', tolerance: '±0.25°' },
        { label: 'Grip Span (S1)', value: '85.00 mm', tolerance: '±0.50 mm' }
      ],
      criticalFeatures: [
        'Wire-EDM cut footplate with 0.05mm razor cutting clearance',
        'Tool-less quarter-turn take-apart bayonet hinge pin for rapid autoclaving',
        'Integrated internal micro-ejector bar that automatically expels bone punch on handle release'
      ]
    }
  },
  // 3. Probes & Micro-Dissectors
  {
    rank: 3,
    title: 'Bayoneted Ball-Tip Nerve Root Hook with Integrated Neuro-Stimulation Port',
    category: 'Probes & Micro-Dissectors',
    primaryTarget: 'MIS Transforaminal & Endoscopic Lumbar Discectomy',
    machiningMethod: 'CNC Swiss Screw Turning + Micro-Laser Welding (Grade 5 Titanium / PEEK)',
    estimatedPrototypingCost: '$400 - $750',
    prototypingLeadTimeDays: 14,
    clinicalAdvantage: 'Allows the surgeon to palpate the pedicle wall and test EMG nerve proximity with the same tool without instrument swaps.',
    mechanicalInnovation: 'Insulated titanium shank with a 90° 1.5mm micro-ball tip wired directly to standard intraoperative EMG monitoring jack.',
    ergonomicHandpieceDesign: 'Hexagonal balanced pencil grip with silicone tactile reference flat.',
    materials: 'Grade 5 Titanium Core with Polyimide Dielectric Insulation',
    patentStrategy: 'RECOMMENDED: FILE PROVISIONAL PATENT',
    blueprint: {
      partNumber: 'HHI-PRB-003-REV-A',
      materialSpec: 'ASTM F136 Ti-6Al-4V ELI + Medical Polyimide Sleeve',
      finish: 'Dielectric Blue Anodized Handle with Exposed 1.5mm Ball Tip',
      scale: '1:1',
      diagramType: 'probe_dissector',
      views: ['Isometric 3D', 'Side Elevation', 'Plan View'],
      dimensions: [
        { label: 'Total Length (L1)', value: '210.00 mm', tolerance: '±0.20 mm' },
        { label: 'Bayonet Offset (H1)', value: '35.00 mm', tolerance: '±0.50 mm' },
        { label: 'Ball Tip Radius (R1)', value: '0.75 mm (1.5mm Ball)', tolerance: '±0.02 mm' },
        { label: 'Hook Angle (A1)', value: '90.0°', tolerance: '±0.5°' }
      ],
      criticalFeatures: [
        'Hermetically sealed laser-welded connector pin in rear handle',
        'High-voltage 1.5kV dielectric insulation rated for monopolar threshold testing',
        'Atraumatic mirror-polished spherical ball tip with zero sharp burrs'
      ]
    }
  },
  // 4. Bipolar & Electrosurgical Tools
  {
    rank: 4,
    title: 'Non-Stick Silver-Alloy Bayonet Bipolar Forceps with Coaxial Micro-Irrigation',
    category: 'Bipolar & Electrosurgical Tools',
    primaryTarget: 'Aneurysm Clipping, Acoustic Neuroma & Intramedullary Cord Resection',
    machiningMethod: 'Stamping + Precision Silver Cladding + Laser Micro-Welding',
    estimatedPrototypingCost: '$550 - $950',
    prototypingLeadTimeDays: 18,
    clinicalAdvantage: 'Completely eliminates tissue sticking and eschar buildup during microvascular coagulation while clearing operative exoscope view.',
    mechanicalInnovation: 'Solid silver-copper alloy tips with high thermal conductivity and an integrated 0.5mm micro-saline irrigation drip tube.',
    ergonomicHandpieceDesign: 'Fluted bayonet spring tines with balanced pinch weight < 0.35 N.',
    materials: 'High-Conductivity Ag-Cu Clad Alloy with Autoclavable Polymer Body',
    patentStrategy: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)',
    blueprint: {
      partNumber: 'HHI-BIP-004-REV-C',
      materialSpec: 'ASTM F899 Stainless Base with Solid Ag-Cu Tip Inlay',
      finish: 'Black Electrostatically Coated Insulation with High-Luster Silver Tips',
      scale: '1:1',
      diagramType: 'bayonet_bipolar',
      views: ['Isometric 3D', 'Side Elevation', 'Plan View', 'Section A-A'],
      dimensions: [
        { label: 'Total Length (L1)', value: '200.00 mm', tolerance: '±0.25 mm' },
        { label: 'Bayonet Offset (H1)', value: '40.00 mm', tolerance: '±0.50 mm' },
        { label: 'Tip Width (W1)', value: '0.50 mm Micro-Point', tolerance: '±0.02 mm' },
        { label: 'Tine Opening Gap (G1)', value: '10.00 mm', tolerance: '±0.50 mm' },
        { label: 'Irrigation Tube ID', value: '0.45 mm', tolerance: '±0.02 mm' }
      ],
      criticalFeatures: [
        'Solid thermal heat-pipe silver tip preventing protein coagulation adhesion',
        'Coaxial laser-tacked micro-saline cannula terminating 2.0mm behind active tip',
        'Universal 2-pin gold-plated electro-cautery connector'
      ]
    }
  },
  // 5. Handheld Retractors & Specula
  {
    rank: 5,
    title: 'Self-Retaining Micro-Nerve Root Spatula Retractor with Fiber-Optic Channel',
    category: 'Handheld Retractors & Specula',
    primaryTarget: 'MIS Lumbar Discectomy & Cervical Posterior Foraminotomy',
    machiningMethod: 'CNC Sheet Metal Laser Cutting + CNC Forming + Fiber-Coupler Fitting',
    estimatedPrototypingCost: '$300 - $600',
    prototypingLeadTimeDays: 12,
    clinicalAdvantage: 'Protects traversing nerve root while casting 15,000 lux cold spot illumination directly on the extruded disc herniation.',
    mechanicalInnovation: 'Atraumatic rolled-edge spatula blade with an integrated 1.0mm polymer fiber-optic clip groove and flexible table-lock stay ring.',
    ergonomicHandpieceDesign: 'Teardrop skeletonized finger handle with friction lock ring.',
    materials: 'ASTM F136 Grade 5 Titanium with Bead-Blasted Anti-Glare Finish',
    patentStrategy: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)',
    blueprint: {
      partNumber: 'HHI-RET-005-REV-A',
      materialSpec: 'ASTM F136 Ti-6Al-4V ELI (Grade 5 Titanium)',
      finish: 'Matte Non-Reflective Satin Titanium Finish',
      scale: '1:1',
      diagramType: 'handheld_retractor',
      views: ['Isometric 3D', 'Side Elevation', 'Plan View'],
      dimensions: [
        { label: 'Working Reach (L1)', value: '120.00 mm', tolerance: '±0.20 mm' },
        { label: 'Spatula Blade Width (W1)', value: '5.50 mm', tolerance: '±0.05 mm' },
        { label: 'Blade Lip Curvature (R1)', value: '3.00 mm Radius', tolerance: '±0.10 mm' },
        { label: 'Fiber Channel Dia (D1)', value: '1.20 mm', tolerance: '±0.03 mm' }
      ],
      criticalFeatures: [
        'Smooth rolled atraumatic lip preventing dural abrasion under retraction',
        'Built-in fiber-optic clip-in conduit compatible with standard ACMI light cables',
        'Anti-slip serrations on posterior handle for assistant hand stability'
      ]
    }
  },
  // 6. Elevators & Curettes
  {
    rank: 6,
    title: 'Steerable Articulating Micro-Ring Curette with 90° Reverse Osteophyte Hook',
    category: 'Micro-Elevators & Curettes',
    primaryTarget: 'Anterior Cervical Uncinate Resection & Contralateral Recess Decompression',
    machiningMethod: 'Wire-EDM Ring Cutting + Hardened Custom 465 Steel Shank',
    estimatedPrototypingCost: '$650 - $1,100',
    prototypingLeadTimeDays: 16,
    clinicalAdvantage: 'Removes deep posterior vertebral osteophytes under the PLL without requiring straight-line visual axis.',
    mechanicalInnovation: 'Reverse-angled micro-cutting ring with dual cutting edges (anterior and posterior) on a rigid bayoneted offset shank.',
    ergonomicHandpieceDesign: 'Knurled hexagonal lightweight anodized aluminum handle with index finger rest.',
    materials: 'Custom 465 Stainless Steel (54 HRC) with TiN Golden Cutting Ring',
    patentStrategy: 'RECOMMENDED: FILE PROVISIONAL PATENT',
    blueprint: {
      partNumber: 'HHI-CUR-006-REV-A',
      materialSpec: 'ASTM F899 Custom 465 Stainless Steel (Hardened 54 HRC)',
      finish: 'TiN Gold PVD Coating on Active Ring / Matte Satin Shank',
      scale: '1:1',
      diagramType: 'steerable_curette',
      views: ['Isometric 3D', 'Side Elevation', 'Plan View', 'Section A-A'],
      dimensions: [
        { label: 'Shaft Length (L1)', value: '160.00 mm', tolerance: '±0.15 mm' },
        { label: 'Bayonet Offset (H1)', value: '35.00 mm', tolerance: '±0.50 mm' },
        { label: 'Ring Outer Dia (OD)', value: '3.00 mm', tolerance: '±0.03 mm' },
        { label: 'Ring Inner Dia (ID)', value: '2.10 mm', tolerance: '±0.02 mm' },
        { label: 'Hook Angle (A1)', value: '90.0° Reverse', tolerance: '±0.25°' }
      ],
      criticalFeatures: [
        'Dual-beveled ring edge cutting both in push and pull strokes',
        'Rigid bayoneted neck resisting > 8.0 Nm counter-rotational torque',
        'Anti-corrosion titanium nitride golden edge for lasting sharpness'
      ]
    }
  }
];

const HANDHELD_CATEGORIES: HandheldCategory[] = [
  'Suctions & Fluidic Scavengers',
  'Rongeurs & Micro-Punches',
  'Probes & Micro-Dissectors',
  'Bipolar & Electrosurgical Tools',
  'Handheld Retractors & Specula',
  'Micro-Elevators & Curettes'
];

function generateCompleteHandheldSuite(): HandheldInstrument[] {
  const result: HandheldInstrument[] = [];

  for (let rank = 1; rank <= 100; rank++) {
    const seed = SEED_HANDHELD.find(s => s.rank === rank);
    const catIndex = (rank - 1) % HANDHELD_CATEGORIES.length;
    const category = seed?.category || HANDHELD_CATEGORIES[catIndex];

    let diagram: BlueprintDiagramType = 'probe_dissector';
    if (category.includes('Suction')) diagram = 'frazier_suction';
    else if (category.includes('Rongeur')) diagram = 'kerrison_rongeur';
    else if (category.includes('Bipolar')) diagram = 'bayonet_bipolar';
    else if (category.includes('Retractor')) diagram = 'handheld_retractor';
    else if (category.includes('Curette')) diagram = 'steerable_curette';

    const shaftLen = 120 + ((rank * 7) % 90);
    const bayonetAng = 20 + ((rank * 3) % 25);
    const costLow = 300 + (rank % 8) * 75;
    const costHigh = costLow + 400 + (rank % 5) * 100;
    const leadTime = 12 + (rank % 16);

    const isProvisional = rank % 3 === 0;

    const item: HandheldInstrument = {
      id: `hhi-${String(rank).padStart(3, '0')}`,
      rank,
      title: seed?.title || `Precision ${category.split('&')[0].trim()} Handheld Instrument #${rank}`,
      category,
      primaryTarget: seed?.primaryTarget || 'MIS Spine Decompression & Skull Base Approaches',
      machiningMethod: seed?.machiningMethod || 'Wire-EDM + CNC Swiss Screw Lathe + Passivation (ASTM F899 Stainless)',
      estimatedPrototypingCost: seed?.estimatedPrototypingCost || `$${costLow} - $${costHigh}`,
      prototypingLeadTimeDays: seed?.prototypingLeadTimeDays || leadTime,
      clinicalAdvantage: seed?.clinicalAdvantage || `Lowers OR fatigue and eliminates instrument shadowing during microscopic spine and cranial dissection.`,
      mechanicalInnovation: seed?.mechanicalInnovation || `Features a precision +${bayonetAng}° bayonet line-of-sight offset with calibrated tactile force transmission.`,
      ergonomicHandpieceDesign: seed?.ergonomicHandpieceDesign || `Knurled hexagonal lightweight ergonomic handle balanced for delicate multi-finger control.`,
      materials: seed?.materials || `ASTM F899 Surgical Stainless Steel / Grade 5 Titanium with TiAlN Matte Finish`,
      patentStrategy: seed?.patentStrategy || (isProvisional ? 'RECOMMENDED: FILE PROVISIONAL PATENT' : 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'),
      blueprint: seed?.blueprint || {
        partNumber: `HHI-PART-${String(rank).padStart(3, '0')}-REV-1`,
        materialSpec: 'ASTM F899 Surgical Stainless Steel (48-52 HRC) / ASTM F136 Ti-6Al-4V',
        finish: 'Matte Non-Reflective Satin Finish (Ra < 0.4 µm)',
        scale: '1:1',
        diagramType: diagram,
        views: ['Isometric 3D', 'Side Elevation', 'Plan View', 'Section A-A'],
        dimensions: [
          { label: 'Working Reach (L1)', value: `${shaftLen}.00 mm`, tolerance: '±0.15 mm' },
          { label: 'Bayonet Offset (H1)', value: `${bayonetAng}.00 mm`, tolerance: '±0.50 mm' },
          { label: 'Working Tip Dimension (D1)', value: `${(1.5 + (rank % 6) * 0.4).toFixed(2)} mm`, tolerance: '±0.03 mm' },
          { label: 'Grip Handle Length (L2)', value: '105.00 mm', tolerance: '±0.25 mm' }
        ],
        criticalFeatures: [
          'High-precision EDM wire-cut cutting and grasping surfaces',
          'Autoclavable up to 134°C with passivated corrosion-resistant surface treatment',
          'Balanced center of gravity positioned directly between index and thumb pads'
        ]
      }
    };

    result.push(item);
  }

  return result;
}

export const TOP_100_HANDHELD_SUITE: HandheldInstrument[] = generateCompleteHandheldSuite();
