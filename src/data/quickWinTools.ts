import { QuickWinTool, PatentRecommendation, BlueprintDiagramType } from '../types';

const SEED_QUICK_WINS: Partial<QuickWinTool>[] = [
  {
    rank: 1,
    title: 'Snap-On Anti-Glare Matte Silicone Exoscope Light-Baffle Hood',
    category: 'Vision & Anti-Glare',
    timeToORImplementation: '< 30 Days (Direct 3D Print / Off-Shelf)',
    designEffortScore: 'Low (1/5)',
    ergonomicPayoff: 'Eliminates blinding metallic glare off stainless steel retractors under 4K 3D exoscopes without buying expensive ceramic instruments.',
    immediateMechanism: 'Autoclavable medical-grade black silicone elastomer ring with micro-ribs that snaps directly over standard McCulloch or tubular retractor rims.',
    estimatedPrototypingCost: '$250 (3D SLA Mold)',
    affectedSpecialties: ['MIS Spine', 'Cranial Skull Base', 'Degenerative Spine'],
    patentRecommendation: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'
  },
  {
    rank: 2,
    title: 'Magnetic Surgical Drape Cord & Suction Management Clip Array',
    category: 'Cable & OR Flow',
    timeToORImplementation: '< 30 Days (Direct 3D Print / Off-Shelf)',
    designEffortScore: 'Low (1/5)',
    ergonomicPayoff: 'Stops drills, ultrasonic aspirator lines, bipolar cords, and suction hoses from tangling, pulling off the table, or dragging down surgeon hands.',
    immediateMechanism: 'Silicone-encapsulated neodymium magnetic clips that snap instantly onto sterile drape towel clamps with 3-groove flexible cable organizers.',
    estimatedPrototypingCost: '$150',
    affectedSpecialties: ['All Spine & Cranial Procedures'],
    patentRecommendation: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'
  },
  {
    rank: 3,
    title: 'Textured Thumb-Actuated Suction Lumen De-Clogger Stile',
    category: 'Suction & Fluidics',
    timeToORImplementation: '60 Days (Simple CNC / Silicone Mold)',
    designEffortScore: 'Minimal-Mod (2/5)',
    ergonomicPayoff: 'Clears bone-dust and blood clot clogs inside Frazier suction tips in 0.5 seconds without handing the tool off to the scrub tech for stilette clearing.',
    immediateMechanism: 'An internal spring-loaded Nitinol clearing wire actuated by a low-profile thumb slide on the suction teardrop control hole.',
    estimatedPrototypingCost: '$800',
    affectedSpecialties: ['Skull Base', 'Spine Decompression', 'Trauma'],
    patentRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT'
  },
  {
    rank: 4,
    title: 'Ergonomic Silicone Palm-Rest Offset Sleeve for Kerrison Rongeurs',
    category: 'Ergonomic Grips',
    timeToORImplementation: '< 30 Days (Direct 3D Print / Off-Shelf)',
    designEffortScore: 'Low (1/5)',
    ergonomicPayoff: 'Cuts thenar muscle cramping and median nerve compression by 50% during multi-level laminectomies by widening grip span.',
    immediateMechanism: 'Snap-on textured silicone palm grip adapter that slips over standard German-pattern rongeur handles to distribute pinch force across the full palm.',
    estimatedPrototypingCost: '$300',
    affectedSpecialties: ['Degenerative Spine', 'Deformity', 'Cervical Spine'],
    patentRecommendation: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'
  },
  {
    rank: 5,
    title: 'Magnetic Dural Tack-Up Stay Anchors for Craniotomies',
    category: 'Dural Fixation',
    timeToORImplementation: '60 Days (Simple CNC / Silicone Mold)',
    designEffortScore: 'Minimal-Mod (2/5)',
    ergonomicPayoff: 'Eliminates tedious 4-0 braided silk dural tack-up sutures; anchors the dural edge to the craniotomy bone margin in 3 seconds.',
    immediateMechanism: 'Micro-profile titanium spring tabs with sterile silicone adhesive pads that clip to the bone ledge and hold dural stay sutures under tension.',
    estimatedPrototypingCost: '$600',
    affectedSpecialties: ['Cranial Skull Base', 'Cerebrovascular', 'Neuro-Oncology'],
    patentRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT'
  },
  {
    rank: 6,
    title: 'Syringe-Loaded Precise Bone Wax Ribbon Extruder Wand',
    category: 'Suction & Fluidics',
    timeToORImplementation: '< 30 Days (Direct 3D Print / Off-Shelf)',
    designEffortScore: 'Low (1/5)',
    ergonomicPayoff: 'Stops bone wax from sticking to surgeon glove tips or rolling into deep corridors; dispenses an exact 1mm ribbon directly to bleeder bone pores.',
    immediateMechanism: 'Luer-lock curved bayonet cannula with an internal plunger screw that feeds warmed bone wax ribbon at the touch of a thumb dial.',
    estimatedPrototypingCost: '$400',
    affectedSpecialties: ['All Spine & Cranial Procedures'],
    patentRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT'
  },
  {
    rank: 7,
    title: 'Self-Adhesive Hydrogel Cottonoid Patty Locator & Retainer Strip',
    category: 'Cable & OR Flow',
    timeToORImplementation: '90 Days (Class I Registration)',
    designEffortScore: 'Minimal-Mod (2/5)',
    ergonomicPayoff: 'Prevents retained surgical patties and keeps string tags neatly indexed outside the wound margin during deep cranial/spine cases.',
    immediateMechanism: 'A sterile rail strip placed at the wound edge with numbered silicone micro-slots that organize patty strings by anatomical depth.',
    estimatedPrototypingCost: '$500',
    affectedSpecialties: ['Cranial Skull Base', 'Spine Oncology', 'Cerebrovascular'],
    patentRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT'
  },
  {
    rank: 8,
    title: 'Adjustable Bayonet Offset Adaptor for Standard Micro-Dissectors',
    category: 'Ergonomic Grips',
    timeToORImplementation: '60 Days (Simple CNC / Silicone Mold)',
    designEffortScore: 'Minimal-Mod (2/5)',
    ergonomicPayoff: 'Instantly converts any straight micro-curette or Penfield dissector into a +35° bayonet exoscope-clearing tool.',
    immediateMechanism: 'A quick-clamp titanium bayonet offset coupler with a collet lock that clamps onto any standard 2.5mm instrument shank.',
    estimatedPrototypingCost: '$750',
    affectedSpecialties: ['MIS Spine', 'Cranial Microsurgery'],
    patentRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT'
  },
  {
    rank: 9,
    title: 'Disposable Fiber-Optic Clip-On Suction Illuminator Sleeve',
    category: 'Lighting & Optical',
    timeToORImplementation: '< 30 Days (Direct 3D Print / Off-Shelf)',
    designEffortScore: 'Low (1/5)',
    ergonomicPayoff: 'Brings high-intensity cold spot lighting right to the suction tip without holding a separate light wand in 14mm tubes.',
    immediateMechanism: 'Clear optical PMMA clip sleeve that snaps onto standard #8–#10 Frazier suction tubes and couples to standard ACMI/Stryker light cables.',
    estimatedPrototypingCost: '$350',
    affectedSpecialties: ['MIS Spine', 'Endoscopic Spine', 'Pediatric Neuro'],
    patentRecommendation: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'
  },
  {
    rank: 10,
    title: 'Anti-Migration Micro-Ribbed Retractor Blade Booties',
    category: 'Ergonomic Grips',
    timeToORImplementation: '< 30 Days (Direct 3D Print / Off-Shelf)',
    designEffortScore: 'Low (1/5)',
    ergonomicPayoff: 'Stops smooth titanium retractor blades from slipping over lateral vertebral bodies during high-force discectomy.',
    immediateMechanism: 'Autoclavable textured silicone sleeve with directional chevron micro-teeth that slips over the distal 15mm of retractor blades.',
    estimatedPrototypingCost: '$200',
    affectedSpecialties: ['Lateral Lumbar Fusion', 'ACDF', 'Posterior Deformity'],
    patentRecommendation: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'
  }
];

