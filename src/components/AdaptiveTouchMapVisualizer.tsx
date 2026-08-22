import React, { useState, useEffect } from 'react';
import { LayoutConfig, KeyDefinition } from '../types/keyboard';
import { AdaptiveTouchMap, KeyTouchStats } from '../engine/AdaptiveTouchMap';
import { generateKeyboardLayout, getDeviceDimensions } from '../engine/KeyboardLayouts';
import {
  Brain,
  Sparkles,
  RefreshCw,
  Sliders,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface AdaptiveTouchMapVisualizerProps {
  config: LayoutConfig;
  adaptiveMap: AdaptiveTouchMap;
}

export const AdaptiveTouchMapVisualizer: React.FC<AdaptiveTouchMapVisualizerProps> = ({
  config,
  adaptiveMap
}) => {
  const [stats, setStats] = useState<KeyTouchStats[]>([]);
  const [learningRate, setLearningRate] = useState<number>(adaptiveMap.getLearningRate());
  const [lastEventMsg, setLastEventMsg] = useState<string | null>(null);

  const keys = generateKeyboardLayout(
    config.mode,
    config.device,
    'alpha',
    config.keyboardHeight,
    config.bottomGutterPadding,
    config.keyGutter,
    config.includeInlinePunctuation,
    config.activeApp
  );

  const refreshStats = () => {
    setStats(adaptiveMap.getAllStats());
  };

  useEffect(() => {
    refreshStats();
    adaptiveMap.onLearningEvent((e) => {
      refreshStats();
      if (e.type === 'correction') {
        setLastEventMsg(`✨ Learned Error Correction for '${e.char.toUpperCase()}' (ΔX: ${e.deltaX.toFixed(1)}pt, ΔY: ${e.deltaY.toFixed(1)}pt)`);
      } else {
        setLastEventMsg(`📍 Calibrated '${e.char.toUpperCase()}' (Samples: ${e.totalSamples})`);
      }
      setTimeout(() => setLastEventMsg(null), 3000);
    });
  }, [adaptiveMap]);

  const handleSimulatePattern = (pattern: 'right-thumb-downward' | 'left-thumb-slant' | 'fat-finger-spread') => {
    adaptiveMap.simulateThumbDriftPattern(keys, pattern);
    refreshStats();
  };

  const handleReset = () => {
    adaptiveMap.resetAll();
    refreshStats();
  };

  const totalSamples = stats.reduce((acc, s) => acc + s.sampleCount, 0);
  const totalCorrections = stats.reduce((acc, s) => acc + s.correctionCount, 0);
  const avgDriftX =
    stats.length > 0
      ? (stats.reduce((acc, s) => acc + Math.abs(s.offsetX), 0) / stats.length).toFixed(1)
      : '0.0';
  const avgDriftY =
    stats.length > 0
      ? (stats.reduce((acc, s) => acc + Math.abs(s.offsetY), 0) / stats.length).toFixed(1)
      : '0.0';

  const { width: W } = getDeviceDimensions(config.device);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 text-slate-200">
      {/* Header & Concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Personalized Adaptive Touch Map</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Online Machine Learning
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Continuously adjusts per-key strike centroids from mistakes &amp; corrections over time.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Learned Map</span>
        </button>
      </div>

      {/* Learning Live Toast */}
      {lastEventMsg && (
        <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/80 text-xs text-purple-200 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="font-semibold">{lastEventMsg}</span>
        </div>
      )}

      {/* Key Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Keystrokes Analyzed</span>
          <p className="text-xl font-bold font-mono text-cyan-400">{totalSamples}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Corrections Learned</span>
          <p className="text-xl font-bold font-mono text-amber-400">{totalCorrections}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Personal Drift (X)</span>
          <p className="text-xl font-bold font-mono text-emerald-400">±{avgDriftX} pt</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Personal Drift (Y)</span>
          <p className="text-xl font-bold font-mono text-purple-400">±{avgDriftY} pt</p>
        </div>
      </div>

      {/* Visual Interactive Touch Map SVG Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Learned Centroid Drift Visualizer:</span>
          </span>
          <div className="flex items-center space-x-3 text-[10px] font-normal">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              <span>Base Key Center</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span>Learned Centroid</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Correction Strike</span>
            </span>
          </div>
        </div>

        <div
          className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden mx-auto shadow-inner"
          style={{ width: '100%', maxWidth: `${W}px`, height: `${config.keyboardHeight}px` }}
        >
          <svg className="w-full h-full">
            {/* 1. Base Key Rectangles */}
            {keys.map((key) => (
              <g key={key.id}>
                <rect
                  x={key.x}
                  y={key.y}
                  width={key.width}
                  height={key.height}
                  rx={6}
                  ry={6}
                  fill="rgba(30, 41, 59, 0.4)"
                  stroke="rgba(71, 85, 105, 0.4)"
                  strokeWidth={0.8}
                />
                <text
                  x={key.x + key.width / 2}
                  y={key.y + key.height / 2 + 3}
                  textAnchor="middle"
                  fill="rgba(148, 163, 184, 0.5)"
                  fontSize={10}
                  fontWeight="bold"
                >
                  {key.label}
                </text>
              </g>
            ))}

            {/* 2. Learned Drift Vectors & Adjusted Centroids */}
            {keys.map((key) => {
              const statsForKey = adaptiveMap.getStatsForKey(key.id);
              const baseX = key.x + key.width / 2;
              const baseY = key.y + key.height / 2;

              const adjusted = adaptiveMap.getAdjustedKeyCenter(key);
              const hasLearned = statsForKey && statsForKey.sampleCount >= 2;

              return (
                <g key={`drift-${key.id}`}>
                  {/* Base Center point */}
                  <circle cx={baseX} cy={baseY} r={1.5} fill="#94a3b8" opacity={0.6} />

                  {/* Learned Centroid Vector Arrow */}
                  {hasLearned && (
                    <>
                      <line
                        x1={baseX}
                        y1={baseY}
                        x2={adjusted.x}
                        y2={adjusted.y}
                        stroke="#22d3ee"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                      />
                      {/* Learned Target Centroid */}
                      <circle
                        cx={adjusted.x}
                        cy={adjusted.y}
                        r={3.5}
                        fill="#06b6d4"
                        stroke="#67e8f9"
                        strokeWidth={1}
                      />
                    </>
                  )}

                  {/* Scatter strikes */}
                  {statsForKey?.recentStrikes.map((s, idx) => (
                    <circle
                      key={idx}
                      cx={s.x}
                      cy={s.y}
                      r={2}
                      fill={s.isCorrection ? "#fbbf24" : "#38bdf8"}
                      opacity={0.7}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Simulation Tools */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>Simulate Biomechanical Drift Patterns</span>
        </span>
        <p className="text-[11px] text-slate-400">
          Click a pattern to simulate real-world typing drift and watch the Bayesian engine auto-calibrate:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handleSimulatePattern('right-thumb-downward')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all text-xs"
          >
            <p className="font-bold text-cyan-300">Right Thumb Drag</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Down &amp; left drift on right keys</p>
          </button>

          <button
            onClick={() => handleSimulatePattern('left-thumb-slant')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all text-xs"
          >
            <p className="font-bold text-purple-300">Left Thumb Slant</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Down &amp; right drift on left keys</p>
          </button>

          <button
            onClick={() => handleSimulatePattern('fat-finger-spread')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all text-xs"
          >
            <p className="font-bold text-emerald-300">Fat-Finger Spread</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Outward perimeter shift</p>
          </button>
        </div>
      </div>

      {/* Learning Rate Configuration */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Adaptive Learning Rate (Alpha):</span>
          </span>
          <span className="font-mono text-cyan-400 font-bold">{(learningRate * 100).toFixed(0)}% per strike</span>
        </div>
        <input
          type="range"
          min="0.05"
          max="0.45"
          step="0.05"
          value={learningRate}
          onChange={(e) => {
            const val = Number(e.target.value);
            setLearningRate(val);
            adaptiveMap.setLearningRate(val);
          }}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>5% (Slow &amp; Conservative)</span>
          <span className="text-cyan-400">20% (Recommended)</span>
          <span>45% (Aggressive Adaptation)</span>
        </div>
      </div>
    </div>
  );
};
