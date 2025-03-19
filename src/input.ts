export class VelocityTracker {
  private history: number[];
  private lastPosition: number | undefined;
  private lastTimestamp: number | undefined;

  constructor() {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }

  add(position: number): void {
    const timestamp = new Date().valueOf();
    if (this.lastPosition !== undefined && this.lastTimestamp !== undefined && timestamp > this.lastTimestamp) {
      const diff = position - this.lastPosition;
      if (diff > 0.001 || diff < -0.001) {
        this.history.push(diff / (timestamp - this.lastTimestamp));
      }
    }
    this.lastPosition = position;
    this.lastTimestamp = timestamp;
  }

  estimateSpeed(): number {
    const finalTrend = this.history.slice(-3);
    const sum = finalTrend.reduce((r, v) => r + v, 0);
    return sum / finalTrend.length;
  }

  reset(): void {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }
} 