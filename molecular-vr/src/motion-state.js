// Inspection timing is user-selected presentation timing, never physical time.
export class SnapshotPlayback {
  constructor(count, seconds = 4) {
    if (!Number.isInteger(count) || count < 2) throw new Error('At least two states are required');
    this.count = count;
    this.seconds = seconds;
    this.position = 0;
    this.elapsed = 0;
    this.playing = false;
    this.interpolate = false;
  }
  seek(value) {
    if (!Number.isFinite(value)) return;
    this.position = Math.max(0, Math.min(this.count - 1, this.interpolate ? value : Math.round(value)));
    this.elapsed = 0;
    if (this.position === this.count - 1) this.playing = false;
  }
  setInterpolation(enabled) {
    this.interpolate = Boolean(enabled);
    this.seek(Math.round(this.position));
  }
  toggle() {
    if (!this.playing && this.position === this.count - 1) this.seek(0);
    this.playing = !this.playing;
  }
  step(direction = 1) {
    this.playing = false;
    this.seek((direction > 0 ? Math.floor(this.position) : Math.ceil(this.position)) + direction);
  }
  update(delta) {
    if (!this.playing || !Number.isFinite(delta) || delta <= 0) return false;
    const before = this.position;
    if (this.interpolate) {
      this.position = Math.min(this.count - 1, this.position + delta / this.seconds);
    } else {
      this.elapsed += delta;
      if (this.elapsed >= this.seconds) {
        const steps = Math.floor(this.elapsed / this.seconds);
        this.elapsed %= this.seconds;
        this.position = Math.min(this.count - 1, this.position + steps);
      }
    }
    if (this.position === this.count - 1) this.playing = false;
    return this.position !== before;
  }
}
