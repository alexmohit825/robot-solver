import { HitTestResult, KeyDefinition, TouchContact } from '../types/keyboard';
import { LanguagePriorModel } from './LanguagePriorModel';
import { AdaptiveTouchMap } from './AdaptiveTouchMap';

export class SpatialHitEngine {
  private priorModel: LanguagePriorModel;
  private adaptiveTouchMap: AdaptiveTouchMap;
  private userBiasX: number = 0;
  private userBiasY: number = 0;
  private calibrationCount: number = 0;

  constructor(priorModel: LanguagePriorModel, adaptiveTouchMap?: AdaptiveTouchMap) {
    this.priorModel = priorModel;
    this.adaptiveTouchMap = adaptiveTouchMap || new AdaptiveTouchMap();
  }

  public getAdaptiveTouchMap(): AdaptiveTouchMap {
    return this.adaptiveTouchMap;
  }

  /**
   * Resets adaptive personal calibration
   */
  public resetCalibration() {
    this.userBiasX = 0;
    this.userBiasY = 0;
    this.calibrationCount = 0;
    this.adaptiveTouchMap.resetAll();
  }

  /**
   * Updates on-device spatial bias from confirmed keystrokes
   */
  public calibrateUserBias(touchX: number, touchY: number, key: KeyDefinition) {
    const keyCenterX = key.x + key.width / 2;
    const keyCenterY = key.y + key.height / 2;
    const dx = touchX - keyCenterX;
    const dy = touchY - keyCenterY;

    // Exponential moving average update
    const alpha = 0.05;
    this.userBiasX = (1 - alpha) * this.userBiasX + alpha * dx;
    this.userBiasY = (1 - alpha) * this.userBiasY + alpha * dy;
    this.calibrationCount++;

    // Record into personal adaptive touch map
    this.adaptiveTouchMap.recordKeystroke(key, touchX, touchY);
  }

  /**
   * Records a user error correction (backspace followed by new key)
   */
  public recordCorrection(
    mistakenKey: KeyDefinition,
    correctedKey: KeyDefinition,
    mistakeTouchX: number,
    mistakeTouchY: number
  ) {
    this.adaptiveTouchMap.recordCorrection(
      mistakenKey,
      correctedKey,
      mistakeTouchX,
      mistakeTouchY
    );
  }

  /**
   * Converts a finger contact area (radius in mm) to capacitive touch ellipse in screen points
   */
  public simulateContactEllipse(
    rawX: number,
    rawY: number,
    fingerRadiusMm: number = 10,
    angleDeg: number = 45,
    pressure: number = 0.8
  ): TouchContact {
    const mmToPt = 2.8;
    const majorRadius = fingerRadiusMm * mmToPt;
    const minorRadius = majorRadius * (0.65 + 0.15 * (1 - pressure));

    return {
      x: rawX,
      y: rawY,
      majorRadius,
      minorRadius,
      angle: angleDeg,
      pressure,
      timestamp: Date.now()
    };
  }

  /**
   * Evaluates hit-test using standard traditional point-in-rectangle bounding boxes
   */
  public traditionalHitTest(
    contact: TouchContact,
    keys: KeyDefinition[]
  ): KeyDefinition {
    for (const key of keys) {
      if (
        contact.x >= key.x &&
        contact.x <= key.x + key.width &&
        contact.y >= key.y &&
        contact.y <= key.y + key.height
      ) {
        return key;
      }
    }

    let closestKey = keys[0];
    let minDistance = Infinity;
    for (const key of keys) {
      const cx = key.x + key.width / 2;
      const cy = key.y + key.height / 2;
      const dist = Math.hypot(contact.x - cx, contact.y - cy);
      if (dist < minDistance) {
        minDistance = dist;
        closestKey = key;
      }
    }
    return closestKey;
  }

