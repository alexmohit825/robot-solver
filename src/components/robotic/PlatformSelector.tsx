import React from 'react';
import { PlatformType, PLATFORM_CONFIGS } from '../../data/roboticPlatforms';
import { Cpu, Activity, Radio } from 'lucide-react';

interface PlatformSelectorProps {
  currentPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  currentPlatform,
  onSelectPlatform
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Section Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Radio className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">Active Robotic System</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                LIVE OR ENGINE
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {PLATFORM_CONFIGS[currentPlatform].systemFullName}
            </h3>
          </div>
        </div>

        {/* Right: Platform Dual-Segment Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 shadow-inner w-full sm:w-auto">
          {/* Globus ExcelsiusGPS Button */}
          <button
            onClick={() => onSelectPlatform('EXCELSIUS')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all flex items-center justify-center space-x-2 ${
              currentPlatform === 'EXCELSIUS'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-300" />
            <span>EXCELSIUSGPS®</span>
          </button>

          {/* Medtronic Mazor X Button */}
          <button
            onClick={() => onSelectPlatform('MAZOR_X')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all flex items-center justify-center space-x-2 ${
              currentPlatform === 'MAZOR_X'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30 ring-1 ring-amber-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-300" />
            <span>MAZOR X™ STEALTH</span>
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono">
        <div className="bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/60">
          <span className="text-slate-500">Tracking: </span>
          <span className="text-slate-300 font-semibold">{PLATFORM_CONFIGS[currentPlatform].trackingMechanism}</span>
        </div>
        <div className="bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/60">
          <span className="text-slate-500">Camera: </span>
          <span className="text-slate-300 font-semibold">{PLATFORM_CONFIGS[currentPlatform].cameraType}</span>
        </div>
        <div className="bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/60">
          <span className="text-slate-500">Reference: </span>
          <span className="text-slate-300 font-semibold">{PLATFORM_CONFIGS[currentPlatform].referenceArrayName}</span>
        </div>
        <div className="bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/60">
          <span className="text-slate-500">Verification: </span>
          <span className="text-slate-300 font-semibold">{PLATFORM_CONFIGS[currentPlatform].verificationMethod}</span>
        </div>
      </div>
    </div>
  );
};
