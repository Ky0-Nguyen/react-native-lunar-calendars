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
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var defaultStyle = __importStar(require("../../style"));
var STYLESHEET_ID = 'stylesheet.agenda.list';
function styleConstructor(theme) {
    if (theme === void 0) { theme = {}; }
    var appStyle = __assign(__assign({}, defaultStyle), theme);
    return react_native_1.StyleSheet.create(__assign({ container: {
            flexDirection: 'row'
        }, dayNum: {
            fontSize: 28,
            fontWeight: '200',
            color: appStyle.agendaDayNumColor
        }, dayText: {
            fontSize: 14,
            fontWeight: '300',
            color: appStyle.agendaDayTextColor,
            marginTop: -5,
            backgroundColor: 'rgba(0,0,0,0)'
        }, day: {
            width: 63,
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 32
        }, today: {
            color: appStyle.agendaTodayColor
        } }, (theme[STYLESHEET_ID] || {})));
}
exports.default = styleConstructor;
