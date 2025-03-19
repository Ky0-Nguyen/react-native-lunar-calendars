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
var calendar_1 = __importDefault(require("../calendar"));
var style_1 = __importDefault(require("./style"));
var CalendarListItem = /** @class */ (function (_super) {
    __extends(CalendarListItem, _super);
    function CalendarListItem(props) {
        var _this = _super.call(this, props) || this;
        _this.style = (0, style_1.default)(props.theme);
        return _this;
    }
    CalendarListItem.prototype.shouldComponentUpdate = function (nextProps) {
        var r1 = this.props.item;
        var r2 = nextProps.item;
        return r1.toString('yyyy MM') !== r2.toString('yyyy MM') || !!(r2.propbump && r2.propbump !== r1.propbump);
    };
    CalendarListItem.prototype.render = function () {
        var row = this.props.item;
        if (row.getTime) {
            return (<calendar_1.default theme={this.props.theme} style={[{ height: this.props.calendarHeight, width: this.props.calendarWidth }, this.style.calendar]} current={row} hideArrows hideExtraDays={this.props.hideExtraDays === undefined ? true : this.props.hideExtraDays} disableMonthChange markedDates={this.props.markedDates} markingType={this.props.markingType} hideDayNames={this.props.hideDayNames} onDayPress={this.props.onDayPress} displayLoadingIndicator={this.props.displayLoadingIndicator} minDate={this.props.minDate} maxDate={this.props.maxDate} firstDay={this.props.firstDay} monthFormat={this.props.monthFormat} dayComponent={this.props.dayComponent} disabledByDefault={this.props.disabledByDefault} showWeekNumbers={this.props.showWeekNumbers}/>);
        }
        else {
            var text = row.toString();
            return (<react_native_1.View style={[{ height: this.props.calendarHeight, width: this.props.calendarWidth }, this.style.placeholder]}>
          <react_native_1.Text allowFontScaling={false} style={this.style.placeholderText}>{text}</react_native_1.Text>
        </react_native_1.View>);
        }
    };
    return CalendarListItem;
}(react_1.Component));
exports.default = CalendarListItem;
