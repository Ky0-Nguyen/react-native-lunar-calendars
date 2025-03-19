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
var style_1 = __importDefault(require("./style"));
var component_updater_1 = require("../../../component-updater");
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
    Day.prototype.render = function () {
        var containerStyle = [this.style.base];
        var textStyle = [this.style.text];
        var marking = this.props.marking || {};
        if (marking && marking.constructor === Array && marking.length) {
            marking = {
                marking: true
            };
        }
        var isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';
        if (marking.selected) {
            containerStyle.push(this.style.selected);
        }
        else if (isDisabled) {
            textStyle.push(this.style.disabledText);
        }
        else if (this.props.state === 'today') {
            textStyle.push(this.style.todayText);
        }
        if (marking.customStyles && typeof marking.customStyles === 'object') {
            var styles = marking.customStyles;
            if (styles.container) {
                if (styles.container.borderRadius === undefined) {
                    styles.container.borderRadius = 16;
                }
                containerStyle.push(styles.container);
            }
            if (styles.text) {
                textStyle.push(styles.text);
            }
        }
        return (<react_native_1.TouchableOpacity style={containerStyle} onPress={this.onDayPress} onLongPress={this.onDayLongPress} activeOpacity={marking.activeOpacity} disabled={marking.disableTouchEvent}>
        <react_native_1.Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</react_native_1.Text>
      </react_native_1.TouchableOpacity>);
    };
    Day.propTypes = {
        // TODO: disabled props should be removed
        state: prop_types_1.default.oneOf(['selected', 'disabled', 'today', '']),
        // Specify theme properties to override specific styles for calendar parts. Default = {}
        theme: prop_types_1.default.object,
        marking: prop_types_1.default.any,
        onPress: prop_types_1.default.func,
        date: prop_types_1.default.object
    };
    return Day;
}(react_1.Component));
exports.default = Day;
