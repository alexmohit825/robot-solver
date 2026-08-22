import React, { useRef, useState, useMemo } from 'react';
import {
  HitTestResult,
  KeyDefinition,
  KeyboardLayoutMode,
  KeyboardLayer,
  LayoutConfig,
  ShiftState,
  TouchContact
} from '../types/keyboard';
import { generateKeyboardLayout, getDeviceDimensions } from '../engine/KeyboardLayouts';
import { LanguagePriorModel } from '../engine/LanguagePriorModel';
import { SpatialHitEngine } from '../engine/SpatialHitEngine';
import { Sparkles, ArrowDown, Mic, Globe, Smile } from 'lucide-react';

interface ErgonomicKeyboardProps {
  config: LayoutConfig;
  currentText: string;
  priorModel: LanguagePriorModel;
  spatialEngine: SpatialHitEngine;
  onKeyTriggered: (char: string) => void;
  onHitEvaluated: (result: HitTestResult) => void;
  shiftState: ShiftState;
  onShiftChange: (newState: ShiftState) => void;
  onLayoutModeChange: (mode: KeyboardLayoutMode) => void;
  onLayerChange: (layer: KeyboardLayer) => void;
  onToggleAI: () => void;
  onTriggerDictation: () => void;
  onGlobeTapped: () => void;
  onEmojiTapped: () => void;
}

