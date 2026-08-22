import { KeyDefinition } from '../types/keyboard';

export interface KeyTouchStats {
  keyId: string;
  char: string;
  offsetX: number; // learned centroid delta X in pt
  offsetY: number; // learned centroid delta Y in pt
  varianceX: number; // learned variance sigma X
  varianceY: number; // learned variance sigma Y
  sampleCount: number;
  correctionCount: number; // times backspaced and re-typed
  recentStrikes: Array<{ x: number; y: number; isCorrection: boolean; timestamp: number }>;
}

export interface TouchLearningEvent {
  keyId: string;
  char: string;
  deltaX: number;
  deltaY: number;
  totalSamples: number;
  type: 'strike' | 'correction';
}

/**
 * AdaptiveTouchMap:
 * Implements continuous On-Device Bayesian Centroid & Variance Learning.
 * Learns from every keystroke, backspace error-correction, and autocorrect trigger,
 * adjusting the invisible hitboxes to the user's personal biomechanical motor patterns over time.
 */
export class AdaptiveTouchMap {
  private keyStats: Map<string, KeyTouchStats> = new Map();
  private learningRate: number = 0.20; // Alpha for Exponential Moving Average (EMA)
  private onLearningEventCallbacks: Array<(event: TouchLearningEvent) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  public setLearningRate(rate: number) {
    this.learningRate = Math.max(0.05, Math.min(0.5, rate));
  }

  public getLearningRate(): number {
    return this.learningRate;
  }

  public onLearningEvent(callback: (event: TouchLearningEvent) => void) {
    this.onLearningEventCallbacks.push(callback);
  }

  private notifyLearning(event: TouchLearningEvent) {
    this.onLearningEventCallbacks.forEach((cb) => cb(event));
  }

  public getStatsForKey(keyId: string): KeyTouchStats | undefined {
    return this.keyStats.get(keyId);
  }

  public getAllStats(): KeyTouchStats[] {
    return Array.from(this.keyStats.values());
  }

  /**
   * Returns adjusted strike centroid for a key including learned personal bias
   */
  public getAdjustedKeyCenter(key: KeyDefinition): { x: number; y: number; sigmaX: number; sigmaY: number } {
    const stats = this.keyStats.get(key.id);
    const baseX = key.x + key.width / 2;
    const baseY = key.y + key.height / 2;

    if (!stats || stats.sampleCount < 2) {
      return {
        x: baseX,
        y: baseY,
        sigmaX: key.width * 0.45,
        sigmaY: key.height * 0.50
      };
    }

    return {
      x: baseX + stats.offsetX,
      y: baseY + stats.offsetY,
      sigmaX: Math.max(14, stats.varianceX),
      sigmaY: Math.max(16, stats.varianceY)
    };
  }

  /**
   * Records a regular successful keystroke, updating touch centroid via EMA
   */
  public recordKeystroke(
    key: KeyDefinition,
    touchX: number,
    touchY: number
  ) {
    const baseX = key.x + key.width / 2;
    const baseY = key.y + key.height / 2;
    const diffX = touchX - baseX;
    const diffY = touchY - baseY;

    let stats = this.keyStats.get(key.id);
    if (!stats) {
      stats = {
        keyId: key.id,
        char: key.label,
        offsetX: diffX * 0.3,
        offsetY: diffY * 0.3,
        varianceX: key.width * 0.45,
        varianceY: key.height * 0.50,
        sampleCount: 1,
        correctionCount: 0,
        recentStrikes: []
      };
    } else {
      // Exponential Moving Average Update: theta_new = theta_old + alpha * (observed - theta_old)
      const alpha = Math.min(this.learningRate, 1.0 / (stats.sampleCount + 1));
      stats.offsetX = stats.offsetX + alpha * (diffX - stats.offsetX);
      stats.offsetY = stats.offsetY + alpha * (diffY - stats.offsetY);

      // Variance learning
      const devX = Math.abs(diffX - stats.offsetX);
      const devY = Math.abs(diffY - stats.offsetY);
      stats.varianceX = stats.varianceX + alpha * (devX * 1.5 - stats.varianceX);
      stats.varianceY = stats.varianceY + alpha * (devY * 1.5 - stats.varianceY);

      stats.sampleCount += 1;
    }

    // Keep last 15 strike points for live heatmap rendering
    stats.recentStrikes.push({
      x: touchX,
      y: touchY,
      isCorrection: false,
      timestamp: Date.now()
    });
    if (stats.recentStrikes.length > 15) {
      stats.recentStrikes.shift();
    }

    this.keyStats.set(key.id, stats);
    this.saveToStorage();

    this.notifyLearning({
      keyId: key.id,
      char: key.label,
      deltaX: stats.offsetX,
      deltaY: stats.offsetY,
      totalSamples: stats.sampleCount,
      type: 'strike'
    });
  }