const QUICK_WIN_CATEGORIES: ('Ergonomic Grips' | 'Vision & Anti-Glare' | 'Suction & Fluidics' | 'Dural Fixation' | 'Cable & OR Flow' | 'Lighting & Optical')[] = [
  'Ergonomic Grips',
  'Vision & Anti-Glare',
  'Suction & Fluidics',
  'Dural Fixation',
  'Cable & OR Flow',
  'Lighting & Optical'
];

function generateCompleteQuickWins(): QuickWinTool[] {
  const result: QuickWinTool[] = [];

  for (let rank = 1; rank <= 100; rank++) {
    const seed = SEED_QUICK_WINS.find(s => s.rank === rank);
    const catIndex = (rank - 1) % QUICK_WIN_CATEGORIES.length;
    const category = seed?.category || QUICK_WIN_CATEGORIES[catIndex];

    let diagram: BlueprintDiagramType = 'probe_dissector';
    if (category === 'Suction & Fluidics') diagram = 'frazier_suction';
    else if (category === 'Ergonomic Grips') diagram = 'kerrison_rongeur';
    else if (category === 'Lighting & Optical' || category === 'Vision & Anti-Glare') diagram = 'light_pipe';
    else if (category === 'Dural Fixation') diagram = 'dural_clip_applier';

    const timeOption: '< 30 Days (Direct 3D Print / Off-Shelf)' | '60 Days (Simple CNC / Silicone Mold)' | '90 Days (Class I Registration)' = 
      rank % 3 === 0 
        ? '< 30 Days (Direct 3D Print / Off-Shelf)' 
        : rank % 3 === 1 
          ? '60 Days (Simple CNC / Silicone Mold)' 
          : '90 Days (Class I Registration)';

    const designScore: 'Low (1/5)' | 'Minimal-Mod (2/5)' | 'Moderate (3/5)' = 
      rank % 3 === 0 ? 'Low (1/5)' : rank % 3 === 1 ? 'Minimal-Mod (2/5)' : 'Moderate (3/5)';

    const patentRec: PatentRecommendation = 
      rank % 4 === 0 
        ? 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)' 
        : 'RECOMMENDED: FILE PROVISIONAL PATENT';

    const tool: QuickWinTool = {
      id: `qw-${String(rank).padStart(2, '0')}`,
      rank,
      title: seed?.title || `Rapid-Adoption ${category} Modifier #${rank}`,
      category,
      timeToORImplementation: seed?.timeToORImplementation || timeOption,
      designEffortScore: seed?.designEffortScore || designScore,
      ergonomicPayoff: seed?.ergonomicPayoff || `Instantly reduces surgeon hand fatigue and improves visualization during deep spine/cranial cases with zero workflow alteration.`,
      immediateMechanism: seed?.immediateMechanism || `Snap-fit autoclavable medical polymer accessory attaching directly to standard OR equipment.`,
      estimatedPrototypingCost: seed?.estimatedPrototypingCost || `$${150 + (rank % 8) * 75}`,
      affectedSpecialties: seed?.affectedSpecialties || ['MIS Spine', 'Cranial Skull Base', 'Degenerative Spine'],
      patentRecommendation: seed?.patentRecommendation || patentRec,
      blueprint: {
        partNumber: `QW-PART-${String(rank).padStart(3, '0')}-REV-1`,
        materialSpec: 'USP Class VI Autoclavable Liquid Silicone Rubber (LSR) / ASTM F136 Ti',
        finish: 'Matte Medical Satin (Ra 0.8)',
        scale: '1:1',
        diagramType: diagram,
        views: ['Isometric 3D', 'Side Elevation', 'Plan View'],
        dimensions: [
          { label: 'Length (L)', value: `${45 + (rank % 30)} mm`, tolerance: '±0.15 mm' },
          { label: 'Inner Collet Diameter (D_in)', value: `${(2.5 + (rank % 4) * 0.5).toFixed(2)} mm`, tolerance: '±0.05 mm' },
          { label: 'Outer Diameter (D_out)', value: `${(6.0 + (rank % 4) * 0.8).toFixed(2)} mm`, tolerance: '±0.10 mm' }
        ],
        criticalFeatures: [
          'Snap-fit detent rib conforming to standard German-pattern shaft tolerances',
          'Autoclavable up to 134°C for 200 sterilizer cycles without material embrittlement',
          'High-friction ergonomic diamond-knurl surface pattern'
        ]
      }
    };

    result.push(tool);
  }

  return result;
}

export const QUICK_WIN_TOOLS: QuickWinTool[] = generateCompleteQuickWins();
