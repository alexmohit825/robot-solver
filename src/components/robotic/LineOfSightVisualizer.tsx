import React, { useState } from 'react';
import { PlatformType } from '../../data/roboticPlatforms';
import { LINE_OF_SIGHT_SPECS } from '../../data/lineOfSightGuides';
import { 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  Move, 
  Maximize2, 
  CheckSquare, 
  Square 
} from 'lucide-react';

interface LineOfSightVisualizerProps {
  currentPlatform: PlatformType;
}

export const LineOfSightVisualizer: React.FC<LineOfSightVisualizerProps> = ({
  currentPlatform
}) => {
  const spec = LINE_OF_SIGHT_SPECS[currentPlatform];
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center space-x-3 pb-5 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <Eye className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">Spatial Tracking Envelope</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">Optical Geometry Diagnostics</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Line of Sight & Camera Corridor Optimization
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-cyan-400" />
              <span>Camera-to-Field Distance:</span>
            </span>
            <span className="text-emerald-400 font-bold">{spec.optimalDistanceMeters.sweetSpot}m (Sweet Spot)</span>
          </div>

          <div className="relative h-6 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center text-[10px] font-mono">
            <div className="w-1/4 h-full bg-rose-500/30 border-r border-rose-500/50 flex items-center justify-center text-rose-300">
              &lt; 1.5m Too Close
            </div>
            <div className="w-1/2 h-full bg-emerald-500/30 border-r border-emerald-500/50 flex items-center justify-center text-emerald-300 font-bold">
              1.8m — 2.4m Optimal Zone
            </div>
            <div className="w-1/4 h-full bg-amber-500/30 flex items-center justify-center text-amber-300">
              &gt; 2.8m Too Far
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            Optical tracking resolution degrades when positioned outside the green volume.
          </p>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pitch Angle of Incidence:</span>
            </span>
            <span className="text-cyan-300 font-bold">{spec.optimalAngleDegrees.target}° Downward Pitch</span>
          </div>

          <div className="relative h-6 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center text-[10px] font-mono">
            <div className="w-1/3 h-full bg-amber-500/30 border-r border-amber-500/50 flex items-center justify-center text-amber-300">
              &lt; 30° Shallow
            </div>
            <div className="w-1/3 h-full bg-cyan-500/30 border-r border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold">
              35° — 55° Ideal
            </div>
            <div className="w-1/3 h-full bg-rose-500/30 flex items-center justify-center text-rose-300">
              &gt; 65° Steep
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            Prevents surgeon head and shoulders from occluding arrays during screw pass.
          </p>
        </div>
      </div>

      <div className="bg-cyan-950/40 border border-cyan-800/60 p-4 rounded-xl mb-6 text-xs text-cyan-200 leading-relaxed">
        <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
          Recommended Cart Spatial Positioning:
        </span>
        {spec.recommendedPlacement}
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Top Intraoperative Obstruction Vectors & Countermeasures</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {spec.commonObstructionVectors.map((vec, idx) => (
            <div key={idx} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-100 block mb-1">{vec.source}</span>
              <p className="text-[11px] text-slate-400 mb-2">{vec.riskDescription}</p>
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
                <span className="font-bold">Fix: </span>
                <span>{vec.preventiveTactic}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800">
        <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Pre-Instrumentation Verification Checklist</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {spec.quickChecklist.map((item, idx) => {
            const isChecked = Boolean(checkedItems[idx]);
            return (
              <button
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-2.5 rounded-lg border text-left flex items-center space-x-2.5 transition-all ${
                  isChecked 
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <span className={isChecked ? 'line-through opacity-75' : ''}>{item}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
