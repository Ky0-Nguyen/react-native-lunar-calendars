"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VelocityTracker = void 0;
var VelocityTracker = /** @class */ (function () {
    function VelocityTracker() {
        this.history = [];
        this.lastPosition = undefined;
        this.lastTimestamp = undefined;
    }
    VelocityTracker.prototype.add = function (position) {
        var timestamp = new Date().valueOf();
        if (this.lastPosition !== undefined && this.lastTimestamp !== undefined && timestamp > this.lastTimestamp) {
            var diff = position - this.lastPosition;
            if (diff > 0.001 || diff < -0.001) {
                this.history.push(diff / (timestamp - this.lastTimestamp));
            }
        }
        this.lastPosition = position;
        this.lastTimestamp = timestamp;
    };
    VelocityTracker.prototype.estimateSpeed = function () {
        var finalTrend = this.history.slice(-3);
        var sum = finalTrend.reduce(function (r, v) { return r + v; }, 0);
        return sum / finalTrend.length;
    };
    VelocityTracker.prototype.reset = function () {
        this.history = [];
        this.lastPosition = undefined;
        this.lastTimestamp = undefined;
    };
    return VelocityTracker;
}());
exports.VelocityTracker = VelocityTracker;