  /**
   * CRITICAL LEARNING: When user typed wrongKey, backspaced, and typed correctedKey,
   * we heavily shift correctedKey's centroid towards the initial touch position.
   */
  public recordCorrection(
    mistakenKey: KeyDefinition,
    correctedKey: KeyDefinition,
    mistakeTouchX: number,
    mistakeTouchY: number
  ) {
    const correctedBaseX = correctedKey.x + correctedKey.width / 2;
    const correctedBaseY = correctedKey.y + correctedKey.height / 2;
    const trueIntentDiffX = mistakeTouchX - correctedBaseX;
    const trueIntentDiffY = mistakeTouchY - correctedBaseY;

    let stats = this.keyStats.get(correctedKey.id);
    if (!stats) {
      stats = {
        keyId: correctedKey.id,
        char: correctedKey.label,
        offsetX: trueIntentDiffX * 0.45,
        offsetY: trueIntentDiffY * 0.45,
        varianceX: correctedKey.width * 0.55,
        varianceY: correctedKey.height * 0.60,
        sampleCount: 2,
        correctionCount: 1,
        recentStrikes: []
      };
    } else {
      // Fast adaptive boost on corrected errors (learningRate * 1.8)
      const correctionAlpha = Math.min(0.45, this.learningRate * 1.8);
      stats.offsetX = stats.offsetX + correctionAlpha * (trueIntentDiffX - stats.offsetX);
      stats.offsetY = stats.offsetY + correctionAlpha * (trueIntentDiffY - stats.offsetY);
      stats.sampleCount += 1;
      stats.correctionCount += 1;
    }

    stats.recentStrikes.push({
      x: mistakeTouchX,
      y: mistakeTouchY,
      isCorrection: true,
      timestamp: Date.now()
    });
    if (stats.recentStrikes.length > 15) {
      stats.recentStrikes.shift();
    }

    this.keyStats.set(correctedKey.id, stats);
    this.saveToStorage();

    this.notifyLearning({
      keyId: correctedKey.id,
      char: correctedKey.label,
      deltaX: stats.offsetX,
      deltaY: stats.offsetY,
      totalSamples: stats.sampleCount,
      type: 'correction'
    });
  }

  /**
   * Simulates typical human thumb drift patterns (e.g. right thumb downward pull on right-side keys)
   * for live demonstration and testing.
   */
  public simulateThumbDriftPattern(keys: KeyDefinition[], pattern: 'right-thumb-downward' | 'left-thumb-slant' | 'fat-finger-spread') {
    for (const key of keys) {
      if (key.type !== 'char') continue;
      const char = key.label.toUpperCase();
      let shiftX = 0;
      let shiftY = 0;

      if (pattern === 'right-thumb-downward') {
        // Right thumb tends to strike lower-left of right side keys (P, O, L, K, M)
        if (['P', 'O', 'I', 'L', 'K', 'J', 'M', 'N'].includes(char)) {
          shiftX = -4.5 + Math.random() * 2;
          shiftY = 5.5 + Math.random() * 3;
        } else {
          shiftX = 1.0;
          shiftY = 2.0;
        }
      } else if (pattern === 'left-thumb-slant') {
        // Left thumb tends to strike lower-right of left keys (Q, W, A, S, Z)
        if (['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X'].includes(char)) {
          shiftX = 4.0 + Math.random() * 2;
          shiftY = 5.0 + Math.random() * 3;
        }
      } else {
        // Fat finger spread (perimeter drift outward)
        shiftX = (key.hand === 'right' ? 3.5 : -3.5);
        shiftY = 4.0;
      }

      this.keyStats.set(key.id, {
        keyId: key.id,
        char: key.label,
        offsetX: shiftX,
        offsetY: shiftY,
        varianceX: key.width * 0.55,
        varianceY: key.height * 0.60,
        sampleCount: 18,
        correctionCount: 5,
        recentStrikes: [
          { x: key.x + key.width / 2 + shiftX, y: key.y + key.height / 2 + shiftY, isCorrection: true, timestamp: Date.now() }
        ]
      });
    }
    this.saveToStorage();
  }

  public resetAll() {
    this.keyStats.clear();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('ergokey_adaptive_touch_map');
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const serialized = JSON.stringify(Array.from(this.keyStats.entries()));
        localStorage.setItem('ergokey_adaptive_touch_map', serialized);
      } catch {
        // Fallback
      }
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('ergokey_adaptive_touch_map');
        if (saved) {
          const entries: [string, KeyTouchStats][] = JSON.parse(saved);
          this.keyStats = new Map(entries);
        }
      } catch {
        // Fallback
      }
    }
  }
}
