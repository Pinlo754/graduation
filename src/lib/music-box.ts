/**
 * A tiny generated "music box" lo-fi loop, used only when the configured
 * music file is missing. Everything is scheduled with the Web Audio clock,
 * so it never drifts and costs almost nothing.
 */

const CHORDS: number[][] = [
  [62, 66, 69, 73], // Dmaj7
  [59, 62, 66, 69], // Bm7
  [55, 59, 62, 66], // Gmaj7
  [57, 61, 64, 69], // A
];
const PATTERN = [0, 1, 2, 3, 2, 1, 3, 2];
const STEP_SECONDS = 60 / 76 / 2; // eighth notes at 76 BPM
const LOOKAHEAD = 0.25;

const midiToHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export class MusicBox {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private nextTime = 0;

  constructor(private volume: number) {}

  /** Must be called synchronously inside a user gesture (click / key). */
  unlock(): boolean {
    if (typeof window === "undefined") return false;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return false;
    if (!this.ctx) {
      this.ctx = new Ctor();
      const master = this.ctx.createGain();
      master.gain.value = this.volume * 0.45;
      const tone = this.ctx.createBiquadFilter();
      tone.type = "lowpass";
      tone.frequency.value = 3200;
      const echo = this.ctx.createDelay(1);
      echo.delayTime.value = STEP_SECONDS * 3;
      const feedback = this.ctx.createGain();
      feedback.gain.value = 0.28;
      master.connect(tone);
      tone.connect(this.ctx.destination);
      tone.connect(echo);
      echo.connect(feedback);
      feedback.connect(echo);
      echo.connect(this.ctx.destination);
      this.master = master;
    }
    void this.ctx.resume();
    return true;
  }

  get playing(): boolean {
    return this.timer !== null;
  }

  start(): boolean {
    if (!this.unlock() || !this.ctx) return false;
    if (this.timer) return true;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.schedule(), 60);
    this.schedule();
    return true;
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    void this.ctx?.suspend();
  }

  dispose(): void {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
      const bar = Math.floor(this.step / PATTERN.length) % CHORDS.length;
      const index = this.step % PATTERN.length;
      const chord = CHORDS[bar];
      this.bell(midiToHz(chord[PATTERN[index]] + 12), this.nextTime, index === 0 ? 0.2 : 0.13, 1.8);
      if (index === 0) this.bell(midiToHz(chord[0] - 12), this.nextTime, 0.22, 3.2, "sine");
      if (index === 4) this.bell(midiToHz(chord[2] - 12), this.nextTime, 0.12, 2.4, "sine");
      this.nextTime += STEP_SECONDS;
      this.step++;
    }
  }

  private bell(freq: number, at: number, peak: number, decay: number, wave: OscillatorType = "triangle"): void {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    gain.connect(this.master!);
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(at);
    osc.stop(at + decay + 0.05);
    if (wave === "triangle") {
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.frequency.value = freq * 2;
      shimmerGain.gain.value = 0.18;
      shimmer.connect(shimmerGain);
      shimmerGain.connect(gain);
      shimmer.start(at);
      shimmer.stop(at + decay * 0.5);
    }
  }
}