  /**
   * Evaluates Dynamic Probabilistic Hit-Test with Bayesian Fusion, Contact Ellipse Tracking,
   * AND Learned Adaptive Touch Map Centroids.
   */
  public dynamicProbabilisticHitTest(
    contact: TouchContact,
    keys: KeyDefinition[],
    currentBuffer: string,
    priorWeight: number = 0.65
  ): HitTestResult {
    // 1. Calculate pressure-weighted contact ellipse centroid
    const rad = (contact.angle * Math.PI) / 180;
    const centroidShift = (contact.majorRadius - contact.minorRadius) * 0.25 * (1 - contact.pressure);
    const centroidX = contact.x - Math.sin(rad) * centroidShift - this.userBiasX;
    const centroidY = contact.y - Math.cos(rad) * centroidShift - this.userBiasY;

    // 2. Fetch language priors for current typing context
    const charPriors = this.priorModel.getCharacterPriors(currentBuffer);

    const candidates: Array<{
      key: KeyDefinition;
      totalProb: number;
      spatialProb: number;
      priorProb: number;
    }> = [];

    let totalScoreSum = 0;

    for (const key of keys) {
      // Fetch learned adaptive center & variances for this specific key
      const {
        x: targetKeyCenterX,
        y: targetKeyCenterY,
        sigmaX: learnedSigmaX,
        sigmaY: learnedSigmaY
      } = this.adaptiveTouchMap.getAdjustedKeyCenter(key);

      // Dynamic effective sigma combining contact ellipse + learned key variance
      const effectiveSigmaX = Math.max(learnedSigmaX, contact.majorRadius * 0.85);
      const effectiveSigmaY = Math.max(learnedSigmaY, contact.minorRadius * 0.95);

      const dx = centroidX - targetKeyCenterX;
      const dy = centroidY - targetKeyCenterY;

      // 2D Gaussian density calculation with learned centroid & variance
      const exponent = -(
        (dx * dx) / (2 * effectiveSigmaX * effectiveSigmaX) +
        (dy * dy) / (2 * effectiveSigmaY * effectiveSigmaY)
      );
      const spatialLikelihood = Math.exp(exponent);

      // Determine language prior for this key
      let prior = 0.01;
      if (key.type === 'char') {
        const charLower = key.label.toLowerCase();
        prior = charPriors[charLower] || 0.01;
      } else if (key.type === 'space') {
        prior = charPriors[' '] || 0.05;
      } else if (key.type === 'backspace') {
        prior = 0.08;
      } else if (key.type === 'gutter-action') {
        prior = 0.06;
      } else {
        prior = 0.02;
      }

      const combinedScore = spatialLikelihood * Math.pow(prior, priorWeight);

      candidates.push({
        key,
        totalProb: combinedScore,
        spatialProb: spatialLikelihood,
        priorProb: prior
      });

      totalScoreSum += combinedScore;
    }

    for (const candidate of candidates) {
      candidate.totalProb = candidate.totalProb / (totalScoreSum || 1);
    }

    candidates.sort((a, b) => b.totalProb - a.totalProb);

    const bestCandidate = candidates[0];
    const traditionalKey = this.traditionalHitTest(contact, keys);

    return {
      selectedKey: bestCandidate.key,
      traditionalKey,
      confidence: bestCandidate.totalProb,
      priorProb: bestCandidate.priorProb,
      spatialProb: bestCandidate.spatialProb,
      contactPoint: { x: contact.x, y: contact.y },
      ellipseCentroid: { x: centroidX, y: centroidY },
      candidates: candidates.slice(0, 5)
    };
  }

  /**
   * Computes dynamic expansion scaling factors for rendering visual morphing hitboxes
   */
  public getDynamicHitboxScales(
    keys: KeyDefinition[],
    currentBuffer: string
  ): Map<string, { scaleX: number; scaleY: number; prior: number }> {
    const priors = this.priorModel.getCharacterPriors(currentBuffer);
    const scales = new Map<string, { scaleX: number; scaleY: number; prior: number }>();

    let maxPrior = 0.01;
    for (const val of Object.values(priors)) {
      if (val > maxPrior) maxPrior = val;
    }

    for (const key of keys) {
      let prior = 0.02;
      if (key.type === 'char') {
        prior = priors[key.label.toLowerCase()] || 0.02;
      } else if (key.type === 'space') {
        prior = priors[' '] || 0.05;
      }

      const normalizedRatio = prior / (maxPrior || 1);
      const scaleFactor = 0.88 + 0.55 * Math.sqrt(normalizedRatio);

      scales.set(key.id, {
        scaleX: Math.min(1.5, Math.max(0.85, scaleFactor)),
        scaleY: Math.min(1.4, Math.max(0.85, scaleFactor)),
        prior
      });
    }

    return scales;
  }
}
