import React from 'react';
import { LayoutConfig } from '../types/keyboard';
import { Keyboard, Apple, RefreshCw, Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  config: LayoutConfig;
  onOpenSwiftModal: () => void;
  onOpenSettingsModal: () => void;
  onResetCalibration: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenSwiftModal,
  onOpenSettingsModal,
  onResetCalibration
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Concept */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black text-white tracking-tight">ErgoKey iOS Engine</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                iPhone 17 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Large-Finger & Motor-Dexterity Native iOS Keyboard with Dynamic Bayesian Hit-Testing & Apple Intelligence
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenSettingsModal}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-cyan-300 border border-slate-800 flex items-center space-x-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>iOS Settings Guide</span>
          </button>

          <button
            onClick={onResetCalibration}
            title="Reset on-device touch offset calibration"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Calibration</span>
          </button>

          <button
            onClick={onOpenSwiftModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-xs font-bold text-white shadow-md shadow-orange-500/20 flex items-center space-x-2 transition-all"
          >
            <Apple className="w-4 h-4 fill-current" />
            <span>Swift Extension Code</span>
          </button>
        </div>
      </div>
    </header>
  );
};
