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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var defaultStyle = __importStar(require("../style"));
var platform_style_1 = __importDefault(require("./platform-style"));
var STYLESHEET_ID = 'stylesheet.agenda.main';
function styleConstructor(theme) {
    if (theme === void 0) { theme = {}; }
    var appStyle = __assign(__assign({}, defaultStyle), theme);
    var _a = (0, platform_style_1.default)(appStyle), knob = _a.knob, weekdays = _a.weekdays;
    return react_native_1.StyleSheet.create(__assign({ knob: knob, weekdays: weekdays, header: {
            overflow: 'hidden',
            justifyContent: 'flex-end',
            position: 'absolute',
            height: '100%',
            width: '100%',
        }, calendar: {
            flex: 1,
            borderBottomWidth: 1,
            borderColor: appStyle.separatorColor
        }, knobContainer: {
            flex: 1,
            position: 'absolute',
            left: 0,
            right: 0,
            height: 24,
            bottom: 0,
            alignItems: 'center',
            backgroundColor: appStyle.calendarBackground
        }, weekday: {
            width: 32,
            textAlign: 'center',
            fontSize: 13,
            color: appStyle.textSectionTitleColor,
        }, reservations: {
            flex: 1,
            marginTop: 104,
            backgroundColor: appStyle.backgroundColor
        } }, (theme[STYLESHEET_ID] || {})));
}
exports.default = styleConstructor;