export const ErgonomicKeyboard: React.FC<ErgonomicKeyboardProps> = ({
  config,
  currentText,
  priorModel,
  spatialEngine,
  onKeyTriggered,
  onHitEvaluated,
  shiftState,
  onShiftChange,
  onLayoutModeChange,
  onLayerChange,
  onToggleAI,
  onTriggerDictation,
  onGlobeTapped,
  onEmojiTapped
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTouch, setActiveTouch] = useState<TouchContact | null>(null);
  const [activeTouchKey, setActiveTouchKey] = useState<KeyDefinition | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isFlickDetected, setIsFlickDetected] = useState<boolean>(false);
  const lastSpaceTimestamp = useRef<number>(0);
  const lastShiftTimestamp = useRef<number>(0);
  const lastKeystrokeRef = useRef<{ key: KeyDefinition; touch: TouchContact; timestamp: number } | null>(null);
  const lastBackspaceRef = useRef<{ key: KeyDefinition; touch: TouchContact; timestamp: number; backspaceTime: number } | null>(null);

  // Generate responsive key array based on active layer & active app
  const keys = useMemo(() => {
    return generateKeyboardLayout(
      config.mode,
      config.device,
      config.layer,
      config.keyboardHeight,
      config.bottomGutterPadding,
      config.keyGutter,
      config.includeInlinePunctuation,
      config.activeApp
    );
  }, [
    config.mode,
    config.device,
    config.layer,
    config.keyboardHeight,
    config.bottomGutterPadding,
    config.keyGutter,
    config.includeInlinePunctuation,
    config.activeApp
  ]);

  // Dynamic hitbox scaling (only on alpha layer)
  const dynamicScales = useMemo(() => {
    if (config.layer !== 'alpha') return new Map();
    return spatialEngine.getDynamicHitboxScales(keys, currentText);
  }, [keys, currentText, spatialEngine, config.layer]);

  const priors = useMemo(() => {
    return priorModel.getCharacterPriors(currentText);
  }, [priorModel, currentText]);

  const { width: keyboardW } = getDeviceDimensions(config.device);
  const keyboardH = config.keyboardHeight;

  // Handle Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTouchStartPos({ x, y });
    setIsFlickDetected(false);

    const contact = spatialEngine.simulateContactEllipse(
      x,
      y,
      config.fingerRadiusMm,
      40,
      0.85
    );
    setActiveTouch(contact);

    const result = spatialEngine.dynamicProbabilisticHitTest(contact, keys, currentText);
    setActiveTouchKey(result.selectedKey);
  };

  // Handle Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeTouch || !containerRef.current || !touchStartPos) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dy = y - touchStartPos.y;
    if (dy > 14 && !isFlickDetected) {
      setIsFlickDetected(true);
    } else if (dy <= 10 && isFlickDetected) {
      setIsFlickDetected(false);
    }

    const updatedContact: TouchContact = {
      ...activeTouch,
      x,
      y
    };
    setActiveTouch(updatedContact);
  };

  // Handle Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeTouch || !containerRef.current) {
      setActiveTouch(null);
      setTouchStartPos(null);
      setIsFlickDetected(false);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const finalContact = spatialEngine.simulateContactEllipse(
      x,
      y,
      config.fingerRadiusMm,
      40,
      0.9
    );

    const result = spatialEngine.dynamicProbabilisticHitTest(
      finalContact,
      keys,
      currentText
    );

    onHitEvaluated(result);
    const hitKey = result.selectedKey;

    if (isFlickDetected && hitKey.flickLabel) {
      onKeyTriggered(hitKey.flickLabel);
    } else if (hitKey.id === 'key-hand-swap') {
      onLayoutModeChange(
        config.mode === 'one-handed-right' ? 'one-handed-left' : 'one-handed-right'
      );
    } else if (hitKey.type === 'ai') {
      onToggleAI();
    } else if (hitKey.type === 'globe') {
      onGlobeTapped();
    } else if (hitKey.type === 'emoji') {
      onEmojiTapped();
    } else if (hitKey.type === 'mic') {
      onTriggerDictation();
    } else if (hitKey.id === 'key-mode' || hitKey.label === '123') {
      onLayerChange('numeric');
    } else if (hitKey.id === 'key-symbol-shift' || hitKey.label === '#+=') {
      onLayerChange('symbol');
    } else if (hitKey.id === 'key-numeric-shift') {
      onLayerChange('numeric');
    } else if (hitKey.id === 'key-mode-abc' || hitKey.label === 'ABC') {
      onLayerChange('alpha');
    } else if (hitKey.type === 'shift') {
      const now = Date.now();
      // Double tap shift for CAPS LOCK
      if (now - lastShiftTimestamp.current < 350) {
        onShiftChange('caps-lock');
        lastShiftTimestamp.current = 0;
      } else {
        onShiftChange(shiftState === 'off' ? 'shift' : 'off');
        lastShiftTimestamp.current = now;
      }
    } else if (hitKey.type === 'backspace') {
      if (lastKeystrokeRef.current && Date.now() - lastKeystrokeRef.current.timestamp < 3000) {
        lastBackspaceRef.current = {
          ...lastKeystrokeRef.current,
          backspaceTime: Date.now()
        };
      }
      onKeyTriggered('BACKSPACE');
    } else if (hitKey.type === 'space') {
      const now = Date.now();
      if (now - lastSpaceTimestamp.current < 350) {
        onKeyTriggered('DOUBLE_SPACE_PERIOD');
        lastSpaceTimestamp.current = 0;
      } else {
        onKeyTriggered('SPACE');
        lastSpaceTimestamp.current = now;
      }
    } else if (hitKey.type === 'return') {
      onKeyTriggered('RETURN');
    } else if (hitKey.type === 'punct' || hitKey.type === 'gutter-action') {
      onKeyTriggered(hitKey.label);
    } else {
      // Check if this keystroke is correcting a recent backspaced mistake
      if (
        lastBackspaceRef.current &&
        Date.now() - lastBackspaceRef.current.backspaceTime < 2500 &&
        lastBackspaceRef.current.key.id !== hitKey.id
      ) {
        // Learn from the mistake: shift hitKey's centroid towards the initial strike
        spatialEngine.recordCorrection(
          lastBackspaceRef.current.key,
          hitKey,
          lastBackspaceRef.current.touch.x,
          lastBackspaceRef.current.touch.y
        );
        lastBackspaceRef.current = null;
      } else {
        spatialEngine.calibrateUserBias(finalContact.x, finalContact.y, hitKey);
      }

      lastKeystrokeRef.current = {
        key: hitKey,
        touch: finalContact,
        timestamp: Date.now()
      };
      
      const charToInsert =
        shiftState !== 'off' ? hitKey.label.toUpperCase() : hitKey.label.toLowerCase();
      onKeyTriggered(charToInsert);

      // Auto-reset single shift after one letter
      if (shiftState === 'shift') {
        onShiftChange('off');
      }
    }

    setActiveTouch(null);
    setActiveTouchKey(null);
    setTouchStartPos(null);
    setIsFlickDetected(false);
  };

  const isCapitalized = shiftState !== 'off';

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative select-none touch-none overflow-hidden transition-all ${
        config.appleIntelligenceEnabled && config.showAiGlow
          ? 'shadow-[0_0_25px_rgba(168,85,247,0.15)]'
          : ''
      }`}
      style={{
        width: `${keyboardW}px`,
        height: `${keyboardH}px`,
        paddingBottom: `${config.bottomGutterPadding}px`
      }}
    >
      {/* 1. DEBUG OVERLAY LAYER (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{ width: `${keyboardW}px`, height: `${keyboardH}px` }}
      >
        {config.showDynamicHitboxes &&
          config.layer === 'alpha' &&
          keys.map((key) => {
            const scaleInfo = dynamicScales.get(key.id) || { scaleX: 1, scaleY: 1, prior: 0.02 };
            const expandedW = key.width * scaleInfo.scaleX;
            const expandedH = key.height * scaleInfo.scaleY;
            const expandedX = key.x - (expandedW - key.width) / 2;
            const expandedY = key.y - (expandedH - key.height) / 2;

            const isHighPrior = scaleInfo.prior > 0.12;

            return (
              <rect
                key={`dynamic-${key.id}`}
                x={expandedX}
                y={expandedY}
                width={expandedW}
                height={expandedH}
                rx={8}
                ry={8}
                fill={isHighPrior ? "rgba(16, 185, 129, 0.18)" : "rgba(16, 185, 129, 0.06)"}
                stroke={isHighPrior ? "rgba(52, 211, 153, 0.85)" : "rgba(52, 211, 153, 0.25)"}
                strokeWidth={isHighPrior ? 1.5 : 0.8}
                strokeDasharray={isHighPrior ? undefined : "3 3"}
              />
            );
          })}

        {config.showTraditionalHitboxes &&
          keys.map((key) => (
            <rect
              key={`traditional-${key.id}`}
              x={key.x}
              y={key.y}
              width={key.width}
              height={key.height}
              rx={6}
              ry={6}
              fill="none"
              stroke="rgba(239, 68, 68, 0.4)"
              strokeWidth={1}
            />
          ))}

        {config.showContactEllipse && activeTouch && (
          <g>
            <ellipse
              cx={activeTouch.x}
              cy={activeTouch.y}
              rx={activeTouch.majorRadius}
              ry={activeTouch.minorRadius}
              transform={`rotate(${activeTouch.angle} ${activeTouch.x} ${activeTouch.y})`}
              fill="rgba(56, 189, 248, 0.35)"
              stroke="rgba(56, 189, 248, 0.9)"
              strokeWidth={1.8}
            />
            <circle
              cx={activeTouch.x}
              cy={activeTouch.y}
              r={3}
              fill="#38bdf8"
            />
            {touchStartPos && (
              <line
                x1={touchStartPos.x}
                y1={touchStartPos.y}
                x2={activeTouch.x}
                y2={activeTouch.y}
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="2 2"
              />
            )}
          </g>
        )}
      </svg>

      {/* 2. VISUAL KEYBOARD KEYS */}
      <div className="relative w-full h-full z-10">
        {keys.map((key) => {
          const isPressed = activeTouchKey?.id === key.id;
          const charLower = key.label.toLowerCase();
          const priorVal = priors[charLower] || 0;
          const isHighProbability = config.showLanguagePriors && priorVal > 0.15 && config.layer === 'alpha';

          let bgClasses = 'bg-slate-800/90 text-slate-100 border border-slate-700/80';
          if (key.type === 'space') {
            bgClasses = 'bg-slate-800/80 text-slate-300 border border-slate-700/60';
          } else if (key.type === 'punct' || key.type === 'gutter-action') {
            bgClasses = 'bg-slate-800/95 text-amber-300 font-bold border border-amber-500/40 shadow-sm';
          } else if (key.type === 'backspace' || key.type === 'mode' || key.type === 'special') {
            bgClasses = 'bg-slate-900/90 text-slate-300 border border-slate-800 font-bold';
          } else if (key.type === 'shift') {
            bgClasses =
              shiftState === 'caps-lock'
                ? 'bg-cyan-500 text-slate-950 font-black border-cyan-300 shadow-md shadow-cyan-500/40 ring-2 ring-cyan-400'
                : shiftState === 'shift'
                ? 'bg-slate-100 text-slate-950 font-bold border-white'
                : 'bg-slate-900/90 text-slate-300 border border-slate-800';
          } else if (key.type === 'return') {
            bgClasses = 'bg-blue-600 text-white font-semibold border border-blue-500 shadow-sm';
          } else if (key.type === 'ai') {
            bgClasses = config.appleIntelligenceEnabled
              ? 'bg-gradient-to-r from-pink-500/80 via-purple-600/80 to-cyan-500/80 text-white font-bold border-purple-400/80 shadow-md shadow-purple-500/30'
              : 'bg-slate-900/90 text-purple-400 border border-slate-800';
          } else if (key.type === 'globe' || key.type === 'emoji') {
            bgClasses = 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white';
          } else if (key.type === 'mic') {
            bgClasses = 'bg-slate-900/90 text-cyan-400 border border-slate-800 hover:text-cyan-300';
          }

          if (isPressed) {
            bgClasses = 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-lg scale-95';
          } else if (isHighProbability && key.type === 'char') {
            bgClasses += ' ring-1 ring-emerald-400/60 shadow-[0_0_8px_rgba(52,211,153,0.25)]';
          }

          let displayLabel = key.label;
          if (key.type === 'char' && config.layer === 'alpha') {
            displayLabel = isCapitalized ? key.label.toUpperCase() : key.label.toLowerCase();
          }

          return (
            <div
              key={key.id}
              className={`absolute rounded-xl transition-transform duration-75 flex flex-col items-center justify-center select-none shadow-sm ${bgClasses}`}
              style={{
                left: `${key.x}px`,
                top: `${key.y}px`,
                width: `${key.width}px`,
                height: `${key.height}px`,
                transform: key.rotation ? `rotate(${key.rotation}deg)` : undefined
              }}
            >
              {key.flickLabel && (
                <span className="absolute top-1 right-1.5 text-[9px] font-mono text-slate-400/80 font-medium">
                  {key.flickLabel}
                </span>
              )}

              {config.showLanguagePriors && config.layer === 'alpha' && key.type === 'char' && priorVal > 0.08 && (
                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-emerald-400/90">
                  {(priorVal * 100).toFixed(0)}%
                </span>
              )}

              {/* Icon rendering */}
              {key.type === 'ai' ? (
                <Sparkles className={`w-4 h-4 ${config.appleIntelligenceEnabled ? 'text-white' : 'text-purple-400'}`} />
              ) : key.type === 'mic' ? (
                <Mic className="w-4 h-4 text-cyan-400" />
              ) : key.type === 'shift' ? (
                <span className="text-base font-bold">
                  {shiftState === 'caps-lock' ? '⇪' : '⇧'}
                </span>
              ) : (
                <span
                  className={`font-semibold tracking-tight ${key.type === 'space' ? 'text-xs text-slate-400 uppercase tracking-widest' : ''}`}
                  style={{
                    fontSize: key.type === 'char' || key.type === 'punct' ? `${config.glyphFontSize}px` : undefined
                  }}
                >
                  {displayLabel}
                </span>
              )}

              {isPressed && isFlickDetected && key.flickLabel && (
                <div className="absolute -bottom-6 bg-cyan-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded shadow-lg flex items-center space-x-1 animate-bounce z-50">
                  <ArrowDown className="w-3 h-3" />
                  <span>{key.flickLabel}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
