import React, { useState, useMemo } from 'react';
import {
  LayoutConfig,
  HitTestResult,
  KeyboardLayoutMode,
  KeyboardLayer,
  ShiftState,
  SimulatedApp,
  DeviceType
} from './types/keyboard';
import { LanguagePriorModel } from './engine/LanguagePriorModel';
import { SpatialHitEngine } from './engine/SpatialHitEngine';
import { AppleIntelligenceModel } from './engine/AppleIntelligenceModel';
import { DeviceFrame } from './components/DeviceFrame';
import { ControlPanel } from './components/ControlPanel';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { AdaptiveTouchMapVisualizer } from './components/AdaptiveTouchMapVisualizer';
import { SwiftCodeExportModal } from './components/SwiftCodeExportModal';
import { IosSettingsModal } from './components/IosSettingsModal';
import { Header } from './components/Header';
import {
  Sparkles,
  Zap,
  Hand,
  Apple,
  Cpu,
  BookOpen,
  ArrowRight,
  Wand2,
  ShieldCheck,
  Maximize2,
  Settings,
  Smile,
  Globe,
  Smartphone,
  Brain
} from 'lucide-react';

export function App() {
  const priorModel = useMemo(() => new LanguagePriorModel(), []);
  const spatialEngine = useMemo(() => new SpatialHitEngine(priorModel), [priorModel]);
  const aiModel = useMemo(() => new AppleIntelligenceModel(), []);

  // Layout & Telemetry State targeting iPhone 17 Pro
  const [config, setConfig] = useState<LayoutConfig>({
    device: 'iphone-17-pro',
    mode: 'two-handed',
    layer: 'alpha',
    shiftState: 'off',
    activeApp: 'messages',
    keyboardHeight: 285,
    bottomGutterPadding: 26,
    keyGutter: 5.5,
    glyphFontSize: 18,
    fingerRadiusMm: 11.5,
    showDynamicHitboxes: true,
    showContactEllipse: true,
    showTraditionalHitboxes: false,
    showProbabilityHeatmap: false,
    showLanguagePriors: true,

    // Native iOS Keyboard Tools & Feedback Toggles
    hapticFeedbackEnabled: true,
    soundFeedbackEnabled: true,
    predictiveTextEnabled: true,
    checkSpellingEnabled: true,
    smartPunctuationEnabled: true,
    autoCapitalizationEnabled: true,

    // Apple Intelligence Settings
    appleIntelligenceEnabled: true,
    smartRepliesEnabled: true,
    autoProofreadEnabled: true,
    mashedWordRepairEnabled: true,
    showAiGlow: true,

    // Inline Punctuation
    includeInlinePunctuation: true
  });

  const [activeTab, setActiveTab] = useState<'controls' | 'adaptive-map' | 'benchmark' | 'architecture'>('controls');
  const [lastHitResult, setLastHitResult] = useState<HitTestResult | null>(null);
  const [isSwiftModalOpen, setIsSwiftModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const handleConfigChange = (updated: Partial<LayoutConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleLayerChange = (layer: KeyboardLayer) => {
    setConfig((prev) => ({ ...prev, layer }));
  };

  const handleShiftChange = (shiftState: ShiftState) => {
    setConfig((prev) => ({ ...prev, shiftState }));
  };

  const handleAppChange = (activeApp: SimulatedApp) => {
    setConfig((prev) => ({ ...prev, activeApp }));
  };

  const handleToggleAI = () => {
    setConfig((prev) => ({
      ...prev,
      appleIntelligenceEnabled: !prev.appleIntelligenceEnabled
    }));
  };

  const handleResetCalibration = () => {
    spatialEngine.resetCalibration();
    alert("On-device spatial bias calibration & learned touch map reset to baseline.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Application Header */}
      <Header
        config={config}
        onOpenSwiftModal={() => setIsSwiftModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onResetCalibration={handleResetCalibration}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center Column: iPhone 17 Pro Simulator */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <DeviceFrame
            config={config}
            priorModel={priorModel}
            spatialEngine={spatialEngine}
            aiModel={aiModel}
            onLayoutModeChange={(mode) => handleConfigChange({ mode })}
            onDeviceChange={(device) => handleConfigChange({ device })}
            onLayerChange={handleLayerChange}
            onShiftChange={handleShiftChange}
            onAppChange={handleAppChange}
            onToggleAI={handleToggleAI}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            lastHitResult={lastHitResult}
            onHitEvaluated={(res) => setLastHitResult(res)}
          />

          {/* Quick Interaction Tips */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 max-w-md w-full space-y-1.5">
            <p className="font-bold text-slate-200 flex items-center space-x-1.5">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Self-Learning Adaptive Touch Map:</span>
            </p>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-400">
              <li><strong className="text-cyan-300">Continuous Centroid Learning:</strong> As you type, the engine computes your individual finger strike offsets and shifts key centroids.</li>
              <li><strong className="text-amber-300">Correction Feedback Loop:</strong> Hitting <code className="text-amber-300 font-bold">⌫ Backspace</code> and typing the intended key immediately re-weights spatial boundaries.</li>
              <li><strong className="text-purple-300">Check the Visualizer:</strong> Switch to the <strong>"Adaptive Touch Map"</strong> tab to see your strike scatter points and centroid drift vectors!</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Controls, Adaptive Map, Benchmark Suite & Architecture Specs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'controls'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Controls</span>
            </button>

            <button
              onClick={() => setActiveTab('adaptive-map')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'adaptive-map'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-cyan-400/90 hover:text-cyan-300'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-cyan-300" />
              <span>Adaptive Map</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'benchmark'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Benchmark</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>17 Pro Specs</span>
            </button>
          </div>

          {/* Tab 1: Ergonomic & AI Controls */}
          {activeTab === 'controls' && (
            <ControlPanel config={config} onChange={handleConfigChange} />
          )}

          {/* Tab 2: Adaptive Touch Map Visualizer */}
          {activeTab === 'adaptive-map' && (
            <AdaptiveTouchMapVisualizer
              config={config}
              adaptiveMap={spatialEngine.getAdaptiveTouchMap()}
            />
          )}

          {/* Tab 3: Accuracy Benchmark */}
          {activeTab === 'benchmark' && (
            <BenchmarkSuite
              config={config}
              priorModel={priorModel}
              spatialEngine={spatialEngine}
            />
          )}

          {/* Tab 4: Design Principles & iPhone 17 Pro Specs */}
          {activeTab === 'architecture' && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5 text-slate-200">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Online Learning &amp; iOS Architecture</span>
              </h3>

              {/* Principle 1: Continuous Bayesian Centroid Learning */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/30 space-y-1.5">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                  <Brain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. Continuous Bayesian Strike Adaptation (Centroid &amp; Variance)</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every confirmed strike and backspace correction updates the key's 2D Gaussian centroid. If your right thumb consistently hits 4pt to the left of the 'O' key, ErgoKey shifts 'O's center to intercept future strikes accurately.
                </p>
              </div>

              {/* Principle 2: Universal App Support */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-blue-500/30 space-y-1.5">
                <h4 className="text-xs font-bold text-blue-300 flex items-center space-x-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>2. 100% Universal App Support (`UIInputViewController`)</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  As an Apple-certified system keyboard extension, ErgoKey automatically responds to every text view across all App Store apps (WhatsApp, Chrome, Notes, Slack, Instagram, Mail, etc.).
                </p>
              </div>

              {/* Principle 3: Sandboxed On-Device Privacy */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. 100% On-Device Sandboxed Learning</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Learned touch maps and n-gram linguistic priors remain strictly inside local extension memory and encrypted App Group storage with zero cloud telemetry.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings Walkthrough</span>
                </button>

                <button
                  onClick={() => setIsSwiftModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-orange-500/20 transition-all"
                >
                  <Apple className="w-4 h-4 fill-current" />
                  <span>View Xcode Swift Code</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SwiftCodeExportModal
        isOpen={isSwiftModalOpen}
        onClose={() => setIsSwiftModalOpen(false)}
      />

      <IosSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

export default App;
