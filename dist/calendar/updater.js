"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("../interface");
function shouldComponentUpdate(nextProps, nextState, currentProps, currentState) {
    var _a, _b;
    var shouldUpdate = { update: false };
    // Check selected dates
    var nextSelected = nextProps.selected || [];
    var currentSelected = currentProps.selected || [];
    for (var i = 0; i < nextSelected.length; i++) {
        var next = nextSelected[i];
        var current = currentSelected[i];
        if (!current || !next || ((_a = (0, interface_1.parseDate)(current)) === null || _a === void 0 ? void 0 : _a.getTime()) !== ((_b = (0, interface_1.parseDate)(next)) === null || _b === void 0 ? void 0 : _b.getTime())) {
            shouldUpdate = {
                update: true,
                field: 'selected'
            };
            break;
        }
    }
    // Check markedDates and hideExtraDays
    ['markedDates', 'hideExtraDays'].forEach(function (prop) {
        if (!shouldUpdate.update && nextProps[prop] !== currentProps[prop]) {
            shouldUpdate = {
                update: true,
                field: prop
            };
        }
    });
    // Check date-related props
    ['minDate', 'maxDate', 'current'].forEach(function (prop) {
        if (shouldUpdate.update)
            return;
        var prevDate = currentProps[prop] ? (0, interface_1.parseDate)(currentProps[prop]) : null;
        var nextDate = nextProps[prop] ? (0, interface_1.parseDate)(nextProps[prop]) : null;
        if (prevDate !== nextDate) {
            if (prevDate && nextDate && prevDate.getTime() === nextDate.getTime()) {
                return;
            }
            shouldUpdate = {
                update: true,
                field: prop
            };
        }
    });
    // Check current month
    if (nextState.currentMonth !== currentState.currentMonth) {
        shouldUpdate = {
            update: true,
            field: 'current'
        };
    }
    return shouldUpdate.update;
}
exports.default = shouldComponentUpdate;
