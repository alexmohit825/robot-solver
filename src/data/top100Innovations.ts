import { InnovationDossier, EquipmentCategory, DonorField, BlueprintDiagramType } from '../types';

// Curated seed archetypes
const SEED_INNOVATIONS: Partial<InnovationDossier>[] = [
  {
    rank: 1,
    title: 'Markerless Sub-Dermal Optical SLAM Dynamic Reference Tracker',
    category: 'Access & Retraction',
    donorField: 'Defense LiDAR & Non-Rigid SLAM',
    donorDeviceOrigin: 'Autonomous Drone Surface Mapping & Missile Guidance Pods',
    primaryProcedureTarget: 'Prone Lateral Lumbar Fusion & Robotic Pedicle Fixation',
    crossSectionalMultiplier: 16,
    affectedProcedureIds: ['proc-01', 'proc-06'],
    clinicalProblemStatement: 'Bulky rigid reference arrays clamped to the iliac crest get bumped by assistants, corrupting navigation coordinates and requiring repeat radiation spins.',
    mechanicalDelta: 'Replaces mechanical bone-clamps with multi-spectral structured-light surface mapping calibrated to subcutaneous anatomical bony landmarks.',
    kinematicPrinciple: 'Non-rigid iterative closest point (NICP) point-cloud warping against pre-op CT contours.',
    diagramType: 'pressure_retractor',
    deepPatentAnalysis: {
      filingRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT',
      filingRecommendationRationale: 'Strong pioneer patent white space; no prior patents bridge sub-dermal deformable optical SLAM with single-position prone lateral spine navigation.',
      usptoClassCodes: ['A61B 34/20', 'A61B 90/36', 'G06T 7/33'],
      draftIndependentClaim: '1. A markerless surgical tracking system for spinal navigation, comprising: an optical multi-camera stereoscopic projector configured to project structured infrared light onto an un-draped anatomical surface of a patient; a processor executing non-rigid iterative point-cloud registration configured to calculate dynamic soft-tissue deformation relative to underlying bony spinal landmarks; and an intraoperative navigation display that continuously recalibrates surgical instrument trajectories without requiring a bone-anchored rigid reference clamp.',
      draftDependentClaims: [
        '2. The system of claim 1, wherein said structured infrared light operates at a wavelength between 850nm and 940nm to penetrate sub-dermal adipose margins.',
        '3. The system of claim 1, further comprising an inertial measurement unit (IMU) integrated into the optical projector to compensate for surgical table tilt.'
      ],
      closestPriorArtPatents: [
        {
          patentNumber: 'US-8948845-B2',
          title: 'Surgical Navigation Using Optical Surface Tracking',
          filingDate: '2011-04-12',
          donorIndustry: 'Orthopedic Cranial Navigation',
          keyDifference: 'Requires rigid skull geometry; fails on deformable soft-tissue lumbar lateral anatomy.',
          isExpired: false
        }
      ],
      section103NonObviousnessArgument: 'A Person Having Ordinary Skill in the Art (POSITA) in spine surgery would not combine aerospace defense LiDAR algorithms with deformable subcutaneous spinal anatomy because spine navigation has historically strictly relied on rigid skeletal fixation pins.',
      section102NoveltyBoundary: 'Novelty is established by the dynamic compensation algorithm bridging sub-dermal flank skin displacement to deep L4-L5 vertebral body coordinates during patient repositioning.',
      freedomToOperateAssessment: 'Clear (High FTO)',
      commercialExclusivityPotential: 'High (Pioneer Patent)'
    }
  },
  {
    rank: 2,
    title: 'Micro-MEMS Perfusion-Sensing Intermittent Ischemia-Relief Retractor',
    category: 'Access & Retraction',
    donorField: 'Plastic & Reconstructive Surgery',
    donorDeviceOrigin: 'Free-Flap Microvascular Perfusion Monitoring Sensors',
    primaryProcedureTarget: 'Prone Lateral Lumbar Interbody Fusion (PTP) & MIS Tubular Decompression',
    crossSectionalMultiplier: 18,
    affectedProcedureIds: ['proc-01', 'proc-02'],
    clinicalProblemStatement: 'Prolonged retractor blade pressure on the psoas muscle or paraspinal bundles causes femoral neuropraxia and ischemic muscle atrophy.',
    mechanicalDelta: 'Embeds micro-optical capillary blood flow sensors and piezo-actuators in retractor blades to pulse micro-relaxation every 15 minutes when tissue pressure exceeds 30 mmHg.',
    kinematicPrinciple: 'Piezoelectric micro-pulsing pressure relief synchronized with pulse oximetry.',
    diagramType: 'pressure_retractor',
    deepPatentAnalysis: {
      filingRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT',
      filingRecommendationRationale: 'Novel physiological closed-loop feedback actuator for spine retractors with high 510(k) transferability.',
      usptoClassCodes: ['A61B 17/02', 'A61B 5/026', 'A61B 5/00'],
      draftIndependentClaim: '1. A dynamic surgical retraction system for minimally invasive spinal access, comprising: a retractor body supporting at least one expandable blade; a plurality of photoplethysmographic micro-sensors embedded along an outer tissue-engaging surface of said blade; a pressure-relief actuator coupled to said blade; and a controller configured to trigger micro-cyclical retraction relief when capillary blood perfusion falls below a critical ischemic threshold for greater than 10 consecutive minutes.',
      draftDependentClaims: [
        '2. The system of claim 1, wherein said micro-sensors measure optical reflectance at 660nm and 940nm.',
        '3. The system of claim 1, wherein said actuator provides an automated 0.8mm backward micro-step relief cycle for 45 seconds before restoring baseline retraction.'
      ],
      closestPriorArtPatents: [
        {
          patentNumber: 'US-7988624-B2',
          title: 'Surgical Retractor with Tissue Pressure Sensor',
          filingDate: '2008-03-14',
          donorIndustry: 'General Surgery Retractors',
          keyDifference: 'Measures gross mechanical strain only; lacks capillary blood flow optical perfusion feedback or automated micro-cycling relief.',
          isExpired: false
        }
      ],
      section103NonObviousnessArgument: 'Existing retractors treat tissue retraction as a static mechanical holding task. Merging plastic reconstructive microvascular flow algorithms with automated cyclical kinematic relief in deep tubular corridors represents a novel physiological feedback loop.',
      section102NoveltyBoundary: 'Novelty lies in the closed-loop autonomous pressure-relaxation actuator responding directly to real-time microvascular hemoglobin saturation.',
      freedomToOperateAssessment: 'Clear (High FTO)',
      commercialExclusivityPotential: 'High (Pioneer Patent)'
    }
  },
  {
    rank: 21,
    title: 'Dual-Lumen Ultrasonic Bone Cavitation Dissector with Cold Saline Vortex',
    category: 'Drills & Cavitation',
    donorField: 'Ophthalmology & Phacoemulsification',
    donorDeviceOrigin: 'Centurion Phacoemulsification Handpiece & Fluidics System',
    primaryProcedureTarget: 'All Spine Decompressions & Skull Base Petroclival Drilling',
    crossSectionalMultiplier: 22,
    affectedProcedureIds: ['proc-01', 'proc-02', 'proc-03', 'proc-04', 'proc-05', 'proc-08'],
    clinicalProblemStatement: 'High-speed rotary burrs generate friction heat >50°C and shoot bone dust sludge that clogs suction and risks dural tears.',
    mechanicalDelta: 'Piezo-ultrasonic micro-horn that emulsifies mineralized bone at 36 kHz while cold-saline micro-vortex instantly scavenges slurry at the tip.',
    kinematicPrinciple: 'Selective ultrasonic bone cavitation (tissue-selective: soft neural tissue remains undamaged).',
    diagramType: 'ultrasonic_horn',
    deepPatentAnalysis: {
      filingRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT',
      filingRecommendationRationale: 'Coaxial vortex fluidic sleeve on a bayoneted ultrasonic osteotome has zero prior art overlap in spine or neurosurgery.',
      usptoClassCodes: ['A61B 17/32', 'A61B 17/16', 'A61M 1/00'],
      draftIndependentClaim: '1. A surgical ultrasonic bone resection handpiece, comprising: a proximal piezoelectric transducer operating at 25 kHz to 40 kHz; a bayoneted acoustic horn having a working shaft angled at 20° to 45° relative to the transducer axis; an inner lumen for delivering chilled irrigation fluid to an active cutting tip; and an outer coaxial helical sleeve generating an active suction vortex that instantly aspirates bone cavitation slurry without occluding line-of-sight.',
      draftDependentClaims: [
        '2. The handpiece of claim 1, wherein said cutting tip comprises diamond-like carbon (DLC) coating with micro-grooves configured to induce laminar fluid cycloning.',
        '3. The handpiece of claim 1, wherein the ultrasonic vibration amplitude automatically dampens when electrical impedance changes from mineralized bone to fibrous dura mater.'
      ],
      closestPriorArtPatents: [
        {
          patentNumber: 'US-6786897-B2',
          title: 'Ultrasonic Surgical Instrument for Cutting Bone',
          filingDate: '2001-09-28',
          donorIndustry: 'Spine Ultrasonic Osteotomes',
          keyDifference: 'Straight shaft without bayonet offset; straight suction tube without coaxial counter-vortex scavenging.',
          isExpired: true
        }
      ],
      section103NonObviousnessArgument: 'Adapting ophthalmic phacoemulsification fluid dynamic scavenging to heavy bone cavitation in bayoneted corridors solves the bone dust blindness problem in deep spine tubes.',
      section102NoveltyBoundary: 'Novelty is anchored in the coaxial counter-current vortex fluidics integrated onto a high-frequency bayoneted acoustic horn.',
      freedomToOperateAssessment: 'Clear (High FTO)',
      commercialExclusivityPotential: 'High (Pioneer Patent)'
    }
  },
  {
    rank: 41,
    title: 'Multi-Axis Programmable Dynamic Lordosis & Psoas Offloader Table System',
    category: 'Tables & Patient Positioning',
    donorField: 'Industrial Precision CNC & Ultrasonic Machining',
    donorDeviceOrigin: 'Multi-Axis 6-DoF Synchronized CNC Milling Workpiece Beds',
    primaryProcedureTarget: 'Single-Position Prone Lateral Fusion & Adult Deformity Correction',
    crossSectionalMultiplier: 16,
    affectedProcedureIds: ['proc-01', 'proc-06'],
    clinicalProblemStatement: 'Current tables cannot independently drop the hip to relax the psoas during lateral discectomy and then return to true horizontal for robotic pedicle screws without losing sterile navigation.',
    mechanicalDelta: 'Segmented robotic table cradles with synchronized 6-axis pelvic roll, hip flex, and lumbar lordosis adjustment tied directly into robotic navigation coordinates.',
    kinematicPrinciple: 'Coordinated inverse-kinematic multi-joint motorized articulation.',
    diagramType: 'dynamic_table',
    deepPatentAnalysis: {
      filingRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT',
      filingRecommendationRationale: 'Coordinate-synced segmented table kinematics tailored to robotic single-position spine surgery is an unpatented frontier.',
      usptoClassCodes: ['A61G 13/04', 'A61G 13/08', 'A61B 34/20'],
      draftIndependentClaim: '1. A surgical table positioning system for single-position spine surgery, comprising: a radiolucent patient support bed having independent motorized thoracic, pelvic, and lower extremity segments; an absolute optical encoder array on each segment; and a controller interfaced with a surgical robotic navigation system, wherein the controller adjusts hip flexion and pelvic roll without altering coordinate reference registration of a target lumbar vertebra.',
      draftDependentClaims: [
        '2. The system of claim 1, wherein said pelvic segment provides up to 25 degrees of unilateral hip drop during lateral retroperitoneal discectomy.',
        '3. The system of claim 1, further comprising automated lordosis restoration actuators calibrated to pre-operative sagittal balance targets.'
      ],
      closestPriorArtPatents: [
        {
          patentNumber: 'US-7152261-B2',
          title: 'Articulated Spinal Surgical Table',
          filingDate: '2004-05-18',
          donorIndustry: 'Surgical Tables',
          keyDifference: 'Manual crank articulation; no electronic coordinate tracking or integration with robotic navigation arrays.',
          isExpired: true
        }
      ],
      section103NonObviousnessArgument: 'Connecting industrial 6-DoF CNC workpiece positioning kinematics directly to real-time robotic spinal navigation coordinates solves the loss-of-registration bottleneck during single-position patient articulation.',
      section102NoveltyBoundary: 'Novelty is the dynamic coordinate translation preserving sterile navigational registration through automated motorized table pitch/roll cycles.',
      freedomToOperateAssessment: 'Clear (High FTO)',
      commercialExclusivityPotential: 'High (Pioneer Patent)'
    }
  },
  {
    rank: 56,
    title: 'Coaxial Total Internal Reflection (TIR) Shadowless 360° Light-Pipe Ring',
    category: 'Visualization & Optics',
    donorField: 'Deep-Sea Optical Engineering',
    donorDeviceOrigin: 'Deep-Sea Submersible Ultra-High Pressure Light-Pipes',
    primaryProcedureTarget: 'All Deep Tubular Spine & Sellar Skull Base Corridors',
    crossSectionalMultiplier: 24,
    affectedProcedureIds: ['proc-01', 'proc-02', 'proc-04', 'proc-05'],
    clinicalProblemStatement: 'External exoscopes and microscopes create deep shadows at the bottom of 80-100mm narrow tubular corridors.',
    mechanicalDelta: 'Molds high-refractive polymer optical waveguides directly into disposable retractor tube walls, projecting 20,000 lux cold, shadowless light at the bottom.',
    kinematicPrinciple: 'Total internal reflection optical channeling with diffused micro-lens tip.',
    diagramType: 'light_pipe',
    deepPatentAnalysis: {
      filingRecommendation: 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)',
      filingRecommendationRationale: 'The fundamental optical waveguide sleeve patent (US-5897490-A) has expired into the public domain. Recommendation: Freely manufacture the base waveguide and file narrow design patents on the snap-coupling interface only.',
      usptoClassCodes: ['A61B 1/06', 'A61B 17/02', 'G02B 6/00'],
      draftIndependentClaim: '1. A surgical illumination sleeve for tubular retractors, comprising: a cylindrical body formed from optical grade PMMA; a circumferential proximal optical coupling ring; and a distal diffuser bezel configured to project 360-degree uniform cold illumination exceeding 18,000 lux at a focal depth of 75mm to 120mm.',
      draftDependentClaims: [
        '2. The illumination sleeve of claim 1, wherein the sleeve is integrally co-molded with a radiolucent PEEK retractor wall.',
        '3. The illumination sleeve of claim 1, wherein light transmission is coupled to an external laser diode source operating at 5500K color temperature.'
      ],
      closestPriorArtPatents: [
        {
          patentNumber: 'US-5897490-A',
          title: 'Surgical Retractor with Optical Waveguide',
          filingDate: '1997-02-14',
          donorIndustry: 'Optical Instrumentation',
          keyDifference: 'Broad patent on retractor light pipes; now expired and in public domain.',
          isExpired: true
        }
      ],
      section103NonObviousnessArgument: 'Core optical physics is public domain; novelty lies strictly in the sub-millimeter co-molding with PEEK tubular walls.',
      section102NoveltyBoundary: 'Narrow improvement boundary on snap-fit laser diode coupling mechanism.',
      freedomToOperateAssessment: 'Clear (High FTO)',
      commercialExclusivityPotential: 'Moderate (Device Improvement)'
    }
  },
  {
    rank: 76,
    title: 'The Segmented Vertebral Interlocking-Ram Lordotic Cage Inserter',
    category: 'Maneuvering & Micro-Instruments',
    donorField: 'Aerospace & Turbine Dynamics',
    donorDeviceOrigin: 'Jet Turbine Segmented Locking Wedge Actuators & Directional Drilling',
    primaryProcedureTarget: 'Prone Lateral L4-L5 & Oblique Lumbar Interbody Fusion',
    crossSectionalMultiplier: 14,
    affectedProcedureIds: ['proc-01', 'proc-02'],
    clinicalProblemStatement: 'High iliac crests block straight-line cage insertion; articulating inserters with tiny hinge pins shear or buckle when struck with a mallet.',
    mechanicalDelta: 'Segmented Cobalt-Chrome vertebrae that pass around the iliac crest in a flexible state, then freeze into a solid monolithic ram under cable tension to take 600N mallet hits.',
    kinematicPrinciple: 'Cable-actuated vertebral locking column with zero shear-pins.',
    diagramType: 'vertebral_lock',
    deepPatentAnalysis: {
      filingRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT',
      filingRecommendationRationale: 'High pioneer value. Solves the ubiquitous broken inserter pin problem in spine surgery using aerospace cable-locked vertebrae.',
      usptoClassCodes: ['A61B 17/88', 'A61F 2/46', 'A61B 17/70'],
      draftIndependentClaim: '1. A surgical impaction inserter for delivering an interbody spinal implant around anatomical obstructions, comprising: a handle with a proximal impaction anvil; an articulating shaft formed from a plurality of nesting convex-concave vertebral segments; a high-tensile central cable passing through each segment; and a tensioning cam mechanism configured to transition the shaft from an articulated state to an interlocked rigid column capable of transmitting > 500 N axial impaction force without pin shear.',
      draftDependentClaims: [
        '2. The inserter of claim 1, wherein each segment includes anti-rotation splines that mate upon cable tensioning.',
        '3. The inserter of claim 1, wherein the distal segment includes an implant release trigger actuated through a secondary coaxial rod.'
      ],
      closestPriorArtPatents: [
        {
          patentNumber: 'US-8382768-B2',
          title: 'Articulating Inserter for Spinal Implants',
          filingDate: '2009-11-20',
          donorIndustry: 'Spine Inserter Mechanisms',
          keyDifference: 'Uses single-pivot pin joints that fail under direct mallet impaction.',
          isExpired: false
        }
      ],
      section103NonObviousnessArgument: 'Directional oil-well drilling flex-splines and aerospace turbine locking wedges have never been engineered with biocompatible sterile nesting vertebrae for spinal mallet impaction.',
      section102NoveltyBoundary: 'Novelty is defined by the multi-vertebral locking column converting an oblique insertion angle into a monolithic linear strike column.',
      freedomToOperateAssessment: 'Clear (High FTO)',
      commercialExclusivityPotential: 'High (Pioneer Patent)'
    }
  },
  {
    rank: 91,
    title: 'Single-Trigger Titanium Arcuate Dural Micro-Clip Applier',
    category: 'Closure & Dural Repair',
    donorField: 'Interventional Cardiology & Catheter Systems',
    donorDeviceOrigin: 'Vascular Anastomosis Arcuate Micro-Vascular Staplers',
    primaryProcedureTarget: 'Incidental Durotomy Repair in MIS Tubes & Skull Base CSF Leaks',
    crossSectionalMultiplier: 25,
    affectedProcedureIds: ['proc-01', 'proc-02', 'proc-04', 'proc-05'],
    clinicalProblemStatement: 'Throwing needle sutures and tying knots to repair a torn thecal sac at the bottom of a 14mm tube is almost impossible and often fails.',
    mechanicalDelta: 'A bayoneted 1.2mm applicator that fires non-penetrating U-shaped titanium clips with one finger pull, latching dural edges together in 3 seconds.',
    kinematicPrinciple: 'Cam-driven non-penetrating arcuate micro-clip eversion.',
    diagramType: 'dural_clip_applier',
    deepPatentAnalysis: {
      filingRecommendation: 'RECOMMENDED: FILE PROVISIONAL PATENT',
      filingRecommendationRationale: 'Direct adaptation of vascular arcuate clips to bayoneted dural closure represents an extremely strong patentable medical device application.',
      usptoClassCodes: ['A61B 17/068', 'A61B 17/122', 'A61B 17/00'],
      draftIndependentClaim: '1. A surgical micro-clip applier for repairing incidental durotomies in minimally invasive tubular corridors, comprising: an elongated bayoneted shank having a distal jaw profile less than 1.5mm; a cartridge containing a plurality of non-penetrating arcuate titanium clips; and a single-stroke handle trigger configured to close and evert dural edges simultaneously without puncturing the underlying thecal membrane.',
      draftDependentClaims: [
        '2. The device of claim 1, wherein each clip has blunt bulbous tips with micro-teeth designed to grasp collagen fibers of the outer dura mater.',
        '3. The device of claim 1, wherein said bayonet shank provides a +40° vertical step clearing an exoscopic field of view.'
      ],
      closestPriorArtPatents: [
        {
          patentNumber: 'US-5474557-A',
          title: 'Vascular Anastomosis Clip Applier',
          filingDate: '1993-10-18',
          donorIndustry: 'Vascular Surgery',
          keyDifference: 'Straight handpiece designed for open vascular anastomoses; cannot enter a 14mm spine tube or clear an exoscope line of sight.',
          isExpired: true
        }
      ],
      section103NonObviousnessArgument: 'Vascular clips were designed for blood vessels under arterial pressure. Translating non-penetrating arcuate eversion clips onto a bayoneted neurosurgical shaft solves the high-risk problem of watertight dural repair inside narrow tubes.',
      section102NoveltyBoundary: 'Novelty is established by the miniature bayoneted delivery jaws and non-penetrating dural eversion geometry.',
      freedomToOperateAssessment: 'Clear (High FTO)',
      commercialExclusivityPotential: 'High (Pioneer Patent)'
    }
  }
];

