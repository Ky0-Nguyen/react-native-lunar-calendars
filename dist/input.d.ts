export declare class VelocityTracker {
    private history;
    private lastPosition;
    private lastTimestamp;
    constructor();
    add(position: number): void;
    estimateSpeed(): number;
    reset(): void;
}
