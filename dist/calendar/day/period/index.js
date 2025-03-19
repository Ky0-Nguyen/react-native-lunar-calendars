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
var react_1 = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var react_native_1 = require("react-native");
var component_updater_1 = require("../../../component-updater");
var lodash_isequal_1 = __importDefault(require("lodash.isequal"));
var defaultStyle = __importStar(require("../../../style"));
var style_1 = __importDefault(require("./style"));
var Day = /** @class */ (function (_super) {
    __extends(Day, _super);
    function Day(props) {
        var _this = _super.call(this, props) || this;
        _this.theme = __assign(__assign({}, defaultStyle), (props.theme || {}));
        _this.style = (0, style_1.default)(props.theme);
        _this.markingStyle = _this.getDrawingStyle(props.marking || []);
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
        var newMarkingStyle = this.getDrawingStyle(nextProps.marking);
        if (!(0, lodash_isequal_1.default)(this.markingStyle, newMarkingStyle)) {
            this.markingStyle = newMarkingStyle;
            return true;
        }
        return (0, component_updater_1.shouldUpdate)(this.props, nextProps, ['state', 'children', 'onPress', 'onLongPress']);
    };
    Day.prototype.getDrawingStyle = function (marking) {
        var _this = this;
        var defaultStyle = { textStyle: {} };
        if (!marking) {
            return defaultStyle;
        }
        if (marking.disabled) {
            defaultStyle.textStyle.color = this.theme.textDisabledColor;
        }
        else if (marking.selected) {
            defaultStyle.textStyle.color = this.theme.selectedDayTextColor;
        }
        var resultStyle = ([marking]).reduce(function (prev, next) {
            if (next.quickAction) {
                if (next.first || next.last) {
                    prev.containerStyle = _this.style.firstQuickAction;
                    prev.textStyle = _this.style.firstQuickActionText;
                    if (next.endSelected && next.first && !next.last) {
                        prev.rightFillerStyle = '#c1e4fe';
                    }
                    else if (next.endSelected && next.last && !next.first) {
                        prev.leftFillerStyle = '#c1e4fe';
                    }
                }
                else if (!next.endSelected) {
                    prev.containerStyle = _this.style.quickAction;
                    prev.textStyle = _this.style.quickActionText;
                }
                else if (next.endSelected) {
                    prev.leftFillerStyle = '#c1e4fe';
                    prev.rightFillerStyle = '#c1e4fe';
                }
                return prev;
            }
            var color = next.color;
            if (next.status === 'NotAvailable') {
                prev.textStyle = _this.style.naText;
            }
            if (next.startingDay) {
                prev.startingDay = {
                    color: color
                };
            }
            if (next.endingDay) {
                prev.endingDay = {
                    color: color
                };
            }
            if (!next.startingDay && !next.endingDay) {
                prev.day = {
                    color: color
                };
            }
            if (next.textColor) {
                prev.textStyle.color = next.textColor;
            }
            return prev;
        }, defaultStyle);
        return resultStyle;
    };
    Day.prototype.render = function () {
        var containerStyle = [this.style.base];
        var textStyle = [this.style.text];
        var leftFillerStyle = {};
        var rightFillerStyle = {};
        var fillerStyle = {};
        var fillers;
        if (this.props.state === 'disabled') {
            textStyle.push(this.style.disabledText);
        }
        else if (this.props.state === 'today') {
            textStyle.push(this.style.todayText);
        }
        if (this.props.marking) {
            containerStyle.push({
                borderRadius: 17
            });
            var flags = this.markingStyle;
            if (flags.textStyle) {
                textStyle.push(flags.textStyle);
            }
            if (flags.containerStyle) {
                containerStyle.push(flags.containerStyle);
            }
            if (flags.leftFillerStyle) {
                leftFillerStyle.backgroundColor = flags.leftFillerStyle;
            }
            if (flags.rightFillerStyle) {
                rightFillerStyle.backgroundColor = flags.rightFillerStyle;
            }
            if (flags.startingDay && !flags.endingDay) {
                leftFillerStyle = {
                    backgroundColor: this.theme.calendarBackground
                };
                rightFillerStyle = {
                    backgroundColor: flags.startingDay.color
                };
                containerStyle.push({
                    backgroundColor: flags.startingDay.color
                });
            }
            else if (flags.endingDay && !flags.startingDay) {
                rightFillerStyle = {
                    backgroundColor: this.theme.calendarBackground
                };
                leftFillerStyle = {
                    backgroundColor: flags.endingDay.color
                };
                containerStyle.push({
                    backgroundColor: flags.endingDay.color
                });
            }
            else if (flags.day) {
                leftFillerStyle = { backgroundColor: flags.day.color };
                rightFillerStyle = { backgroundColor: flags.day.color };
                // #177 bug
                fillerStyle = { backgroundColor: flags.day.color };
            }
            else if (flags.endingDay && flags.startingDay) {
                rightFillerStyle = {
                    backgroundColor: this.theme.calendarBackground
                };
                leftFillerStyle = {
                    backgroundColor: this.theme.calendarBackground
                };
                containerStyle.push({
                    backgroundColor: flags.endingDay.color
                });
            }
            fillers = (<react_native_1.View style={[this.style.fillers, fillerStyle]}>
          <react_native_1.View style={[this.style.leftFiller, leftFillerStyle]}/>
          <react_native_1.View style={[this.style.rightFiller, rightFillerStyle]}/>
        </react_native_1.View>);
        }
        return (<react_native_1.TouchableWithoutFeedback onPress={this.onDayPress} onLongPress={this.onDayLongPress}>
        <react_native_1.View style={this.style.wrapper}>
          {fillers}
          <react_native_1.View style={containerStyle}>
            <react_native_1.Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.TouchableWithoutFeedback>);
    };
    Day.propTypes = {
        // TODO: selected + disabled props should be removed
        state: prop_types_1.default.oneOf(['selected', 'disabled', 'today', '']),
        // Specify theme properties to override specific styles for calendar parts. Default = {}
        theme: prop_types_1.default.object,
        marking: prop_types_1.default.any,
        onPress: prop_types_1.default.func,
        onLongPress: prop_types_1.default.func,
        date: prop_types_1.default.object,
        markingExists: prop_types_1.default.bool,
    };
    return Day;
}(react_1.Component));
exports.default = Day;
