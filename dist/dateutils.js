"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = exports.weekDayNames = exports.month = exports.fromTo = exports.isLTE = exports.isGTE = exports.monthName = exports.sameDate = exports.sameMonth = void 0;
var xdate_1 = __importDefault(require("xdate"));
function sameMonth(a, b) {
    return a instanceof xdate_1.default && b instanceof xdate_1.default &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth();
}
exports.sameMonth = sameMonth;
function sameDate(a, b) {
    return a instanceof xdate_1.default && b instanceof xdate_1.default &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}
exports.sameDate = sameDate;
function monthName(month) {
    var _a;
    var locales = xdate_1.default.locales[xdate_1.default.defaultLocale];
    return ((_a = locales === null || locales === void 0 ? void 0 : locales.monthNames) === null || _a === void 0 ? void 0 : _a[month]) || '';
}
exports.monthName = monthName;
function isGTE(a, b) {
    return b.diffDays(a) > -1;
}
exports.isGTE = isGTE;
function isLTE(a, b) {
    return a.diffDays(b) > -1;
}
exports.isLTE = isLTE;
function fromTo(a, b) {
    var days = [];
    var from = +a, to = +b;
    for (; from <= to; from = new xdate_1.default(from, true).addDays(1).getTime()) {
        days.push(new xdate_1.default(from, true));
    }
    return days;
}
exports.fromTo = fromTo;
function month(xd) {
    var year = xd.getFullYear(), month = xd.getMonth();
    var days = new Date(year, month + 1, 0).getDate();
    var firstDay = new xdate_1.default(year, month, 1, 0, 0, 0);
    var lastDay = new xdate_1.default(year, month, days, 0, 0, 0);
    return fromTo(firstDay, lastDay);
}
exports.month = month;
function weekDayNames(firstDayOfWeek) {
    if (firstDayOfWeek === void 0) { firstDayOfWeek = 0; }
    var locales = xdate_1.default.locales[xdate_1.default.defaultLocale];
    var weekDaysNames = locales === null || locales === void 0 ? void 0 : locales.dayNamesShort;
    if (!weekDaysNames) {
        return [];
    }
    var dayShift = firstDayOfWeek % 7;
    if (dayShift) {
        weekDaysNames = __spreadArray(__spreadArray([], weekDaysNames.slice(dayShift), true), weekDaysNames.slice(0, dayShift), true);
    }
    return weekDaysNames;
}
exports.weekDayNames = weekDayNames;
function page(xd, firstDayOfWeek) {
    var days = month(xd);
    var before = [], after = [];
    var fdow = ((7 + firstDayOfWeek) % 7) || 7;
    var ldow = (fdow + 6) % 7;
    firstDayOfWeek = firstDayOfWeek || 0;
    var from = days[0].clone();
    if (from.getDay() !== fdow) {
        from.addDays(-(from.getDay() + 7 - fdow) % 7);
    }
    var to = days[days.length - 1].clone();
    var day = to.getDay();
    if (day !== ldow) {
        to.addDays((ldow + 7 - day) % 7);
    }
    if (isLTE(from, days[0])) {
        before = fromTo(from, days[0]);
    }
    if (isGTE(to, days[days.length - 1])) {
        after = fromTo(days[days.length - 1], to);
    }
    return before.concat(days.slice(1, days.length - 1), after);
}
exports.page = page;
