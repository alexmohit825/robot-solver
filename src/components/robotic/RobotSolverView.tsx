import React, { useState } from 'react';
import { PlatformType, TriageCategory } from '../../data/roboticPlatforms';
import { PlatformSelector } from './PlatformSelector';
import { SymptomTriageEngine } from './SymptomTriageEngine';
import { ErrorCodeLookup } from './ErrorCodeLookup';
import { LineOfSightVisualizer } from './LineOfSightVisualizer';
import { 
  AlertCircle, 
  Search, 
  Eye, 
  Crosshair, 
  Radio, 
  Wrench, 
  Layers, 
  Activity
} from 'lucide-react';

interface RobotSolverViewProps {
  currentPlatform?: PlatformType;
  onSelectPlatform?: (platform: PlatformType) => void;
  activePortal?: 'SYMPTOMS' | 'ERROR_CODES' | 'LINE_OF_SIGHT';
  onSelectPortal?: (portal: 'SYMPTOMS' | 'ERROR_CODES' | 'LINE_OF_SIGHT') => void;
}

export const RobotSolverView: React.FC<RobotSolverViewProps> = ({
  currentPlatform: controlledPlatform,
  onSelectPlatform,
  activePortal: controlledPortal,
  onSelectPortal
}) => {
  const [internalPlatform, setInternalPlatform] = useState<PlatformType>('EXCELSIUS');
  const [internalPortal, setInternalPortal] = useState<'SYMPTOMS' | 'ERROR_CODES' | 'LINE_OF_SIGHT'>('SYMPTOMS');
  const [selectedCategory, setSelectedCategory] = useState<TriageCategory | 'ALL'>('ALL');

  const currentPlatform = controlledPlatform || internalPlatform;
  const handleSelectPlatform = (p: PlatformType) => {
    if (onSelectPlatform) onSelectPlatform(p);
    else setInternalPlatform(p);
  };

  const activePortal = controlledPortal || internalPortal;
  const handleSelectPortal = (portal: 'SYMPTOMS' | 'ERROR_CODES' | 'LINE_OF_SIGHT') => {
    if (onSelectPortal) onSelectPortal(portal);
    else setInternalPortal(portal);
  };

  const categories: { id: TriageCategory | 'ALL'; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All Domains', icon: Layers },
    { id: 'TRAJECTORY_ACCURACY', label: 'Trajectory & Accuracy', icon: Crosshair },
    { id: 'LINE_OF_SIGHT_TRACKING', label: 'Line of Sight & Camera', icon: Eye },
    { id: 'MECHANICAL_ARM_FORCE', label: 'Arm Motion & Force Limits', icon: Activity },
    { id: 'REGISTRATION_SPIN', label: 'Registration & 3D Spin', icon: Radio },
    { id: 'CLAMP_RIGIDITY', label: 'Clamp & Skeletal Rigidity', icon: Wrench }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Master Platform Selector Bar (ExcelsiusGPS vs Mazor X) */}
      <PlatformSelector 
        currentPlatform={currentPlatform}
        onSelectPlatform={handleSelectPlatform}
      />

      {/* 2. Primary Portal Switching Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Portal 1: Symptom Decision Tree */}
        <button
          onClick={() => handleSelectPortal('SYMPTOMS')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            activePortal === 'SYMPTOMS'
              ? 'bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/60 ring-1 ring-rose-500/30 shadow-lg shadow-rose-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activePortal === 'SYMPTOMS'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-400 group-hover:text-rose-400'
            }`}>
              <AlertCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              CLINICAL FLOW
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
            🚨 "The Robot Is Way Off"
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Differential clinical algorithm for clamp slippage, skiving, or registration drift.
          </p>
        </button>

        {/* Portal 2: Console Error Code Lookup */}
        <button
          onClick={() => handleSelectPortal('ERROR_CODES')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            activePortal === 'ERROR_CODES'
              ? 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activePortal === 'ERROR_CODES'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 group-hover:text-amber-400'
            }`}>
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              INSTANT DECODER
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
            🔍 Screen Alert & Code Lookup
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            De-obfuscate console alerts (e.g. E-3104, ST-104) with immediate 3-step resolutions.
          </p>
        </button>

        {/* Portal 3: Line of Sight Visualizer */}
        <button
          onClick={() => handleSelectPortal('LINE_OF_SIGHT')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            activePortal === 'LINE_OF_SIGHT'
              ? 'bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activePortal === 'LINE_OF_SIGHT'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 group-hover:text-cyan-400'
            }`}>
              <Eye className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SPATIAL GUIDE
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            📐 Line of Sight & Tracking
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Camera distance volume, 45° downward angles, and OR occlusion elimination.
          </p>
        </button>
      </div>

      {/* 3. Category Filter Chips (when in Error Code mode) */}
      {activePortal === 'ERROR_CODES' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Active Portal Viewport */}
      {activePortal === 'SYMPTOMS' && (
        <SymptomTriageEngine currentPlatform={currentPlatform} />
      )}

      {activePortal === 'ERROR_CODES' && (
        <ErrorCodeLookup 
          currentPlatform={currentPlatform}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {activePortal === 'LINE_OF_SIGHT' && (
        <LineOfSightVisualizer currentPlatform={currentPlatform} />
      )}
    </div>
  );
};
