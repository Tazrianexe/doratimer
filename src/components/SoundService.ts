class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (enabled) {
      this.initCtx();
    }
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Cute crisp retro digital click
  playClick() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  // Anywhere Door opening sound (Magic spatial teleportation sweep)
  playDoorOpen() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.4);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(130, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(390, ctx.currentTime + 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.42);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.42);
      osc2.stop(ctx.currentTime + 0.42);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  // Bamboo Copter taking off sound (Ascending helicopter/frequency modulation)
  playCopterStart() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const duration = 0.8;
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + duration);

      // Helicopter blade flutter
      lfo.type = 'sawtooth';
      lfo.frequency.setValueAtTime(15, ctx.currentTime);
      lfo.frequency.linearRampToValueAtTime(30, ctx.currentTime + duration);

      lfoGain.gain.setValueAtTime(40, ctx.currentTime);
      lfoGain.gain.linearRampToValueAtTime(70, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc.start();
      lfo.stop(ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  playCopterStop() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const duration = 0.5;
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + duration);

      lfo.type = 'square';
      lfo.frequency.setValueAtTime(25, ctx.currentTime);
      lfo.frequency.linearRampToValueAtTime(5, ctx.currentTime + duration);

      lfoGain.gain.setValueAtTime(60, ctx.currentTime);
      lfoGain.gain.linearRampToValueAtTime(10, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc.start();
      lfo.stop(ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  // Classic Doraemon gadget reveal fanfare: "Ba-ba-ba-baaam!"
  playGadgetReveal() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const timing = [0, 0.12, 0.24, 0.36];
      const noteDuration = 0.25;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timing[idx]);
        
        const isLast = idx === notes.length - 1;
        const actualDur = isLast ? 0.6 : noteDuration;

        gain.gain.setValueAtTime(0, ctx.currentTime + timing[idx]);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + timing[idx] + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timing[idx] + actualDur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + timing[idx]);
        osc.stop(ctx.currentTime + timing[idx] + actualDur);
      });
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  // Bell chime when session is complete
  playTimerComplete() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const time = ctx.currentTime;
      
      // High frequency metal dings
      const frequencies = [880, 1320, 1760];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time + idx * 0.1);

        gain.gain.setValueAtTime(0, time + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.1, time + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.1 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time + idx * 0.1);
        osc.stop(time + idx * 0.1 + 0.9);
      });

      // Warm underlying synth chord
      const chords = [261.63, 329.63, 392.00, 523.25]; // C major chord
      chords.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 1.5);
      });
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  // Eating dorayaki cartoon munch sound
  playEatDorayaki() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const duration = 0.4;
      const steps = 4;
      
      for (let i = 0; i < steps; i++) {
        const timeOffset = i * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150 + Math.random() * 100, ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + timeOffset + 0.08);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime + timeOffset);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.08);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.08);
      }
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }
}

export const soundService = new SoundService();
