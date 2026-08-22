import React, { useState } from 'react';
import { BenchmarkMetrics, BenchmarkPhrase, KeyDefinition, LayoutConfig } from '../types/keyboard';
import { SpatialHitEngine } from '../engine/SpatialHitEngine';
import { LanguagePriorModel } from '../engine/LanguagePriorModel';
import { generateKeyboardLayout } from '../engine/KeyboardLayouts';
import { Play, RotateCcw, Award, CheckCircle2, XCircle, Zap, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

const BENCHMARK_PHRASES: BenchmarkPhrase[] = [
  { target: "the quick brown fox jumps over the lazy dog", category: "adjacent-error-heavy" },
  { target: "hey are you ready for dinner tonight please let me know", category: "common" },
  { target: "thanks for reaching out will call you back soon", category: "common" },
  { target: "large fingers make texting quite frustrating on small screens", category: "large-finger-stress" },
  { target: "we should meet at the coffee shop tomorrow morning", category: "common" }
];

interface BenchmarkSuiteProps {
  config: LayoutConfig;
  priorModel: LanguagePriorModel;
  spatialEngine: SpatialHitEngine;
}

interface StepLog {
  targetChar: string;
  traditionalChar: string;
  probabilisticChar: string;
  traditionalSuccess: boolean;
  probabilisticSuccess: boolean;
  distanceFromCenter: number;
}

export const BenchmarkSuite: React.FC<BenchmarkSuiteProps> = ({
  config,
  priorModel,
  spatialEngine
}) => {
  const [selectedPhrase, setSelectedPhrase] = useState<string>(BENCHMARK_PHRASES[0].target);
  const [customPhrase, setCustomPhrase] = useState<string>("");
  const [jitterSigma, setJitterSigma] = useState<number>(10); // px standard deviation
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<BenchmarkMetrics | null>(null);
  const [stepLogs, setStepLogs] = useState<StepLog[]>([]);

  const keys = generateKeyboardLayout(
    config.mode,
    config.device,
    config.layer,
    config.keyboardHeight,
    config.bottomGutterPadding,
    config.keyGutter,
    config.includeInlinePunctuation
  );

  // Find center of target key
  const findKeyCenter = (char: string): { x: number; y: number; key: KeyDefinition } | null => {
    const ch = char.toLowerCase();
    for (const k of keys) {
      if (k.type === 'space' && ch === ' ') {
        return { x: k.x + k.width / 2, y: k.y + k.height / 2, key: k };
      }
      if (k.label.toLowerCase() === ch) {
        return { x: k.x + k.width / 2, y: k.y + k.height / 2, key: k };
      }
    }
    return null;
  };

  // Box-Muller transform for Gaussian random jitter
  const randomGaussian = (mean: number, stdev: number): number => {
    let u = 1 - Math.random();
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdev;
  };

  const runBenchmark = async () => {
    setIsRunning(true);
    setStepLogs([]);
    const phrase = customPhrase.trim() || selectedPhrase;

    let traditionalErrors = 0;
    let probabilisticErrors = 0;
    let fatFingerInterceptions = 0;
    let totalOffset = 0;
    const logs: StepLog[] = [];

    let currentProbBuffer = "";
    let currentTradBuffer = "";

    for (let i = 0; i < phrase.length; i++) {
      const targetChar = phrase[i];
      const targetInfo = findKeyCenter(targetChar);

      if (!targetInfo) continue;

      // Add realistic finger jitter based on jitterSigma + finger size
      const jitterX = randomGaussian(0, jitterSigma + config.fingerRadiusMm * 0.3);
      const jitterY = randomGaussian(0, jitterSigma + config.fingerRadiusMm * 0.3);

      const touchX = targetInfo.x + jitterX;
      const touchY = targetInfo.y + jitterY;
      const distance = Math.hypot(jitterX, jitterY);
      totalOffset += distance;

      // Simulate contact ellipse
      const contact = spatialEngine.simulateContactEllipse(
        touchX,
        touchY,
        config.fingerRadiusMm,
        45,
        0.85
      );

      // 1. Traditional Rectangular Hit-test
      const tradKey = spatialEngine.traditionalHitTest(contact, keys);
      const tradChar = tradKey.type === 'space' ? ' ' : tradKey.label.toLowerCase();
      const tradSuccess = tradChar === targetChar.toLowerCase();
      if (!tradSuccess) traditionalErrors++;
      currentTradBuffer += tradChar;

      // 2. Dynamic Probabilistic Hit-test
      const probResult = spatialEngine.dynamicProbabilisticHitTest(
        contact,
        keys,
        currentProbBuffer
      );
      const probKey = probResult.selectedKey;
      const probChar = probKey.type === 'space' ? ' ' : probKey.label.toLowerCase();
      const probSuccess = probChar === targetChar.toLowerCase();
      if (!probSuccess) probabilisticErrors++;
      currentProbBuffer += probChar;

      if (!tradSuccess && probSuccess) {
        fatFingerInterceptions++;
      }

      logs.push({
        targetChar,
        traditionalChar: tradChar,
        probabilisticChar: probChar,
        traditionalSuccess: tradSuccess,
        probabilisticSuccess: probSuccess,
        distanceFromCenter: Math.round(distance)
      });
    }

    const totalKeystrokes = logs.length;
    const errorReduction =
      traditionalErrors > 0
        ? Math.round(((traditionalErrors - probabilisticErrors) / traditionalErrors) * 100)
        : 100;

    setMetrics({
      totalKeystrokes,
      traditionalErrors,
      probabilisticErrors,
      errorReductionPercent: Math.max(0, errorReduction),
      fatFingerInterceptions,
      averageOffsetPx: Math.round(totalOffset / (totalKeystrokes || 1))
    });

    setStepLogs(logs);
    setIsRunning(false);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Fat-Finger Typing Accuracy Benchmark</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simulates capacitive contact area & human motor jitter to test Traditional Box vs. Dynamic Bayesian Hit-Testing.
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Live Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Phrases & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Benchmark Phrase Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Test Phrase Corpus</label>
          <select
            value={selectedPhrase}
            onChange={(e) => {
              setSelectedPhrase(e.target.value);
              setCustomPhrase("");
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {BENCHMARK_PHRASES.map((p, idx) => (
              <option key={idx} value={p.target}>
                [{p.category.toUpperCase()}] "{p.target}"
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or type a custom test phrase..."
            value={customPhrase}
            onChange={(e) => setCustomPhrase(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-600"
          />
        </div>

        {/* Motor Jitter / Finger Pad Radius Controls */}
        <div className="space-y-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">Motor Jitter Dispersion ($\sigma$):</span>
            <span className="font-mono text-cyan-400 font-bold">{jitterSigma} px</span>
          </div>
          <input
            type="range"
            min="4"
            max="18"
            step="1"
            value={jitterSigma}
            onChange={(e) => setJitterSigma(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Precise (4px)</span>
            <span>Average Tremor (10px)</span>
            <span>High Dexterity Strain (18px)</span>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard (If Run) */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Error Reduction */}
          <div className="bg-emerald-950/30 border border-emerald-800/60 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
              <span>Error Reduction</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-2 font-mono">
              +{metrics.errorReductionPercent}%
            </div>
            <p className="text-[10px] text-emerald-300/70 mt-1">Reduction in adjacent mis-strikes</p>
          </div>

          {/* Fat-Finger Interceptions */}
          <div className="bg-cyan-950/30 border border-cyan-800/60 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold">
              <span>Saved Mis-Taps</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-cyan-300 mt-2 font-mono">
              {metrics.fatFingerInterceptions}
            </div>
            <p className="text-[10px] text-cyan-300/70 mt-1">Typos avoided dynamically</p>
          </div>

          {/* Traditional Errors */}
          <div className="bg-rose-950/30 border border-rose-800/60 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-400 text-xs font-semibold">
              <span>Traditional Errors</span>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-rose-400 mt-2 font-mono">
              {metrics.traditionalErrors}
              <span className="text-xs font-normal text-rose-300/60 ml-1">/ {metrics.totalKeystrokes}</span>
            </div>
            <p className="text-[10px] text-rose-300/70 mt-1">Static bounding-box misses</p>
          </div>

          {/* Bayesian Errors */}
          <div className="bg-indigo-950/30 border border-indigo-800/60 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold">
              <span>Probabilistic Errors</span>
              <Award className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-indigo-300 mt-2 font-mono">
              {metrics.probabilisticErrors}
              <span className="text-xs font-normal text-indigo-300/60 ml-1">/ {metrics.totalKeystrokes}</span>
            </div>
            <p className="text-[10px] text-indigo-300/70 mt-1">Our dynamic engine result</p>
          </div>
        </div>
      )}

      {/* Step-by-Step Keystroke Log Table */}
      {stepLogs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-300">Live Strike-by-Strike Telemetry Log:</h4>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-slate-900/90 text-slate-400 sticky top-0 text-[10px] uppercase">
                <tr>
                  <th className="p-2">Target</th>
                  <th className="p-2">Jitter Distance</th>
                  <th className="p-2">Traditional Hit</th>
                  <th className="p-2">Dynamic Bayesian Hit</th>
                  <th className="p-2">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {stepLogs.map((log, idx) => (
                  <tr key={idx} className={!log.traditionalSuccess && log.probabilisticSuccess ? 'bg-emerald-950/20' : ''}>
                    <td className="p-2 font-bold text-white">'{log.targetChar}'</td>
                    <td className="p-2 text-slate-400">{log.distanceFromCenter} px</td>
                    <td className="p-2">
                      <span className={`inline-flex items-center space-x-1 ${log.traditionalSuccess ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                        {log.traditionalSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>'{log.traditionalChar}'</span>
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`inline-flex items-center space-x-1 ${log.probabilisticSuccess ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                        {log.probabilisticSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>'{log.probabilisticChar}'</span>
                      </span>
                    </td>
                    <td className="p-2 text-[11px]">
                      {!log.traditionalSuccess && log.probabilisticSuccess ? (
                        <span className="text-emerald-400 font-bold bg-emerald-900/40 px-2 py-0.5 rounded">
                          ✨ Saved by Bayesian Prior
                        </span>
                      ) : log.traditionalSuccess && log.probabilisticSuccess ? (
                        <span className="text-slate-500">Accurate</span>
                      ) : (
                        <span className="text-rose-400">Extreme deviation</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
