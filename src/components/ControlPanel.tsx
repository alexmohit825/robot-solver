import React from 'react';
import { DeviceType, KeyboardLayoutMode, LayoutConfig } from '../types/keyboard';
import {
  Smartphone,
  Hand,
  Sliders,
  Layers,
  Sparkles,
  Type,
  Maximize2,
  Scissors,
  MessageSquare,
  Volume2,
  VolumeX,
  SmartphoneNfc,
  Lightbulb,
  CheckCheck,
  Quote,
  CheckCircle2
} from 'lucide-react';

interface ControlPanelProps {
  config: LayoutConfig;
  onChange: (updated: Partial<LayoutConfig>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange }) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-6 shadow-xl text-slate-200">
      {/* 0. Universal App Testing Environment */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/30 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>Universal iOS App Testing</span>
          </label>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
            All iOS Apps
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Select an app to test how ErgoKey adapts return keys, URL shortcuts, and input modes across the iOS system:
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
          {[
            { id: 'messages', label: 'Messages' },
            { id: 'safari', label: 'Safari' },
            { id: 'mail', label: 'Mail' },
            { id: 'notes', label: 'Notes' },
            { id: 'search', label: 'Search' }
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => onChange({ activeApp: app.id as any })}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                config.activeApp === app.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Native iOS Keyboard Tools & Feedback Toggles */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <SmartphoneNfc className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">iOS Keyboard Tools &amp; Feedback</h3>
              <p className="text-[10px] text-cyan-300">Haptics, Clicks, Spellcheck &amp; Predictive Text</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          {/* Haptic Feedback */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center space-x-2">
              <SmartphoneNfc className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Haptic Feedback</p>
                <p className="text-[9px] text-slate-500">Tactile tap vibration</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.hapticFeedbackEnabled}
              onChange={(e) => onChange({ hapticFeedbackEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
            />
          </label>

          {/* Keyboard Sound / Clicks */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center space-x-2">
              {config.soundFeedbackEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <p className="text-[11px] font-bold text-slate-200">Keyboard Sounds</p>
                <p className="text-[9px] text-slate-500">Mechanical keystroke clicks</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.soundFeedbackEnabled}
              onChange={(e) => onChange({ soundFeedbackEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
            />
          </label>

          {/* Predictive Text */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Predictive Text</p>
                <p className="text-[9px] text-slate-500">Top candidate ribbon</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.predictiveTextEnabled}
              onChange={(e) => onChange({ predictiveTextEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
            />
          </label>

          {/* Check Spelling & Auto-Correction */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center space-x-2">
              <CheckCheck className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Check Spelling</p>
                <p className="text-[9px] text-slate-500">Bayesian typo correction</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.checkSpellingEnabled}
              onChange={(e) => onChange({ checkSpellingEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
            />
          </label>

          {/* Smart Punctuation */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center space-x-2">
              <Quote className="w-4 h-4 text-pink-400" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Smart Punctuation</p>
                <p className="text-[9px] text-slate-500">Double-space '.' shortcut</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.smartPunctuationEnabled}
              onChange={(e) => onChange({ smartPunctuationEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
            />
          </label>

          {/* Auto-Capitalization */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Auto-Capitalization</p>
                <p className="text-[9px] text-slate-500">Auto-shift after sentences</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.autoCapitalizationEnabled}
              onChange={(e) => onChange({ autoCapitalizationEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 2. Apple Intelligence Integration Suite */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-pink-950/30 border border-purple-500/40 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Apple Intelligence</h3>
              <p className="text-[10px] text-purple-300">On-Device Semantic Safety Net (iOS 18 / 19)</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.appleIntelligenceEnabled}
              onChange={(e) => onChange({ appleIntelligenceEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
          </label>
        </div>

        {config.appleIntelligenceEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-purple-500/20 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-purple-500/30 cursor-pointer hover:bg-slate-950">
              <div className="flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px] text-slate-200">Smart Replies</span>
              </div>
              <input
                type="checkbox"
                checked={config.smartRepliesEnabled}
                onChange={(e) => onChange({ smartRepliesEnabled: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-purple-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-purple-500/30 cursor-pointer hover:bg-slate-950">
              <div className="flex items-center space-x-1.5">
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-slate-200">Mashed-Word Repair</span>
              </div>
              <input
                type="checkbox"
                checked={config.mashedWordRepairEnabled}
                onChange={(e) => onChange({ mashedWordRepairEnabled: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-purple-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-purple-500/30 cursor-pointer hover:bg-slate-950 sm:col-span-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[11px] text-slate-200">iOS 18/19 Iridescent Aura Glow</span>
              </div>
              <input
                type="checkbox"
                checked={config.showAiGlow}
                onChange={(e) => onChange({ showAiGlow: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-purple-500 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* 3. Maximized Customizability */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Maximize2 className="w-4 h-4 text-cyan-400" />
          <span>Key Sizing, Text Size & Negative-Space Customization</span>
        </label>

        {/* Key Spacing Slider */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
              <span>Inter-Key Gutter (Negative Space):</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">{config.keyGutter} pt</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="0.5"
            value={config.keyGutter}
            onChange={(e) => onChange({ keyGutter: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>2pt (Compact)</span>
            <span>6pt (Recommended)</span>
            <span className="text-cyan-400">12pt (Maximum Thumb Isolation)</span>
          </div>
        </div>

        {/* Text / Glyph Font Size Slider */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>Key Text & Glyph Size:</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">{config.glyphFontSize} pt</span>
          </div>
          <input
            type="range"
            min="14"
            max="26"
            step="1"
            value={config.glyphFontSize}
            onChange={(e) => onChange({ glyphFontSize: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>14pt (Standard)</span>
            <span className="text-amber-400">18pt (Large Finger Recommended)</span>
            <span>26pt (Extra Large Accessibility)</span>
          </div>
        </div>

        {/* Keyboard Height Slider */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Total Keyboard Height:</span>
            <span className="font-mono text-blue-400 font-bold">{config.keyboardHeight} pt</span>
          </div>
          <input
            type="range"
            min="240"
            max="340"
            step="5"
            value={config.keyboardHeight}
            onChange={(e) => onChange({ keyboardHeight: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      {/* 4. Target iPhone Form Factor */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span>Target iPhone Device Preset</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({ device: 'iphone-17-pro' })}
            className={`p-3 rounded-xl border text-left transition-all ${
              config.device === 'iphone-17-pro'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>iPhone 17 Pro</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">6.3"</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">402 × 874 pt (Calibrated)</p>
          </button>

          <button
            onClick={() => onChange({ device: 'iphone-17-pro-max' })}
            className={`p-3 rounded-xl border text-left transition-all ${
              config.device === 'iphone-17-pro-max'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>iPhone 17 Pro Max</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">6.9"</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">440 × 956 pt</p>
          </button>
        </div>
      </div>

      {/* 5. Biomechanical Layout Mode */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Hand className="w-4 h-4 text-emerald-400" />
          <span>Thumb Ergonomics Mode</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({ mode: 'two-handed' })}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              config.mode === 'two-handed'
                ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold">Two-Handed Arc</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Dual-thumb sweep curve</p>
          </button>

          <button
            onClick={() => onChange({ mode: 'one-handed-right' })}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              config.mode === 'one-handed-right'
                ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold">One-Handed Right</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Right-thumb radial arc</p>
          </button>
        </div>
      </div>

      {/* 6. Physical Finger Contact Pad */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>Capacitive Finger Contact Size</span>
        </label>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Simulated Finger Pad Contact:</span>
            <span className="font-mono text-cyan-400 font-bold">{config.fingerRadiusMm} mm</span>
          </div>
          <input
            type="range"
            min="7"
            max="16"
            step="0.5"
            value={config.fingerRadiusMm}
            onChange={(e) => onChange({ fingerRadiusMm: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* 7. Telemetry & Debug Visualizer Overlays */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Real-Time Hitbox & Decoder Overlays</span>
        </label>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 cursor-pointer hover:bg-slate-950 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/80 border border-emerald-400" />
              <span className="text-xs text-slate-200">Dynamic Bayesian Hitboxes</span>
            </div>
            <input
              type="checkbox"
              checked={config.showDynamicHitboxes}
              onChange={(e) => onChange({ showDynamicHitboxes: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 cursor-pointer hover:bg-slate-950 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500/80 border border-cyan-400" />
              <span className="text-xs text-slate-200">Contact Ellipse & Centroid</span>
            </div>
            <input
              type="checkbox"
              checked={config.showContactEllipse}
              onChange={(e) => onChange({ showContactEllipse: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
