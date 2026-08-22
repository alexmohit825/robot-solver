import React, { useState } from 'react';
import {
  X,
  Settings,
  Check,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Globe,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  SmartphoneNfc,
  Volume2,
  Lightbulb,
  CheckCheck,
  Quote
} from 'lucide-react';

interface IosSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IosSettingsModal: React.FC<IosSettingsModalProps> = ({ isOpen, onClose }) => {
  const [isFullAccessAllowed, setIsFullAccessAllowed] = useState<boolean>(true);
  const [hapticsOn, setHapticsOn] = useState<boolean>(true);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [predictiveOn, setPredictiveOn] = useState<boolean>(true);
  const [spellCheckOn, setSpellCheckOn] = useState<boolean>(true);
  const [smartPunctuationOn, setSmartPunctuationOn] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>iOS Settings &amp; Keyboard Tools Hub</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  iPhone 17 Pro
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Native Apple Settings &gt; General &gt; Keyboard configuration &amp; feedback switches.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Simulated iOS Settings Screen */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Settings className="w-3.5 h-3.5 text-slate-300" />
                <span>Settings &gt; General &gt; Keyboard</span>
              </span>
              <span className="text-emerald-400 font-mono">Apple iOS 18/19</span>
            </div>

            {/* Active Extension Card */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <p className="text-white font-bold">ErgoKey (iPhone 17 Pro)</p>
                  <p className="text-[10px] text-blue-300">Large-Finger &amp; Apple Intelligence Engine</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-emerald-400 font-bold">Active</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* iOS Native Toggle Swatches */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Native Keyboard Tools &amp; Switches
              </p>

              {/* 1. Haptic Feedback */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <SmartphoneNfc className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Haptic Feedback</p>
                    <p className="text-[10px] text-slate-400">Tactile motor pulse on strike</p>
                  </div>
                </div>
                <button onClick={() => setHapticsOn((p) => !p)}>
                  {hapticsOn ? (
                    <ToggleRight className="w-7 h-7 text-cyan-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>

              {/* 2. Sound / Keyboard Clicks */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Keyboard Clicks (Sound)</p>
                    <p className="text-[10px] text-slate-400">Audible mechanical click audio</p>
                  </div>
                </div>
                <button onClick={() => setSoundOn((p) => !p)}>
                  {soundOn ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>

              {/* 3. Predictive Text */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Predictive Text</p>
                    <p className="text-[10px] text-slate-400">Show top candidate predictions bar</p>
                  </div>
                </div>
                <button onClick={() => setPredictiveOn((p) => !p)}>
                  {predictiveOn ? (
                    <ToggleRight className="w-7 h-7 text-amber-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>

              {/* 4. Check Spelling & Auto-Correction */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCheck className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Check Spelling &amp; Auto-Correction</p>
                    <p className="text-[10px] text-slate-400">Dynamic Bayesian typo correction</p>
                  </div>
                </div>
                <button onClick={() => setSpellCheckOn((p) => !p)}>
                  {spellCheckOn ? (
                    <ToggleRight className="w-7 h-7 text-purple-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>

              {/* 5. Smart Punctuation */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Quote className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Smart Punctuation</p>
                    <p className="text-[10px] text-slate-400">Double-space '.' shortcut &amp; smart quotes</p>
                  </div>
                </div>
                <button onClick={() => setSmartPunctuationOn((p) => !p)}>
                  {smartPunctuationOn ? (
                    <ToggleRight className="w-7 h-7 text-pink-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Full Access Toggle Card */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Allow Full Access</p>
                  <p className="text-[11px] text-slate-400">Used strictly on-device for CoreHaptics &amp; audio tactile response.</p>
                </div>
                <button
                  onClick={() => setIsFullAccessAllowed((prev) => !prev)}
                  className="text-cyan-400"
                >
                  {isFullAccessAllowed ? (
                    <ToggleRight className="w-8 h-8 text-cyan-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </button>
              </div>

              <div className="flex items-start space-x-2 pt-2 border-t border-slate-800 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Zero Telemetry Guarantee: All spatial hit-testing, predictive models, and audio run 100% locally.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Includes Globe (🌐) switcher and native iOS Emoji sheet (`😀`).</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
