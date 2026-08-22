/**
 * AudioHapticEngine: Synthesizes high-fidelity iOS keyboard audio clicks using Web Audio API
 * and triggers tactile vibration feedback.
 */
export class AudioHapticEngine {
  private audioCtx: AudioContext | null = null;

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Plays realistic iOS keyboard click audio pulse
   */
  public playKeyClick(type: 'char' | 'space' | 'backspace' | 'return' | 'special' = 'char') {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';

      const now = ctx.currentTime;

      if (type === 'space') {
        // Lower pitch, slightly more resonant tap
        osc.frequency.setValueAtTime(320, now);
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      } else if (type === 'backspace') {
        // Muted, shorter click
        osc.frequency.setValueAtTime(450, now);
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(4, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      } else if (type === 'return') {
        // Crisp, confirmation click
        osc.frequency.setValueAtTime(600, now);
        filter.frequency.setValueAtTime(2200, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else {
        // Standard iOS key click: high frequency subtle mechanical pulse
        osc.frequency.setValueAtTime(750, now);
        filter.frequency.setValueAtTime(2800, now);
        filter.Q.setValueAtTime(3.5, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio context errors if browser restricts audio autoplay
    }
  }

  /**
   * Triggers tactile haptic feedback (using navigator.vibrate if supported)
   */
  public triggerHaptic(durationMs: number = 10) {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // Non-blocking fallback
      }
    }
  }
}