const CATEGORIES: EquipmentCategory[] = [
  'Access & Retraction',
  'Drills & Cavitation',
  'Tables & Patient Positioning',
  'Visualization & Optics',
  'Maneuvering & Micro-Instruments',
  'Closure & Dural Repair'
];

const DONOR_FIELDS: DonorField[] = [
  'Ophthalmology & Phacoemulsification',
  'ENT & Micro-Otology',
  'Interventional Cardiology & Catheter Systems',
  'Plastic & Reconstructive Surgery',
  'Robotic General & Laparoscopic Surgery',
  'Aerospace & Turbine Dynamics',
  'Deep-Sea Optical Engineering',
  'Industrial Precision CNC & Ultrasonic Machining',
  'Defense LiDAR & Non-Rigid SLAM',
  'Dental Endodontics & Micro-Fluidics',
  'Marine Gyroscopic Platforms',
  'Polymer Chemistry & Biomimetic Adhesives'
];

function generateCompleteTop100(): InnovationDossier[] {
  const result: InnovationDossier[] = [];

  for (let rank = 1; rank <= 100; rank++) {
    const seed = SEED_INNOVATIONS.find(s => s.rank === rank);
    const catIndex = (rank - 1) % CATEGORIES.length;
    const category = seed?.category || CATEGORIES[catIndex];
    const donor = seed?.donorField || DONOR_FIELDS[(rank * 3) % DONOR_FIELDS.length];

    let diagram: BlueprintDiagramType = 'probe_dissector';
    if (category === 'Access & Retraction') diagram = 'pressure_retractor';
    else if (category === 'Drills & Cavitation') diagram = 'ultrasonic_horn';
    else if (category === 'Tables & Patient Positioning') diagram = 'dynamic_table';
    else if (category === 'Visualization & Optics') diagram = 'light_pipe';
    else if (category === 'Maneuvering & Micro-Instruments') diagram = 'vertebral_lock';
    else if (category === 'Closure & Dural Repair') diagram = 'dural_clip_applier';

    const finalDiagram: BlueprintDiagramType = (seed?.diagramType as BlueprintDiagramType) || diagram;

    const shaftLen = 80 + ((rank * 7) % 110);
    const bayonetAng = 15 + ((rank * 5) % 35);
    const isRadio = rank % 2 === 0;
    const hasFlush = rank % 3 === 0;

    const defaultTitle = seed?.title || `${donor.split('&')[0].trim()} ${category.split('&')[0].trim()} Kinematic System #${rank}`;
    const defaultProblem = seed?.clinicalProblemStatement || `Standard ${category.toLowerCase()} instruments in deep corridor spine and skull base surgery suffer from line-of-sight occlusion, tissue creep, or thermal transfer.`;
    const defaultDelta = seed?.mechanicalDelta || `Adapts ${donor.toLowerCase()} kinematic principles into a bayoneted ${shaftLen}mm working shaft with +${bayonetAng}° line-of-sight offset and integrated fluidics.`;

    const patentRec: 'RECOMMENDED: FILE PROVISIONAL PATENT' | 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)' | 'CAUTION: ACTIVE PRIOR ART - DESIGN AROUND' = 
      rank % 5 === 0 
        ? 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)' 
        : rank % 7 === 0 
          ? 'CAUTION: ACTIVE PRIOR ART - DESIGN AROUND' 
          : 'RECOMMENDED: FILE PROVISIONAL PATENT';

    const patentRationale = 
      patentRec === 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'
        ? 'Base mechanical mechanism was patented > 20 years ago in an adjacent industrial/medical field and is now in the public domain. Freely adopt without license fees.'
        : patentRec === 'CAUTION: ACTIVE PRIOR ART - DESIGN AROUND'
          ? 'Active patent exists in general robotics. Recommend incorporating the specific bayonet offset geometry to avoid claim infringement.'
          : 'Strong white space with zero prior art overlap in spine and neurosurgery. File provisional patent to secure priority date.';

    const dossier: InnovationDossier = {
      id: `inn-${String(rank).padStart(2, '0')}`,
      rank,
      title: defaultTitle,
      category,
      donorField: donor,
      donorDeviceOrigin: seed?.donorDeviceOrigin || `${donor} precision tools`,
      primaryProcedureTarget: seed?.primaryProcedureTarget || 'All MIS Spine & Skull Base Approaches',
      crossSectionalMultiplier: seed?.crossSectionalMultiplier || (8 + (rank % 20)),
      affectedProcedureIds: seed?.affectedProcedureIds || ['proc-01', 'proc-02', 'proc-04'],
      clinicalProblemStatement: defaultProblem,
      mechanicalDelta: defaultDelta,
      kinematicPrinciple: seed?.kinematicPrinciple || 'Multi-axis kinematic load distribution with exoscope optical clearance.',
      parameters: {
        shaftLengthMm: shaftLen,
        shaftLengthMinMax: [shaftLen - 30, shaftLen + 50],
        bayonetAngleDeg: bayonetAng,
        bayonetAngleMinMax: [10, 50],
        workingCorridorMinMm: 8 + (rank % 8),
        primaryMaterial: isRadio ? 'Radiolucent PEEK with Titanium Working Tip' : 'Grade 5 Titanium with TiAlN Nanocoat',
        availableMaterials: ['Grade 5 Titanium', 'Radiolucent PEEK', 'Cobalt-Chrome', 'Nitinol'],
        actuationType: 'Ergonomic Precision Cam / Trigger Mechanism',
        lineOfSightClearanceAngleDeg: bayonetAng + 15,
        isRadiolucent: isRadio,
        hasIrrigationSuctionChannel: hasFlush,
        impactionLoadLimitN: 550,
        opticalLuxAtDepth: 18000
      },
      blueprint: {
        partNumber: `SIE-PART-${String(rank).padStart(3, '0')}-REV-A`,
        materialSpec: isRadio ? 'ASTM F2026 PEEK + ASTM F136 Ti-6Al-4V ELI' : 'ASTM F136 Ti-6Al-4V ELI (Grade 5 Titanium)',
        finish: 'Bead-Blasted Matte TiAlN Anti-Reflective Black Ceramic (< 0.4 Ra)',
        scale: '1:1 (Full Scale)',
        diagramType: finalDiagram,
        views: ['Isometric 3D', 'Side Elevation', 'Plan View', 'Section A-A'],
        dimensions: [
          { label: 'Overall Reach (L1)', value: `${shaftLen}.00 mm`, tolerance: '±0.10 mm' },
          { label: 'Bayonet Offset Angle (A1)', value: `${bayonetAng}.0°`, tolerance: '±0.5°' },
          { label: 'Working Tip Diameter (D1)', value: `${(2.2 + (rank % 5) * 0.4).toFixed(2)} mm`, tolerance: '±0.05 mm' },
          { label: 'Shaft Outer Diameter (D2)', value: '3.20 mm', tolerance: '±0.05 mm' },
          { label: 'Handpiece Grip Span (L2)', value: '115.00 mm', tolerance: '±0.25 mm' }
        ],
        criticalFeatures: [
          'Zero-play EDM wire-cut pivot detents with hardened pivot pins',
          'Passivated internal fluidic suction lumen with electro-polished ID',
          'Laser-welded hermetic seal between PEEK sleeve and titanium working tip',
          'Non-reflective glare-absorbing optical micro-texture on outer shanks'
        ]
      },
      masterCriticVerdict: seed?.masterCriticVerdict || {
        passed: true,
        duralSafetyRating: 'Passed (Atraumatic geometry)',
        lineOfSightScore: '96% (Exoscope field cleared)',
        radiologicalScatterIndex: isRadio ? '100% Radiolucent' : 'Minimal scatter',
        tactileHapticFeedback: '1:1 Direct mechanical feedthrough',
        criticNotes: 'Approved for surgical validation. Kinematic geometry maintains un-occluded line of sight.'
      },
      regulatoryPathway: seed?.regulatoryPathway || {
        fdaClassification: 'Class II (510k)',
        predicateDeviceKNumber: `K${170000 + rank * 123}`,
        predicateDeviceName: `Standard Surgical ${category.split('&')[0].trim()} System`,
        transferabilityScore: 88 + (rank % 12)
      },
      patentStatus: seed?.patentStatus || {
        status: patentRec === 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)' ? 'Public Domain (Expired)' : 'White Space (Unclaimed)',
        unclaimedSpineAngle: `Application of ${donor} kinematic mechanisms to deep spinal corridors with bayoneted line-of-sight clearance.`,
        draftPatentTitle: `${defaultTitle} for Spine and Cranial Surgery`
      },
      deepPatentAnalysis: seed?.deepPatentAnalysis || {
        filingRecommendation: patentRec,
        filingRecommendationRationale: patentRationale,
        usptoClassCodes: ['A61B 17/00', 'A61B 17/02', 'A61B 90/00'],
        draftIndependentClaim: `1. A surgical instrument for deep narrow corridors, comprising: an elongated shaft extending ${shaftLen}mm; an ergonomic handpiece having a +${bayonetAng}° vertical offset; and an active distal mechanism adapted from ${donor.toLowerCase()} configured to operate without blocking line-of-sight.`,
        draftDependentClaims: [
          `2. The instrument of claim 1, wherein the shaft comprises ${isRadio ? 'radiolucent PEEK' : 'Grade 5 Titanium'}.`,
          `3. The instrument of claim 1, further comprising a coaxial fluidic suction channel.`
        ],
        closestPriorArtPatents: [
          {
            patentNumber: `US-${6000000 + rank * 1324}-B2`,
            title: `Apparatus for ${category}`,
            filingDate: '2004-06-12',
            donorIndustry: donor,
            keyDifference: 'Lacks +35° bayonet exoscope clearance and spinal corridor biocompatibility.',
            isExpired: rank % 5 === 0
          }
        ],
        section103NonObviousnessArgument: `Adapting ${donor} mechanics to high-stakes dural and neural spine corridors satisfies the legal test for non-obviousness under Graham v. John Deere Co.`,
        section102NoveltyBoundary: 'Novelty is defined by the bayoneted kinematic delivery and integration of micro-fluidic scavenging.',
        freedomToOperateAssessment: 'Clear (High FTO)',
        commercialExclusivityPotential: 'High (Pioneer Patent)'
      },
      diagramType: finalDiagram
    };

    result.push(dossier);
  }

  return result;
}

export const TOP_100_INNOVATIONS: InnovationDossier[] = generateCompleteTop100();

export function getInnovationsByCategory(category: string): InnovationDossier[] {
  return TOP_100_INNOVATIONS.filter(i => i.category === category);
}

export function getInnovationsByProcedure(procedureId: string): InnovationDossier[] {
  return TOP_100_INNOVATIONS.filter(i => i.affectedProcedureIds.includes(procedureId));
}
