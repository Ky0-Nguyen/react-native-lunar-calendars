"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.xdateToData = void 0;
var xdate_1 = __importDefault(require("xdate"));
function padNumber(n) {
    if (n < 10) {
        return '0' + n;
    }
    return n.toString();
}
function xdateToData(xdate) {
    var dateString = xdate.toString('yyyy-MM-dd');
    return {
        year: xdate.getFullYear(),
        month: xdate.getMonth() + 1,
        day: xdate.getDate(),
        timestamp: new xdate_1.default(dateString, true).getTime(),
        dateString: dateString
    };
}
exports.xdateToData = xdateToData;
function parseDate(d) {
    if (!d) {
        return undefined;
    }
    else if (typeof d === 'object' && 'timestamp' in d && d.timestamp) { // conventional data timestamp
        return new xdate_1.default(d.timestamp, true);
    }
    else if (d instanceof xdate_1.default) { // xdate
        return new xdate_1.default(d.toString('yyyy-MM-dd'), true);
    }
    else if (d instanceof Date) { // javascript date
        var dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
        return new xdate_1.default(dateString, true);
    }
    else if (typeof d === 'object' && d !== null && 'year' in d && 'month' in d && 'day' in d) {
        var dateData = d;
        var dateString = dateData.year + '-' + padNumber(dateData.month) + '-' + padNumber(dateData.day);
        return new xdate_1.default(dateString, true);
    }
    else if (typeof d === 'string' || typeof d === 'number') { // timestamp number or date formatted as string
        return new xdate_1.default(d.toString(), true);
    }
    return undefined;
}
exports.parseDate = parseDate;
