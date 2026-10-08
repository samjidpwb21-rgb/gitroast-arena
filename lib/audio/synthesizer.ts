/**
 * GitRoast Arena — Pure Web Audio API Sound Synthesizer
 *
 * Generates immediate, crisp procedural sound effects directly in the browser.
 * Zero external audio files required.
 */

export class WebAudioSynthesizer {
  private ctx: AudioContext | null = null;

  constructor() {
    // Lazily created on user interaction
  }

  public async init(): Promise<void> {
    this.getContext();
  }

  public getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Panel Whoosh-in (filtered white noise frequency sweep)
   */
  public playWhoosh(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.26);
    } catch {
      // Ignore audio synthesis errors gracefully
    }
  }

  /**
   * Bubble Pop (sine drop)
   */
  public playPop(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore audio errors gracefully
    }
  }

  /**
   * Burn Sizzle (high-frequency noise burst)
   */
  public playSizzle(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const duration = 0.45;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(2400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + duration + 0.01);
    } catch {
      // Ignore
    }
  }

  /**
   * Soft UI Click
   */
  public playClick(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Ignore
    }
  }

  /**
   * Smirk Stinger (mischievous short pitch slide)
   */
  public playStinger(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(260, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.12);

      osc2.frequency.setValueAtTime(330, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.22);
      osc2.stop(ctx.currentTime + 0.22);
    } catch {
      // Ignore
    }
  }

  /**
   * Synthesized Rimshot (punchy acoustic snap)
   */
  public playRimshot(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Snare body (oscillator pulse)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(190, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

      oscGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Snare rattle (noise hit)
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start();
      noise.start();
      osc.stop(ctx.currentTime + 0.09);
      noise.stop(ctx.currentTime + 0.13);
    } catch {
      // Ignore
    }
  }

  /**
   * Sarcastic Chuckle (staccato 'heh-heh-heh' vocal pulse)
   */
  public playSarcasticChuckle(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bursts = [0, 0.14, 0.28];
      const baseFreqs = [320, 290, 260];

      bursts.forEach((startTime, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sawtooth";
        const freq = baseFreqs[idx] ?? 280;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.75, ctx.currentTime + startTime + 0.09);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(750, ctx.currentTime + startTime);
        filter.Q.setValueAtTime(4.0, ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + 0.11);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Mocking Cackle (dramatic laughing bursts with pitch vibrato)
   */
  public playMockingCackle(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bursts = [0, 0.12, 0.22, 0.34, 0.46];
      const freqs = [380, 420, 360, 320, 260];

      bursts.forEach((timeOffset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        const f = freqs[idx] ?? 300;
        osc.frequency.setValueAtTime(f, ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(f * 0.8, ctx.currentTime + timeOffset + 0.09);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(900, ctx.currentTime + timeOffset);
        filter.Q.setValueAtTime(3.5, ctx.currentTime + timeOffset);

        gain.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
        gain.gain.linearRampToValueAtTime(volume * 0.45, ctx.currentTime + timeOffset + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.11);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Smug Snicker (short ascending smirking stinger)
   */
  public playSmugSnicker(volume: number = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.17);
    } catch {
      // Ignore
    }
  }

  public close(): void {
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
