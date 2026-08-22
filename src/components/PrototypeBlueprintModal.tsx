import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Sliders, 
  Ruler, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  FileText,
  Copy
} from 'lucide-react';
import { BlueprintSpec, KinematicParameters } from '../types';

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

  const shaftLength = parameters?.shaftLengthMm || 120;
  const bayonetAngle = parameters?.bayonetAngleDeg || 35;

  const handleCopySpec = () => {
    const text = `
[SURGICAL DEVICE PROTOTYPE SPECIFICATION SHEET]
Part Number: ${blueprint.partNumber}
Device Title: Rank #${rank} - ${title}
Category: ${category}
Material: ${blueprint.materialSpec}
Surface Finish: ${blueprint.finish}
Scale: ${blueprint.scale}

DIMENSIONS & TOLERANCES:
${blueprint.dimensions.map(d => `• ${d.label}: ${d.value} (${d.tolerance})`).join('\n')}

CRITICAL MANUFACTURING NOTES:
${blueprint.criticalFeatures.map(f => `• ${f}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  const handlePrint = () => {
    window.print();
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
            
            {/* Drafting Grid Defs */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-cyan-800/60 pb-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-bold tracking-widest uppercase">ANSI Y14.5M ENGINEERING DRAWING</span>
              </div>
              <div className="text-cyan-300/80">
                SCALE: <span className="text-white font-bold">{blueprint.scale}</span> | 3RD ANGLE PROJECTION
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
                  {/* Arrow marker for dimensions */}
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 8 5 L 0 8 z" fill="#00f2fe" />
                  </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#draftGrid)" />

                {/* VIEW 1: SIDE ELEVATION (ORTHOGRAPHIC) */}
                <g transform="translate(60, 40)">
                  <text x="0" y="-15" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">VIEW A-A: SIDE ELEVATION (WORKING PROFILE)</text>
                  
                  {/* Centerlines */}
                  <line x1="-20" y1="120" x2="380" y2="120" stroke="#00f2fe" strokeWidth="0.5" strokeDasharray="12,3,3,3" opacity="0.6"/>
                  
                  {/* Handpiece Handle */}
                  <rect x="0" y="100" width="100" height="40" rx="4" fill="#0e283e" stroke="#00f2fe" strokeWidth="2"/>
                  <rect x="15" y="105" width="70" height="30" fill="url(#sectionHatch)" />
                  <circle cx="50" cy="120" r="6" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1"/>

                  {/* Bayonet Angled Step */}
                  <line x1="100" y1="120" x2="160" y2="60" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round"/>
                  
                  {/* Working Shaft */}
                  <rect x="160" y="55" width="200" height="10" rx="2" fill="#0e283e" stroke="#00f2fe" strokeWidth="2"/>
                  
                  {/* Distal Working Tip */}
                  <path d="M 360,55 L 385,55 Q 395,60 385,65 L 360,65 Z" fill="#f59e0b" stroke="#00f2fe" strokeWidth="1.5"/>

                  {/* Dimension Extension Lines */}
                  {/* Reach L1 */}
                  <line x1="160" y1="35" x2="160" y2="50" stroke="#38bdf8" strokeWidth="0.8"/>
                  <line x1="385" y1="35" x2="385" y2="50" stroke="#38bdf8" strokeWidth="0.8"/>
                  <line x1="160" y1="40" x2="385" y2="40" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                  <text x="272" y="32" textAnchor="middle" fill="#00f2fe" fontSize="9" fontFamily="monospace" fontWeight="bold">L1 = {shaftLength}.00 mm [±0.10]</text>

                  {/* Bayonet Angle A1 */}
                  <path d="M 120,120 A 40 40 0 0 1 145,95" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <text x="145" y="115" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">+{bayonetAngle}° [±0.5°]</text>

                  {/* Handle Span L2 */}
                  <line x1="0" y1="155" x2="0" y2="142" stroke="#38bdf8" strokeWidth="0.8"/>
                  <line x1="100" y1="155" x2="100" y2="142" stroke="#38bdf8" strokeWidth="0.8"/>
                  <line x1="0" y1="150" x2="100" y2="150" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                  <text x="50" y="162" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">L2 = 100.00 mm</text>
                </g>

                {/* VIEW 2: ISOMETRIC 3D WIREFRAME */}
                <g transform="translate(500, 30)">
                  <text x="0" y="-5" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">VIEW B: ISOMETRIC 3D (ASSEMBLY)</text>
                  
                  {/* Isometric Box Frame */}
                  <polygon points="40,30 140,10 170,40 70,60" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="2,2"/>
                  <polygon points="70,60 170,40 170,110 70,130" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="2,2"/>
                  <polygon points="40,30 70,60 70,130 40,100" fill="none" stroke="#00f2fe" strokeWidth="1" strokeDasharray="2,2"/>

                  {/* Tool Rendering inside ISO frame */}
                  <path d="M 50,110 L 90,80 L 130,50 L 150,45" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="150" cy="45" r="4" fill="#00f2fe"/>
                  <text x="100" y="125" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">ISO WIREFRAME</text>
                </g>

                {/* VIEW 3: SECTION A-A CROSS SECTION */}
                <g transform="translate(500, 180)">
                  <text x="0" y="-5" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">SECTION C-C: TIP DETAIL</text>
                  <circle cx="45" cy="40" r="25" fill="#0e283e" stroke="#00f2fe" strokeWidth="2"/>
                  <circle cx="45" cy="40" r="10" fill="url(#sectionHatch)" stroke="#00f2fe" strokeWidth="1"/>
                  <text x="45" y="80" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">Ø 3.20mm [±0.05]</text>
                </g>

                {/* ANSI DRAFTING TITLE BLOCK (BOTTOM RIGHT) */}
                <g transform="translate(20, 240)">
                  <rect x="0" y="0" width="680" height="60" fill="#091829" stroke="#00f2fe" strokeWidth="1.5"/>
                  <line x1="240" y1="0" x2="240" y2="60" stroke="#00f2fe" strokeWidth="1"/>
                  <line x1="480" y1="0" x2="480" y2="60" stroke="#00f2fe" strokeWidth="1"/>
                  <line x1="0" y1="30" x2="680" y2="30" stroke="#00f2fe" strokeWidth="0.8"/>

                  {/* Title Block Cells */}
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

                  <text x="490" y="45" fill="#38bdf8" fontSize="7" fontFamily="monospace">STATUS / APPROVAL</text>
                  <text x="490" y="55" fill="#10b981" fontSize="8" fontFamily="monospace" fontWeight="bold">RELEASED FOR PROTOTYPING (REV A)</text>
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
