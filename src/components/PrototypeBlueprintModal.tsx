import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Ruler, 
  Layers, 
  CheckCircle2, 
  Copy
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

  const shaftLength = parameters?.shaftLengthMm || 135;
  const bayonetAngle = parameters?.bayonetAngleDeg || 35;
  const diagramType: BlueprintDiagramType = blueprint.diagramType || 'probe_dissector';

  const handleCopySpec = () => {
    const text = `
[SURGICAL DEVICE PROTOTYPE SPECIFICATION SHEET]
Part Number: ${blueprint.partNumber}
Device Title: Rank #${rank} - ${title}
Category: ${category}
Diagram Type: ${diagramType.toUpperCase()}
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

  // Render distinct parametric CAD vector graphics based on diagramType
  const renderCADDiagram = () => {
    switch (diagramType) {
      case 'kerrison_rongeur':
        return (
          <g transform="translate(40, 25)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VIEW A-A: KERRISON RONGEUR (PUNCH PROFILE)</text>
            {/* Lower Fixed Handle & Main Shaft */}
            <path d="M 30,160 L 50,80 L 140,80 L 380,80 L 400,60" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            {/* Upper Moveable Lever & Sliding Bar */}
            <path d="M 80,170 L 65,95 L 140,70 L 375,70 L 398,58" fill="none" stroke="#f59e0b" strokeWidth="2"/>
            {/* Handle Double Leaf Springs */}
            <path d="M 45,120 Q 60,135 75,130" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2"/>
            {/* Cutting Footplate & Razor Edge */}
            <polygon points="400,60 415,50 415,65 400,65" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1.5"/>
            {/* Take-Apart Cleaning Pivot Pin */}
            <circle cx="65" cy="88" r="5" fill="#091829" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="65" cy="88" r="2" fill="#00f2fe"/>
            {/* Dimension Lines */}
            <line x1="140" y1="40" x2="415" y2="40" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="277" y="32" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">SHAFT LENGTH = 180.00 mm [±0.10]</text>
            <text x="420" y="48" fill="#f59e0b" fontSize="8" fontFamily="monospace">40° UP-BITE</text>
          </g>
        );

      case 'frazier_suction':
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VIEW A-A: BAYONET FRAZIER SUCTION WAND</text>
            {/* Suction Handle & Luer Connector */}
            <rect x="0" y="110" width="40" height="24" rx="3" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            {/* Teardrop Vacuum Vent Pad */}
            <path d="M 40,118 Q 65,100 75,118 Q 65,136 40,118 Z" fill="#0e283e" stroke="#f59e0b" strokeWidth="1.5"/>
            <ellipse cx="55" cy="118" rx="6" ry="3" fill="#091829" stroke="#00f2fe" strokeWidth="1"/>
            <text x="55" y="105" textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">TEARDROP VENT</text>
            {/* Bayonet Vertical Offset Curve */}
            <path d="M 75,118 L 120,118 Q 140,118 155,75 L 380,75" fill="none" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round"/>
            {/* Coaxial Internal Bypass Wire */}
            <line x1="40" y1="122" x2="380" y2="78" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2"/>
            {/* Atraumatic Suction Tip */}
            <circle cx="380" cy="75" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1"/>
            {/* Dimensions */}
            <line x1="120" y1="140" x2="120" y2="75" stroke="#38bdf8" strokeWidth="0.8"/>
            <text x="128" y="100" fill="#00f2fe" fontSize="8" fontFamily="monospace">+{bayonetAngle}mm STEP</text>
            <line x1="155" y1="50" x2="380" y2="50" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="267" y="42" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">REACH = {shaftLength}.00 mm [±0.20]</text>
          </g>
        );

      case 'bayonet_bipolar':
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VIEW A-A: NON-STICK SILVER BAYONET BIPOLAR FORCEPS</text>
            {/* 2-Pin Electrical Connector Base */}
            <rect x="0" y="100" width="30" height="24" rx="2" fill="#091829" stroke="#00f2fe" strokeWidth="1.5"/>
            <circle cx="15" cy="107" r="3" fill="#f59e0b"/>
            <circle cx="15" cy="117" r="3" fill="#f59e0b"/>
            {/* Upper & Lower Spring Tines with Fluted Grips */}
            <path d="M 30,105 L 100,100 L 140,60 L 360,68" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            <path d="M 30,119 L 100,124 L 140,78 L 360,70" fill="none" stroke="#00f2fe" strokeWidth="2.5"/>
            {/* Micro-Irrigation Saline Tube */}
            <path d="M 30,95 L 95,95 L 135,55 L 340,64" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2"/>
            {/* High-Conductivity Silver Alloy Tips */}
            <polygon points="360,67 385,68 385,70 360,71" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5"/>
            <text x="388" y="72" fill="#f59e0b" fontSize="8" fontFamily="monospace">0.5mm AG-CU TIP</text>
            <text x="240" y="45" fill="#38bdf8" fontSize="8" fontFamily="monospace">COAXIAL SALINE FLUSH</text>
          </g>
        );

      case 'probe_dissector':
      case 'steerable_curette':
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VIEW A-A: BAYONETED MICRO-DISSECTOR & CURETTE</text>
            {/* Ergonomic Hexagonal Handle */}
            <rect x="0" y="100" width="90" height="24" rx="4" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <line x1="15" y1="100" x2="15" y2="124" stroke="#f59e0b" strokeWidth="1"/>
            <line x1="45" y1="100" x2="45" y2="124" stroke="#f59e0b" strokeWidth="1"/>
            <line x1="75" y1="100" x2="75" y2="124" stroke="#f59e0b" strokeWidth="1"/>
            {/* Bayonet Offset Neck */}
            <line x1="90" y1="112" x2="135" y2="65" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round"/>
            <text x="110" y="80" fill="#f59e0b" fontSize="8" fontFamily="monospace">+{bayonetAngle}° OFFSET</text>
            {/* Working Shaft */}
            <line x1="135" y1="65" x2="360" y2="65" stroke="#38bdf8" strokeWidth="2.5"/>
            {/* 90° Micro-Ball Tip Hook or Reverse Ring */}
            <path d="M 360,65 L 380,65 Q 390,65 385,85" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="385" cy="85" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1"/>
            <text x="388" y="98" fill="#f59e0b" fontSize="8" fontFamily="monospace">Ø 1.5mm BALL TIP</text>
            {/* Dimension */}
            <line x1="135" y1="45" x2="385" y2="45" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="260" y="38" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">L1 = {shaftLength}.00 mm [±0.15]</text>
          </g>
        );

      case 'handheld_retractor':
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VIEW A-A: ATRAUMATIC FIBER-ILLUMINATED SPATULA RETRACTOR</text>
            {/* Teardrop Handle Ring */}
            <circle cx="30" cy="115" r="22" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <circle cx="30" cy="115" r="14" fill="#0e283e" stroke="#38bdf8" strokeWidth="1"/>
            {/* Handle Shank & Fiber Conduit */}
            <rect x="52" y="110" width="80" height="10" rx="2" fill="#091829" stroke="#00f2fe" strokeWidth="1.5"/>
            {/* Curved Spatula Shaft */}
            <path d="M 132,115 L 240,115 Q 310,115 360,80 L 390,55" fill="none" stroke="#00f2fe" strokeWidth="3.5"/>
            {/* Rolled Atraumatic Distal Lip */}
            <path d="M 390,55 Q 405,45 398,35" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
            <text x="375" y="25" fill="#f59e0b" fontSize="8" fontFamily="monospace">ROLLED ATRAUMATIC LIP (R 3.0mm)</text>
            <text x="180" y="132" fill="#38bdf8" fontSize="8" fontFamily="monospace">1.2mm OPTICAL FIBER GROOVE</text>
          </g>
        );

      case 'vertebral_lock':
      case 'vertebral_inserter':
        return (
          <g transform="translate(40, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VIEW A-A: CABLE-TENSIONED INTERLOCKING VERTEBRAE RAM</text>
            {/* Rear Strike Anvil & Tensioner */}
            <rect x="10" y="95" width="50" height="35" rx="3" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <polygon points="5,100 10,95 10,130 5,125" fill="#f59e0b"/>
            <text x="35" y="115" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">600N ANVIL</text>
            {/* Segmented Vertebrae Locking Discs */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => (
              <g key={idx} transform={`translate(${65 + idx * 36}, ${100 + Math.sin(idx * 0.45) * 12})`}>
                <rect x="0" y="0" width="28" height="24" rx="3" fill="#0e283e" stroke="#00f2fe" strokeWidth="1.5"/>
                <circle cx="14" cy="12" r="3" fill="#f59e0b"/>
              </g>
            ))}
            {/* Tension Cable */}
            <line x1="60" y1="112" x2="360" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2"/>
            {/* Cage Gripper Head */}
            <polygon points="360,95 390,105 360,115" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1.5"/>
            <text x="210" y="145" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">HIGH-TENSILE CABLE MONOLITHIC COLUMN</text>
          </g>
        );

      default:
        return (
          <g transform="translate(50, 30)">
            <text x="0" y="-10" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">VIEW A-A: GENERAL PRECISION ORTHOGRAPHIC SCHEMATIC</text>
            <rect x="20" y="95" width="80" height="30" rx="4" fill="#091829" stroke="#00f2fe" strokeWidth="2"/>
            <line x1="100" y1="110" x2="150" y2="70" stroke="#00f2fe" strokeWidth="3"/>
            <rect x="150" y="65" width="220" height="10" rx="2" fill="#0e283e" stroke="#00f2fe" strokeWidth="2"/>
            <circle cx="370" cy="70" r="6" fill="#f59e0b"/>
            <line x1="150" y1="45" x2="370" y2="45" stroke="#38bdf8" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
            <text x="260" y="38" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">WORKING PROFILE L1 = {shaftLength}.00 mm</text>
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
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                  {diagramType.toUpperCase()}
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
            
            {/* Drafting Header Bar */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-cyan-800/60 pb-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-bold tracking-widest uppercase">ANSI Y14.5M ENGINEERING DRAWING</span>
              </div>
              <div className="text-cyan-300/80">
                SCALE: <span className="text-white font-bold">{blueprint.scale}</span> | 3RD ANGLE ORTHOGRAPHIC
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

                {/* DYNAMIC PARAMETRIC CAD GEOMETRY */}
                {renderCADDiagram()}

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
