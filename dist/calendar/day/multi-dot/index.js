"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var prop_types_1 = __importDefault(require("prop-types"));
var component_updater_1 = require("../../../component-updater");
var style_1 = __importDefault(require("./style"));
var Day = /** @class */ (function (_super) {
    __extends(Day, _super);
    function Day(props) {
        var _this = _super.call(this, props) || this;
        _this.style = (0, style_1.default)(props.theme);
        _this.onDayPress = _this.onDayPress.bind(_this);
        _this.onDayLongPress = _this.onDayLongPress.bind(_this);
        return _this;
    }
    Day.prototype.onDayPress = function () {
        this.props.onPress(this.props.date);
    };
    Day.prototype.onDayLongPress = function () {
        this.props.onLongPress(this.props.date);
    };
    Day.prototype.shouldComponentUpdate = function (nextProps) {
        return (0, component_updater_1.shouldUpdate)(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
    };
    Day.prototype.renderDots = function (marking) {
        var baseDotStyle = [this.style.dot, this.style.visibleDot];
        if (marking.dots && Array.isArray(marking.dots) && marking.dots.length > 0) {
            // Filter out dots so that we we process only those items which have key and color property
            var validDots = marking.dots.filter(function (d) { return (d && d.color); });
            return validDots.map(function (dot, index) {
                return (<react_native_1.View key={dot.key ? dot.key : index} style={[baseDotStyle,
                        { backgroundColor: marking.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color }]}/>);
            });
        }
        return;
    };
    Day.prototype.render = function () {
        var containerStyle = [this.style.base];
        var textStyle = [this.style.text];
        var marking = this.props.marking || {};
        var dot = this.renderDots(marking);
        if (marking.selected) {
            containerStyle.push(this.style.selected);
            textStyle.push(this.style.selectedText);
            if (marking.selectedColor) {
                containerStyle.push({ backgroundColor: marking.selectedColor });
            }
        }
        else if (typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled') {
            textStyle.push(this.style.disabledText);
        }
        else if (this.props.state === 'today') {
            textStyle.push(this.style.todayText);
        }
        return (<react_native_1.TouchableOpacity style={containerStyle} onPress={this.onDayPress} onLongPress={this.onDayLongPress}>
        <react_native_1.Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</react_native_1.Text>
        <react_native_1.View style={{ flexDirection: 'row' }}>{dot}</react_native_1.View>
      </react_native_1.TouchableOpacity>);
    };
    Day.propTypes = {
        // TODO: disabled props should be removed
        state: prop_types_1.default.oneOf(['disabled', 'today', '']),
        // Specify theme properties to override specific styles for calendar parts. Default = {}
        theme: prop_types_1.default.object,
        marking: prop_types_1.default.any,
        onPress: prop_types_1.default.func,
        onLongPress: prop_types_1.default.func,
        date: prop_types_1.default.object
    };
    return Day;
}(react_1.Component));
exports.default = Day;
