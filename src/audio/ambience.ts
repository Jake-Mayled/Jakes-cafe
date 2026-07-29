/**
 * Ambient street soundtrack built with the raw Web Audio API:
 * filtered brown-noise street rumble, a warm slow triangle-wave chord pad,
 * and an occasional bird chirp. No audio files are used.
 */

const MASTER_GAIN = 0.16;
const NOISE_LOWPASS_HZ = 420;
const NOISE_GAIN = 0.5;
/** A minor-ish warm chord (A3, C#4, E4), played an octave down. */
const PAD_CHORD_HZ = [220, 277.18, 329.63] as const;
const CHIRP_MIN_DELAY_MS = 5000;
const CHIRP_RANDOM_DELAY_MS = 9000;
const FIRST_CHIRP_DELAY_MS = 3000;

export class CafeAmbience {
  private ctx: AudioContext | null = null;
  private chirpTimer: ReturnType<typeof setTimeout> | null = null;

  /** Idempotent — safe to call on every enter click. */
  start(): void {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
    this.startStreetNoise(ctx, master);
    this.startChordPad(ctx, master);
    this.scheduleChirp(ctx, master, FIRST_CHIRP_DELAY_MS);
  }

  setMuted(muted: boolean): void {
    if (!this.ctx) return;
    if (muted) {
      void this.ctx.suspend();
    } else {
      void this.ctx.resume();
    }
  }

  dispose(): void {
    if (this.chirpTimer !== null) clearTimeout(this.chirpTimer);
    this.chirpTimer = null;
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }

  private startStreetNoise(ctx: AudioContext, master: GainNode): void {
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = NOISE_LOWPASS_HZ;
    const gain = ctx.createGain();
    gain.gain.value = NOISE_GAIN;
    noise.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(master);
    noise.start();
  }

  private startChordPad(ctx: AudioContext, master: GainNode): void {
    PAD_CHORD_HZ.forEach((frequency, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = frequency / 2;
      const gain = ctx.createGain();
      gain.gain.value = 0.05;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06 + i * 0.02;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      lfo.start();
    });
  }

  private scheduleChirp(ctx: AudioContext, master: GainNode, delayMs: number): void {
    this.chirpTimer = setTimeout(() => {
      if (ctx.state === 'running') this.playChirp(ctx, master);
      this.scheduleChirp(ctx, master, CHIRP_MIN_DELAY_MS + Math.random() * CHIRP_RANDOM_DELAY_MS);
    }, delayMs);
  }

  private playChirp(ctx: AudioContext, master: GainNode): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(master);
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(2600, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1500, t + 0.18);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.03);
    gain.gain.linearRampToValueAtTime(0, t + 0.22);
    osc.start(t);
    osc.stop(t + 0.25);
  }
}
