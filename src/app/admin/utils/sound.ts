export function playOrderNotificationSound() {
  try {
    const ctx = new AudioContext();

    const playTone = (freq: number, startTime: number, duration: number, vol = 0.25) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const t = ctx.currentTime;
    playTone(660, t, 0.18);
    playTone(880, t + 0.18, 0.18);
    playTone(1100, t + 0.36, 0.28);

    setTimeout(() => ctx.close(), 1200);
  } catch {
    // Browser may block AudioContext without prior user gesture — silently ignore
  }
}
