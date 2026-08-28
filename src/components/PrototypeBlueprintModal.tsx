import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Ruler, 
  Layers, 
  CheckCircle2, 
  Copy,
  Eye,
  Maximize2
} from 'lucide-react';
import { BlueprintSpec, KinematicParameters, BlueprintDiagramType } from '../types';

interface PrototypeBlueprintModalProps {
  title: string;
  rank: number;
  category: string;
  blueprint: BlueprintSpec;
  parameters?: KinematicParameters;
  onClose: () => void;
}

export const PrototypeBlueprintModal: React.FC<PrototypeBlueprintModalProps> = ({
  title,
  rank,
  category,
  blueprint,
  parameters,
  onClose
}) => {
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'elevation' | 'plan' | 'section' | 'isometric'>('elevation');

  const shaftLength = parameters?.shaftLengthMm || 135;
  const bayonetAngle = parameters?.bayonetAngleDeg || 35;
  
  // Resolve accurate diagram type
  let diagramType: BlueprintDiagramType = blueprint.diagramType;
  if (!diagramType) {
    if (category.includes('Access') || category.includes('Retraction')) diagramType = 'pressure_retractor';
    else if (category.includes('Drill') || category.includes('Cavitation')) diagramType = 'ultrasonic_horn';
    else if (category.includes('Table') || category.includes('Positioning')) diagramType = 'dynamic_table';
    else if (category.includes('Visual') || category.includes('Optic') || category.includes('Lighting')) diagramType = 'light_pipe';
    else if (category.includes('Closure') || category.includes('Dural')) diagramType = 'dural_clip_applier';
    else if (category.includes('Suction')) diagramType = 'frazier_suction';
    else if (category.includes('Rongeur')) diagramType = 'kerrison_rongeur';
    else if (category.includes('Bipolar') || category.includes('Bovie')) diagramType = 'bayonet_bipolar';
    else if (category.includes('Retractor')) diagramType = 'handheld_retractor';
    else if (category.includes('Curette') || category.includes('Elevator')) diagramType = 'steerable_curette';
    else diagramType = 'probe_dissector';
  }

  const handleCopySpec = () => {
    const text = `
[SURGICAL CAD BLUEPRINT SPECIFICATION SHEET]
Part Number: ${blueprint.partNumber}
Device Title: Rank #${rank} - ${title}
Category: ${category}
Mechanism Architecture: ${diagramType.toUpperCase()}
Material: ${blueprint.materialSpec}
Surface Finish: ${blueprint.finish}
Scale: ${blueprint.scale}

DIMENSIONS & TOLERANCES:
${blueprint.dimensions.map(d => `• ${d.label}: ${d.value} (${d.tolerance})`).join('\n')}

CRITICAL MANUFACTURING & CNC WORKSHOP NOTES:
${blueprint.criticalFeatures.map(f => `• ${f}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Render distinct parametric CAD vector graphics based on diagramType & activeViewTab
  const renderCADDiagram = () => {
    switch (diagramType) {
      // 1. EXPANDABLE PRESSURE-RELIEF RETRACTOR
      case 'pressure_retractor':
        return (
          <g transform="translate(40, 25)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: DYNAMIC PRESSURE-RELIEF EXPANDABLE RETRACTOR CORRIDOR
            </text>
            {/* Retractor Mounting Arm & Articulation Clamp */}
            <rect x="0" y="90" width="50" height="30" rx="4" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <circle cx="25" cy="105" r="7" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1.5"/>
            <text x="25" y="135" textAnchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace">BED CLAMP</text>
            {/* Gear Rack & Expansion Drive Screw */}
            <line x1="50" y1="105" x2="160" y2="105" stroke="#00f2fe" strokeWidth="4"/>
            <line x1="60" y1="95" x2="60" y2="115" stroke="#f59e0b" strokeWidth="1.5"/>
            <line x1="80" y1="95" x2="80" y2="115" stroke="#f59e0b" strokeWidth="1.5"/>
            <line x1="100" y1="95" x2="100" y2="115" stroke="#f59e0b" strokeWidth="1.5"/>
            <line x1="120" y1="95" x2="120" y2="115" stroke="#f59e0b" strokeWidth="1.5"/>
            {/* Left Retractor Blade with Micro-PPG Sensors */}
            <path d="M 160,105 L 180,60 L 370,50 L 390,40" fill="none" stroke="#00f2fe" strokeWidth="3"/>
            <circle cx="250" cy="56" r="4" fill="#f59e0b"/>
            <circle cx="310" cy="53" r="4" fill="#f59e0b"/>
            <circle cx="370" cy="50" r="4" fill="#10b981"/>
            <text x="310" y="38" fill="#10b981" fontSize="7" fontFamily="monospace">PPG SENSORS</text>
            {/* Right Retractor Blade with Micro-Piezo Actuator */}
            <path d="M 160,105 L 180,150 L 370,160 L 390,170" fill="none" stroke="#00f2fe" strokeWidth="3"/>
            <rect x="230" y="145" width="30" height="12" rx="2" fill="#0e283e" stroke="#f59e0b" strokeWidth="1.5"/>
            <text x="245" y="172" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">PIEZO PULSE</text>
            {/* Working Corridor Ray */}
            <line x1="180" y1="105" x2="400" y2="105" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,4" opacity="0.6"/>
            {/* Dimension Lines */}
            <line x1="180" y1="30" x2="390" y2="30" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="285" y="24" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">CORRIDOR DEPTH = {shaftLength}.00 mm [±0.20]</text>
            <text x="400" y="108" fill="#00f2fe" fontSize="8" fontFamily="monospace">TARGET CORRIDOR</text>
          </g>
        );

      // 2. ULTRASONIC CAVITATION BURR & FLUIDIC VORTEX
      case 'ultrasonic_horn':
      case 'cavitation_burr':
        return (
          <g transform="translate(40, 25)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: ULTRASONIC BONE CAVITATION DISSECTOR WITH COAXIAL FLUIDIC VORTEX
            </text>
            {/* Piezo Transducer Housing */}
            <rect x="10" y="90" width="80" height="40" rx="4" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <rect x="25" y="95" width="50" height="30" fill="url(#sectionHatch)" stroke="#f59e0b" strokeWidth="1"/>
            <text x="50" y="113" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">36 kHz PIEZO</text>
            {/* Acoustic Nodal Flange */}
            <polygon points="90,95 110,85 110,135 90,125" fill="#0e283e" stroke="#00f2fe" strokeWidth="1.5"/>
            {/* Bayoneted Acoustic Horn */}
            <path d="M 110,110 L 150,110 L 190,65 L 360,65" fill="none" stroke="#00f2fe" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Coaxial Fluidic Irrigation Sleeve */}
            <path d="M 110,105 L 145,105 L 185,60 L 340,60" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2"/>
            <text x="240" y="50" fill="#38bdf8" fontSize="7" fontFamily="monospace">COLD SALINE VORTEX LUMEN</text>
            {/* Diamond-Coated Cavitation Tip */}
            <circle cx="365" cy="65" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5"/>
            <line x1="365" y1="58" x2="365" y2="72" stroke="#091829" strokeWidth="1"/>
            <line x1="358" y1="65" x2="372" y2="65" stroke="#091829" strokeWidth="1"/>
            <text x="375" y="78" fill="#f59e0b" fontSize="8" fontFamily="monospace">Ø 3.0mm DLC BURR</text>
            {/* Dimensions */}
            <line x1="190" y1="35" x2="365" y2="35" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="277" y="28" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">ACOUSTIC REACH = {shaftLength}.00 mm</text>
          </g>
        );

      // 3. DYNAMIC MULTI-AXIS SURGICAL TABLE
      case 'dynamic_table':
        return (
          <g transform="translate(40, 25)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: 6-AXIS COORDINATE-SYNCHRONIZED DYNAMIC SPINE POSITIONING TABLE
            </text>
            {/* Base Hydraulic Telescoping Column */}
            <rect x="180" y="140" width="60" height="60" rx="4" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <line x1="180" y1="170" x2="240" y2="170" stroke="#f59e0b" strokeWidth="1.5"/>
            <text x="210" y="195" textAnchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace">CNC LIFT (Z-AXIS)</text>
            {/* Central Pelvic Cradle Gimbal Hinge */}
            <circle cx="210" cy="130" r="14" fill="#0e283e" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="210" cy="130" r="5" fill="#00f2fe"/>
            <text x="210" y="115" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">6-DoF GIMBAL</text>
            {/* Thoracic Bed Segment (Lordosis Controller) */}
            <path d="M 210,130 L 70,110 L 30,115" fill="none" stroke="#00f2fe" strokeWidth="4"/>
            <rect x="40" y="95" width="120" height="15" rx="3" fill="#0e283e" stroke="#38bdf8" strokeWidth="1"/>
            <text x="100" y="90" textAnchor="middle" fill="#00f2fe" fontSize="7" fontFamily="monospace">THORACIC CRADLE</text>
            {/* Lower Extremity Segment (Psoas Drop Linkage) */}
            <path d="M 210,130 L 350,150 L 390,165" fill="none" stroke="#00f2fe" strokeWidth="4"/>
            <rect x="250" y="140" width="120" height="15" rx="3" fill="#0e283e" stroke="#f59e0b" strokeWidth="1"/>
            <text x="310" y="170" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">HIP-DROP ACTUATOR (-25°)</text>
            {/* Navigation Optical Encoders */}
            <circle cx="70" cy="110" r="5" fill="#10b981"/>
            <circle cx="350" cy="150" r="5" fill="#10b981"/>
            <text x="350" y="135" fill="#10b981" fontSize="7" fontFamily="monospace">NAV ENCODER</text>
          </g>
        );

      // 4. TOTAL INTERNAL REFLECTION (TIR) LIGHT-PIPE RING
      case 'light_pipe':
        return (
          <g transform="translate(40, 25)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: COAXIAL TIR 360° SHADOWLESS LIGHT-PIPE RING & WAVEGUIDE
            </text>
            {/* Laser Diode / Fiber Coupler Ferrule */}
            <rect x="20" y="95" width="45" height="30" rx="3" fill="#091829" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="42" cy="110" r="6" fill="#f59e0b"/>
            <text x="42" y="138" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">FIBER COUPLER</text>
            {/* Waveguide Transmission Core */}
            <path d="M 65,110 L 140,110 L 180,75 L 360,75" fill="none" stroke="#00f2fe" strokeWidth="5"/>
            <path d="M 65,110 L 140,110 L 180,145 L 360,145" fill="none" stroke="#00f2fe" strokeWidth="5"/>
            {/* Internal Optical Reflection Rays */}
            <path d="M 70,110 L 100,105 L 130,115 L 160,95 L 220,75 L 260,78 L 300,75" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2"/>
            <path d="M 70,110 L 100,115 L 130,105 L 160,125 L 220,145 L 260,142 L 300,145" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2"/>
            {/* 360° Circular Distal Micro-Lens Diffuser Bezel */}
            <ellipse cx="360" cy="110" rx="15" ry="38" fill="#0e283e" stroke="#00f2fe" strokeWidth="2"/>
            <ellipse cx="360" cy="110" rx="10" ry="25" fill="#091829" stroke="#f59e0b" strokeWidth="1.5"/>
            {/* Light Cone Projection */}
            <polygon points="360,75 420,50 420,170 360,145" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3,3"/>
            <text x="390" y="112" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">20,000 LUX COLD BEAM</text>
            <line x1="180" y1="40" x2="360" y2="40" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="270" y="32" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">WAVEGUIDE LENGTH = {shaftLength}.00 mm</text>
          </g>
        );

      // 5. DURAL MICRO-CLIP APPLIER
      case 'dural_clip_applier':
      case 'micro_clip':
        return (
          <g transform="translate(40, 25)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: SINGLE-TRIGGER TITANIUM ARCUATE DURAL MICRO-CLIP APPLIER
            </text>
            {/* Ergonomic Scissor Handpiece */}
            <path d="M 20,160 L 50,80 L 130,80" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            <path d="M 70,165 L 60,95 L 130,72" fill="none" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="60" cy="90" r="4" fill="#00f2fe"/>
            {/* Bayoneted Narrow Coronal Shaft */}
            <path d="M 130,80 L 160,50 L 375,50" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            {/* Internal Micro-Clip Cartridge Feed Channel */}
            <line x1="130,72" x2="160,45" stroke="#f59e0b" strokeWidth="1"/>
            <line x1="160,45" x2="370,45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
            {/* U-Shaped Arcuate Micro-Clips in Track */}
            <path d="M 240,43 Q 244,40 248,43" fill="none" stroke="#ffffff" strokeWidth="1.5"/>
            <path d="M 260,43 Q 264,40 268,43" fill="none" stroke="#ffffff" strokeWidth="1.5"/>
            <path d="M 280,43 Q 284,40 288,43" fill="none" stroke="#ffffff" strokeWidth="1.5"/>
            <text x="264" y="32" textAnchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace">CLIP CARTRIDGE</text>
            {/* Miniaturized 1.2mm Eversion Jaws */}
            <polygon points="375,50 395,46 390,50" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1"/>
            <polygon points="375,50 395,54 390,50" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1"/>
            <circle cx="395" cy="50" r="2" fill="#ffffff"/>
            <text x="400" y="53" fill="#f59e0b" fontSize="8" fontFamily="monospace">1.2mm JAWS</text>
            <line x1="160" y1="20" x2="395" y2="20" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="277" y="14" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">REACH = {shaftLength}.00 mm</text>
          </g>
        );

      // 6. KERRISON RONGEURS & MICRO-PUNCHES
      case 'kerrison_rongeur':
        return (
          <g transform="translate(40, 25)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: KERRISON RONGEUR (PUNCH PROFILE & EJECTOR PIN)
            </text>
            <path d="M 30,160 L 50,80 L 140,80 L 380,80 L 400,60" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            <path d="M 80,170 L 65,95 L 140,70 L 375,70 L 398,58" fill="none" stroke="#f59e0b" strokeWidth="2"/>
            <path d="M 45,120 Q 60,135 75,130" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2"/>
            <polygon points="400,60 415,50 415,65 400,65" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1.5"/>
            <circle cx="65" cy="88" r="5" fill="#091829" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="65" cy="88" r="2" fill="#00f2fe"/>
            <line x1="140" y1="40" x2="415" y2="40" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="277" y="32" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">SHAFT LENGTH = 180.00 mm [±0.10]</text>
            <text x="420" y="48" fill="#f59e0b" fontSize="8" fontFamily="monospace">40° UP-BITE</text>
          </g>
        );

      // 7. FRAZIER SUCTION WANDS
      case 'frazier_suction':
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: BAYONET FRAZIER SUCTION WAND WITH ANTI-CLOG BYPASS
            </text>
            <rect x="0" y="110" width="40" height="24" rx="3" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <path d="M 40,118 Q 65,100 75,118 Q 65,136 40,118 Z" fill="#0e283e" stroke="#f59e0b" strokeWidth="1.5"/>
            <ellipse cx="55" cy="118" rx="6" ry="3" fill="#091829" stroke="#00f2fe" strokeWidth="1"/>
            <text x="55" y="105" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">TEARDROP VENT</text>
            <path d="M 75,118 L 120,118 Q 140,118 155,75 L 380,75" fill="none" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round"/>
            <line x1="40" y1="122" x2="380" y2="78" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
            <circle cx="380" cy="75" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1"/>
            <line x1="120" y1="140" x2="120" y2="75" stroke="#38bdf8" strokeWidth="0.8"/>
            <text x="128" y="100" fill="#00f2fe" fontSize="8" fontFamily="monospace">+{bayonetAngle}mm STEP</text>
            <line x1="155" y1="50" x2="380" y2="50" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="267" y="42" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">REACH = {shaftLength}.00 mm [±0.20]</text>
          </g>
        );

      // 8. BAYONET BIPOLAR FORCEPS
      case 'bayonet_bipolar':
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: NON-STICK SILVER BAYONET BIPOLAR FORCEPS
            </text>
            <rect x="0" y="100" width="30" height="24" rx="2" fill="#091829" stroke="#00f2fe" strokeWidth="1.5"/>
            <circle cx="15" cy="107" r="3" fill="#f59e0b"/>
            <circle cx="15" cy="117" r="3" fill="#f59e0b"/>
            <path d="M 30,105 L 100,100 L 140,60 L 360,68" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            <path d="M 30,119 L 100,124 L 140,78 L 360,70" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            <path d="M 30,95 L 95,95 L 135,55 L 340,64" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2"/>
            <polygon points="360,67 385,68 385,70 360,71" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5"/>
            <text x="388" y="72" fill="#f59e0b" fontSize="8" fontFamily="monospace">0.5mm AG-CU TIP</text>
            <text x="240" y="45" fill="#38bdf8" fontSize="8" fontFamily="monospace">COAXIAL SALINE FLUSH</text>
          </g>
        );

      // 9. CABLE-LOCKED VERTEBRAL INSERTERS
      case 'vertebral_lock':
      case 'vertebral_inserter':
        return (
          <g transform="translate(40, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: CABLE-TENSIONED INTERLOCKING VERTEBRAE IMPACTION RAM
            </text>
            <rect x="10" y="95" width="50" height="35" rx="3" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <polygon points="5,100 10,95 10,130 5,125" fill="#f59e0b"/>
            <text x="35" y="115" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">600N ANVIL</text>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => (
              <g key={idx} transform={`translate(${65 + idx * 36}, ${100 + Math.sin(idx * 0.45) * 12})`}>
                <rect x="0" y="0" width="28" height="24" rx="3" fill="#0e283e" stroke="#00f2fe" strokeWidth="1.5"/>
                <circle cx="14" cy="12" r="3" fill="#f59e0b"/>
              </g>
            ))}
            <line x1="60" y1="112" x2="360" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2"/>
            <polygon points="360,95 390,105 360,115" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1.5"/>
            <text x="210" y="145" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">HIGH-TENSILE CABLE MONOLITHIC COLUMN</text>
          </g>
        );

      // 10. PROBES, DISSECTORS & CURETTES
      default:
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              VIEW A-A: BAYONETED MICRO-DISSECTOR & NEURO-PROBE
            </text>
            <rect x="0" y="100" width="90" height="24" rx="4" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <line x1="15" y1="100" x2="15" y2="124" stroke="#f59e0b" strokeWidth="1"/>
            <line x1="45" y1="100" x2="45" y2="124" stroke="#f59e0b" strokeWidth="1"/>
            <line x1="75" y1="100" x2="75" y2="124" stroke="#f59e0b" strokeWidth="1"/>
            <line x1="90" y1="112" x2="135" y2="65" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round"/>
            <text x="110" y="80" fill="#f59e0b" fontSize="8" fontFamily="monospace">+{bayonetAngle}° OFFSET</text>
            <line x1="135" y1="65" x2="360" y2="65" stroke="#38bdf8" strokeWidth="2.5"/>
            <path d="M 360,65 L 380,65 Q 390,65 385,85" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="385" cy="85" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1"/>
            <text x="388" y="98" fill="#f59e0b" fontSize="8" fontFamily="monospace">Ø 1.5mm BALL TIP</text>
            <line x1="135" y1="45" x2="385" y2="45" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="260" y="38" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">L1 = {shaftLength}.00 mm [±0.15]</text>
          </g>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/70">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm">
              CAD
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold">
                  PROTOTYPE LINE DRAWING & CAD BLUEPRINT
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Part: {blueprint.partNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 font-mono font-bold">
                  {diagramType.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                {title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySpec}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              {copiedSpec ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSpec ? "Copied Spec" : "Copy Spec Sheet"}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Blueprint Canvas Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Technical Blueprint Viewport */}
          <div className="bg-[#0c1a2e] border-2 border-cyan-500/40 rounded-xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
            
            {/* Drafting Header Bar with Orthographic View Selector */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-cyan-400 border-b border-cyan-800/60 pb-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-bold tracking-widest uppercase">ANSI Y14.5M ENGINEERING DRAWING</span>
              </div>

              {/* View Selector Pills */}
              <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-lg border border-cyan-800/60">
                <span className="text-[10px] text-slate-400 px-1.5">VIEW:</span>
                <button
                  onClick={() => setActiveViewTab('elevation')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    activeViewTab === 'elevation' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Side Elevation
                </button>
                <button
                  onClick={() => setActiveViewTab('plan')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    activeViewTab === 'plan' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Plan (Top)
                </button>
                <button
                  onClick={() => setActiveViewTab('section')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    activeViewTab === 'section' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Section A-A
                </button>
                <button
                  onClick={() => setActiveViewTab('isometric')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    activeViewTab === 'isometric' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Isometric 3D
                </button>
              </div>

              <div className="text-cyan-300/80">
                SCALE: <span className="text-white font-bold">{blueprint.scale}</span>
              </div>
            </div>

            {/* SVG Technical Drawing Sheet */}
            <div className="w-full h-80 flex items-center justify-center relative my-2">
              <svg viewBox="0 0 720 320" className="w-full h-full text-cyan-200">
                <defs>
                  <pattern id="draftGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#132f4c" strokeWidth="0.6"/>
                  </pattern>
                  <pattern id="sectionHatch" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" stroke="#00f2fe" strokeWidth="0.8" opacity="0.4" />
                  </pattern>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 8 5 L 0 8 z" fill="#00f2fe" />
                  </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#draftGrid)" />

                {/* PRIMARY VIEW RENDERING */}
                {activeViewTab === 'elevation' && renderCADDiagram()}

                {/* PLAN VIEW (TOP-DOWN VIEW) */}
                {activeViewTab === 'plan' && (
                  <g transform="translate(60, 40)">
                    <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      VIEW B-B: PLAN (TOP-DOWN WORKING PROFILE)
                    </text>
                    <line x1="0" y1="100" x2="480" y2="100" stroke="#00f2fe" strokeWidth="0.5" strokeDasharray="8,3"/>
                    <rect x="20" y="88" width="90" height="24" rx="4" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
                    <line x1="110" y1="100" x2="380" y2="100" stroke="#00f2fe" strokeWidth="4"/>
                    <circle cx="385" cy="100" r="8" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1.5"/>
                    <line x1="110" y1="65" x2="385" y2="65" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                    <text x="247" y="58" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">WORKING SPAN = {shaftLength}.00 mm</text>
                  </g>
                )}

                {/* SECTION A-A VIEW */}
                {activeViewTab === 'section' && (
                  <g transform="translate(180, 40)">
                    <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      SECTION C-C: DISTAL TIP INTERNAL BORE & FLUIDIC CROSS-SECTION
                    </text>
                    <circle cx="160" cy="90" r="55" fill="#0e283e" stroke="#00f2fe" strokeWidth="3"/>
                    <circle cx="160" cy="90" r="30" fill="url(#sectionHatch)" stroke="#f59e0b" strokeWidth="2"/>
                    <circle cx="160" cy="90" r="14" fill="#091829" stroke="#00f2fe" strokeWidth="1.5"/>
                    <text x="160" y="165" textAnchor="middle" fill="#00f2fe" fontSize="9" fontFamily="monospace">
                      INTERNAL BORE Ø 2.10mm | OD Ø 3.40mm [±0.03]
                    </text>
                  </g>
                )}

                {/* ISOMETRIC 3D VIEW */}
                {activeViewTab === 'isometric' && (
                  <g transform="translate(160, 30)">
                    <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      VIEW D: 3D ISOMETRIC ASSEMBLY PROJECTION
                    </text>
                    <polygon points="60,50 200,20 250,60 110,90" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="3,3"/>
                    <polygon points="110,90 250,60 250,150 110,180" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="3,3"/>
                    <polygon points="60,50 110,90 110,180 60,140" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="3,3"/>
                    <path d="M 80,150 L 140,110 L 200,70 L 230,60" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
                    <circle cx="230" cy="60" r="6" fill="#00f2fe"/>
                    <text x="155" y="175" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                      3D WIREFRAME MESH
                    </text>
                  </g>
                )}

                {/* ANSI DRAFTING TITLE BLOCK */}
                <g transform="translate(20, 240)">
                  <rect x="0" y="0" width="680" height="60" fill="#091829" stroke="#00f2fe" strokeWidth="1.5"/>
                  <line x1="240" y1="0" x2="240" y2="60" stroke="#00f2fe" strokeWidth="1"/>
                  <line x1="480" y1="0" x2="480" y2="60" stroke="#00f2fe" strokeWidth="1"/>
                  <line x1="0" y1="30" x2="680" y2="30" stroke="#00f2fe" strokeWidth="0.8"/>

                  <text x="10" y="15" fill="#38bdf8" fontSize="7" fontFamily="monospace">PART NUMBER</text>
                  <text x="10" y="25" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">{blueprint.partNumber}</text>

                  <text x="10" y="45" fill="#38bdf8" fontSize="7" fontFamily="monospace">DRAWING TITLE</text>
                  <text x="10" y="55" fill="#00f2fe" fontSize="8" fontFamily="monospace" fontWeight="bold">{title.slice(0, 32)}</text>

                  <text x="250" y="15" fill="#38bdf8" fontSize="7" fontFamily="monospace">MATERIAL SPECIFICATION</text>
                  <text x="250" y="25" fill="#ffffff" fontSize="8" fontFamily="monospace">{blueprint.materialSpec.slice(0, 35)}</text>

                  <text x="250" y="45" fill="#38bdf8" fontSize="7" fontFamily="monospace">SURFACE FINISH / COATING</text>
                  <text x="250" y="55" fill="#f59e0b" fontSize="8" fontFamily="monospace">{blueprint.finish.slice(0, 35)}</text>

                  <text x="490" y="15" fill="#38bdf8" fontSize="7" fontFamily="monospace">ENGINEERING TOLERANCES</text>
                  <text x="490" y="25" fill="#ffffff" fontSize="8" fontFamily="monospace">LINEAR: ±0.05 mm | ANGULAR: ±0.5°</text>

                  <text x="490" y="45" fill="#38bdf8" fontSize="7" fontFamily="monospace">PROTOTYPE RELEASE STATUS</text>
                  <text x="490" y="55" fill="#10b981" fontSize="8" fontFamily="monospace" fontWeight="bold">APPROVED FOR CNC / WIRE-EDM (REV A)</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Blueprint Engineering Specifications Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Dimensions Table */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 font-mono text-xs">
              <h3 className="font-bold text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Ruler className="w-4 h-4" /> GEOMETRIC DIMENSIONS & TOLERANCES (GD&T)
              </h3>
              <div className="space-y-2">
                {blueprint.dimensions.map((dim, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-300">{dim.label}:</span>
                    <div className="text-right">
                      <span className="text-white font-bold">{dim.value}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5">({dim.tolerance})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Manufacturing Features */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 font-mono text-xs">
              <h3 className="font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Layers className="w-4 h-4" /> CRITICAL PROTOTYPING & CNC NOTES
              </h3>
              <ul className="space-y-2">
                {blueprint.criticalFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed text-[11px]">
                    <span className="text-cyan-400 font-bold shrink-0">[{idx + 1}]</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-500">
            Vector CAD format compatible with SolidWorks, Fusion 360, and CNC wire-EDM tooling.
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-lg flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Drawing Sheet</span>
            </button>
            <button
              onClick={handleCopySpec}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CAD Specification</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
