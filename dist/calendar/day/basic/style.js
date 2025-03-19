"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var styleConstructor = function (theme) {
    if (theme === void 0) { theme = {}; }
    var appStyle = __assign({}, theme);
    return react_native_1.StyleSheet.create({
        base: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center'
        },
        text: {
            marginTop: 4,
            fontSize: 14,
            fontWeight: '300',
            color: appStyle.dayTextColor || '#2d4150',
            backgroundColor: 'rgba(0,0,0,0)'
        },
        alignedText: {
            marginTop: 0
        },
        selected: {
            backgroundColor: appStyle.selectedDayBackgroundColor || '#00adf5',
            borderRadius: 16
        },
        disabled: {
            opacity: 0.5
        },
        today: {
            backgroundColor: appStyle.todayBackgroundColor,
            borderRadius: 16
        },
        todayText: {
            color: appStyle.todayTextColor || '#00adf5'
        },
        selectedText: {
            color: appStyle.selectedDayTextColor || '#ffffff'
        },
        disabledText: {
            color: appStyle.textDisabledColor || '#d9e1e8'
        },
        dot: {
            width: 4,
            height: 4,
            marginTop: 1,
            borderRadius: 2,
            opacity: 0,
            position: 'absolute',
            backgroundColor: appStyle.dotColor || '#00adf5'
        },
        visibleDot: {
            opacity: 1,
            backgroundColor: appStyle.dotColor || '#00adf5'
        },
        selectedDot: {
            backgroundColor: appStyle.selectedDotColor || '#ffffff'
        }
    });
};
exports.default = styleConstructor;
