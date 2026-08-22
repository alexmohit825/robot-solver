import React from 'react';
import { KinematicParameters } from '../types';

interface KinematicDiagramProps {
  diagramType: string;
  parameters: KinematicParameters;
  title: string;
  className?: string;
}

export const KinematicDiagram: React.FC<KinematicDiagramProps> = ({
  diagramType,
  parameters,
  title,
  className = ''
}) => {
  const bayonetAngle = parameters.bayonetAngleDeg || 0;
  const shaftLength = parameters.shaftLengthMm || 100;
  const isRadiolucent = parameters.isRadiolucent;
  const hasSuction = parameters.hasIrrigationSuctionChannel;

  return (
    <div className={`relative bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 flex flex-col items-center justify-between overflow-hidden shadow-inner ${className}`}>
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-400 font-semibold uppercase tracking-wider">Kinematic Schematic</span>
        </div>
        <div className="text-slate-400">
          TYPE: <span className="text-amber-400">{diagramType.replace('_', ' ').toUpperCase()}</span>
        </div>
      </div>

      {/* Schematic SVG Viewport */}
      <div className="w-full h-48 flex items-center justify-center relative my-2">
        <svg viewBox="0 0 360 180" className="w-full h-full text-slate-200">
          {/* Background Optical & Coordinate Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2,2"/>
            </pattern>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#05d5b3" stopOpacity="0.3"/>
            </linearGradient>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.4"/>
            </linearGradient>
            <linearGradient id="exoscopeBeam" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Exoscope Line-of-Sight Optical Cone */}
          <polygon points="180,10 80,170 280,170" fill="url(#exoscopeBeam)" stroke="#00f2fe" strokeWidth="0.5" strokeDasharray="3,3"/>
          <text x="180" y="25" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace" opacity="0.8">EXOSCOPE OPTICAL AXIS</text>

          {/* Dynamic Instrument Rendering based on Type */}
          {diagramType === 'bayonet_articulator' || diagramType === 'steerable_curette' ? (
            <g transform="translate(40, 20)">
              {/* Ergonomic Handpiece */}
              <rect x="10" y="70" width="60" height="18" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="30" cy="79" r="4" fill="#f59e0b" />
              <text x="30" y="65" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">GRIP AXIS</text>
              
              {/* Bayonet Vertical Offset */}
              <line x1="70" y1="79" x2="110" y2="40" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round" />
              <text x="95" y="52" fill="#00f2fe" fontSize="8" fontFamily="monospace">+{bayonetAngle}° OFFSET</text>

              {/* Working Shaft */}
              <line x1="110" y1="40" x2="240" y2="40" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
              <text x="175" y="32" fill="#38bdf8" fontSize="8" fontFamily="monospace">{shaftLength}mm SHAFT</text>

              {/* Articulating Steerable Working Tip */}
              <path d="M 240,40 Q 260,40 270,70" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="270" cy="70" r="4" fill="#f59e0b" />
              <text x="270" y="88" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">90° STEERABLE TIP</text>

              {/* Sightline Clearance Arc */}
              <path d="M 110,40 A 30 30 0 0 0 90,65" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2"/>
              <text x="70" y="105" fill="#10b981" fontSize="7" fontFamily="monospace">✓ LINE-OF-SIGHT CLEARED</text>
            </g>
          ) : diagramType === 'vertebral_lock' ? (
            <g transform="translate(30, 20)">
              {/* Inserter Handle & Tensioner */}
              <rect x="20" y="70" width="50" height="22" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="35" cy="81" r="5" fill="#f59e0b" />
              
              {/* Segmented Vertebral Joints */}
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <rect 
                  key={idx} 
                  x={75 + idx * 25} 
                  y={65 + Math.sin(idx * 0.5) * 8} 
                  width="20" 
                  height="16" 
                  rx="3" 
                  fill="#1e293b" 
                  stroke="#00f2fe" 
                  strokeWidth="1.5" 
                />
              ))}
              <line x1="75" y1="73" x2="225" y2="73" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
              
              {/* Impaction Ram Head */}
              <polygon points="230,60 260,73 230,86" fill="#f59e0b" />
              <text x="265" y="77" fill="#f59e0b" fontSize="8" fontFamily="monospace">600N RAM</text>
              <text x="145" y="105" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">TENSION-LOCKING CABLE COLUMN</text>
            </g>
          ) : diagramType === 'light_pipe' ? (
            <g transform="translate(50, 15)">
              {/* Cylindrical Tubular Body */}
              <rect x="50" y="30" width="160" height="90" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              
              {/* Internal TIR Optical Ring Waveguides */}
              <rect x="55" y="35" width="6" height="80" rx="3" fill="#00f2fe" opacity="0.9" />
              <rect x="200" y="35" width="6" height="80" rx="3" fill="#00f2fe" opacity="0.9" />
              
              {/* 360 Photonic Emission Cone at Bottom */}
              <polygon points="58,115 15,160 140,160" fill="url(#cyanGrad)" opacity="0.6" />
              <polygon points="203,115 120,160 245,160" fill="url(#cyanGrad)" opacity="0.6" />
              <text x="130" y="75" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">14mm WORKING PORT</text>
              <text x="130" y="150" textAnchor="middle" fill="#00f2fe" fontSize="8" fontFamily="monospace">360° COLD LIGHT (22,000 LUX)</text>
            </g>
          ) : (
            <g transform="translate(40, 20)">
              {/* Generic Precision Mechanism */}
              <rect x="30" y="60" width="180" height="24" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="210" cy="72" r="8" fill="#f59e0b" />
              <line x1="218" y1="72" x2="270" y2="72" stroke="#00f2fe" strokeWidth="3" strokeLinecap="round" />
              <circle cx="270" cy="72" r="3" fill="#00f2fe" />
              <text x="120" y="50" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">{title.slice(0, 30)}...</text>
              <text x="120" y="105" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">✓ BIOMECHANICAL STABILITY CHECK: PASS</text>
            </g>
          )}

          {/* Coordinate Scale Indicators */}
          <line x1="20" y1="165" x2="340" y2="165" stroke="#334155" strokeWidth="0.8" />
          <line x1="20" y1="160" x2="20" y2="170" stroke="#64748b" strokeWidth="1" />
          <line x1="180" y1="160" x2="180" y2="170" stroke="#64748b" strokeWidth="1" />
          <line x1="340" y1="160" x2="340" y2="170" stroke="#64748b" strokeWidth="1" />
          <text x="20" y="177" fill="#64748b" fontSize="7" fontFamily="monospace">0mm</text>
          <text x="180" y="177" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">TARGET CORRIDOR</text>
          <text x="340" y="177" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">DEPTH: {shaftLength}mm</text>
        </svg>
      </div>

      {/* Real-Time Parameter Telemetry */}
      <div className="w-full grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
        <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800 text-center">
          <span className="text-slate-500 block">OFFSET</span>
          <span className="text-cyan-400 font-semibold">+{bayonetAngle}°</span>
        </div>
        <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800 text-center">
          <span className="text-slate-500 block">REACH</span>
          <span className="text-amber-400 font-semibold">{shaftLength} mm</span>
        </div>
        <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800 text-center">
          <span className="text-slate-500 block">RADIOLUCENT</span>
          <span className={isRadiolucent ? "text-emerald-400 font-semibold" : "text-slate-400 font-semibold"}>
            {isRadiolucent ? "YES" : "NO"}
          </span>
        </div>
        <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800 text-center">
          <span className="text-slate-500 block">FLUIDIC</span>
          <span className={hasSuction ? "text-cyan-400 font-semibold" : "text-slate-500 font-semibold"}>
            {hasSuction ? "DUAL" : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};
