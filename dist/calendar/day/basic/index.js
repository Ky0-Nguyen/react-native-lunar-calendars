"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var style_1 = __importDefault(require("./style"));
var Day = function (_a) {
    var state = _a.state, theme = _a.theme, onPress = _a.onPress, onLongPress = _a.onLongPress, date = _a.date, marking = _a.marking, children = _a.children;
    var style = (0, style_1.default)(theme);
    var containerStyle = [style.base];
    var textStyle = [style.text];
    if (state === 'disabled') {
        textStyle.push(style.disabledText);
    }
    else if (state === 'today') {
        containerStyle.push(style.today);
        textStyle.push(style.todayText);
    }
    if (marking) {
        containerStyle.push(style.marked);
        if (marking.disabled) {
            textStyle.push(style.disabledText);
        }
    }
    return (<react_native_1.TouchableOpacity style={containerStyle} onPress={function () { return onPress === null || onPress === void 0 ? void 0 : onPress(date); }} onLongPress={function () { return onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(date); }} disabled={marking === null || marking === void 0 ? void 0 : marking.disableTouchEvent}>
      <react_native_1.Text style={textStyle}>{children}</react_native_1.Text>
    </react_native_1.TouchableOpacity>);
};
exports.default = Day;
