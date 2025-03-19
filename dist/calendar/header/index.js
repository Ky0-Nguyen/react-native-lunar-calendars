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
var style_1 = __importDefault(require("./style"));
var dateutils_1 = require("../../dateutils");
var CalendarHeader = /** @class */ (function (_super) {
    __extends(CalendarHeader, _super);
    function CalendarHeader(props) {
        var _this = _super.call(this, props) || this;
        _this.style = (0, style_1.default)(props.theme);
        _this.addMonth = _this.addMonth.bind(_this);
        _this.substractMonth = _this.substractMonth.bind(_this);
        _this.onPressLeft = _this.onPressLeft.bind(_this);
        _this.onPressRight = _this.onPressRight.bind(_this);
        _this.currentDate = new Date();
        return _this;
    }
    CalendarHeader.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps.month.toString('yyyy MM') !==
            this.props.month.toString('yyyy MM')) {
            return true;
        }
        if (nextProps.showIndicator !== this.props.showIndicator) {
            return true;
        }
        if (nextProps.hideDayNames !== this.props.hideDayNames) {
            return true;
        }
        return false;
    };
    CalendarHeader.prototype.onPressLeft = function () {
        var onPressArrowLeft = this.props.onPressArrowLeft;
        if (typeof onPressArrowLeft === 'function') {
            return onPressArrowLeft(this.substractMonth);
        }
        return this.substractMonth();
    };
    CalendarHeader.prototype.onPressRight = function () {
        var onPressArrowRight = this.props.onPressArrowRight;
        if (typeof onPressArrowRight === 'function') {
            return onPressArrowRight(this.addMonth);
        }
        return this.addMonth();
    };
    CalendarHeader.prototype.substractMonth = function () {
        this.props.addMonth(-1);
    };
    CalendarHeader.prototype.canViewPreviouMonth = function () {
        var month = this.props.month.getMonth();
        var year = this.props.month.getFullYear();
        return month > this.currentDate.getMonth() ||
            (month <= this.currentDate.getMonth() && year > this.currentDate.getFullYear());
    };
    CalendarHeader.prototype.addMonth = function () {
        this.props.addMonth(1);
    };
    CalendarHeader.prototype.render = function () {
        var _this = this;
        var leftArrow = <react_native_1.View />;
        var rightArrow = <react_native_1.View />;
        var weekDaysNames = (0, dateutils_1.weekDayNames)(this.props.firstDay);
        var date = this.props.month;
        var month = (0, dateutils_1.monthName)(date.getMonth());
        var year = date.getFullYear();
        if (!this.props.hideArrows) {
            leftArrow = (<react_native_1.TouchableOpacity onPress={function () { return _this.canViewPreviouMonth() ? _this.onPressLeft() : null; }} style={this.style.arrow} hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}>
          {this.canViewPreviouMonth() && (this.props.renderArrow
                    ? this.props.renderArrow('left')
                    : <react_native_1.Text>{'<'}</react_native_1.Text>)}
        </react_native_1.TouchableOpacity>);
            rightArrow = (<react_native_1.TouchableOpacity onPress={this.onPressRight} style={this.style.arrow} hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}>
          {this.props.renderArrow
                    ? this.props.renderArrow('right')
                    : <react_native_1.Text>{'>'}</react_native_1.Text>}
        </react_native_1.TouchableOpacity>);
        }
        var indicator;
        if (this.props.showIndicator) {
            indicator = <react_native_1.ActivityIndicator />;
        }
        return (<react_native_1.View>
        <react_native_1.View style={[this.style.header, this.props.headerColor]}>
          {leftArrow}
          <react_native_1.View style={[{ flexDirection: 'row' }, this.props.headerColor]}>
            <react_native_1.Text allowFontScaling={false} style={this.style.monthText}>
              {month} {year}
            </react_native_1.Text>
            {indicator}
          </react_native_1.View>
          {rightArrow}
        </react_native_1.View>
        {!this.props.hideDayNames && (<react_native_1.View style={this.style.week}>
            {this.props.weekNumbers && <react_native_1.Text allowFontScaling={false} style={this.style.dayHeader}/>}
            {weekDaysNames.map(function (day, idx) { return (<react_native_1.Text allowFontScaling={false} key={"".concat(date, ".").concat(idx)} accessible={false} style={_this.style.dayHeader} numberOfLines={1}>
                {day}
              </react_native_1.Text>); })}
          </react_native_1.View>)}
      </react_native_1.View>);
    };
    return CalendarHeader;
}(react_1.Component));
exports.default = CalendarHeader;
