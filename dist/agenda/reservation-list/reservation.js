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
var xdate_1 = __importDefault(require("xdate"));
var interface_1 = require("../../interface");
var dateutils_1 = __importDefault(require("../../dateutils"));
var style_1 = __importDefault(require("./style"));
var ReservationListItem = /** @class */ (function (_super) {
    __extends(ReservationListItem, _super);
    function ReservationListItem(props) {
        var _this = _super.call(this, props) || this;
        _this.styles = (0, style_1.default)(props.theme);
        return _this;
    }
    ReservationListItem.prototype.shouldComponentUpdate = function (nextProps) {
        var r1 = this.props.item;
        var r2 = nextProps.item;
        var changed = true;
        if (!r1 && !r2) {
            changed = false;
        }
        else if (r1 && r2) {
            if (r1.day.getTime() !== r2.day.getTime()) {
                changed = true;
            }
            else if (!r1.reservation && !r2.reservation) {
                changed = false;
            }
            else if (r1.reservation && r2.reservation) {
                if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
                    changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
                }
            }
        }
        return changed;
    };
    ReservationListItem.prototype.renderDate = function (date, item) {
        if (this.props.renderDay) {
            return this.props.renderDay(date ? (0, interface_1.xdateToData)(date) : undefined, item);
        }
        var today = dateutils_1.default.sameDate(date, (0, xdate_1.default)()) ? this.styles.today : undefined;
        if (date) {
            return (<react_native_1.View style={this.styles.day}>
          <react_native_1.Text allowFontScaling={false} style={[this.styles.dayNum, today]}>{date.getDate()}</react_native_1.Text>
          <react_native_1.Text allowFontScaling={false} style={[this.styles.dayText, today]}>{xdate_1.default.locales[xdate_1.default.defaultLocale].dayNamesShort[date.getDay()]}</react_native_1.Text>
        </react_native_1.View>);
        }
        else {
            return (<react_native_1.View style={this.styles.day}/>);
        }
    };
    ReservationListItem.prototype.render = function () {
        var _a = this.props.item, reservation = _a.reservation, date = _a.date;
        var content;
        if (reservation) {
            var firstItem = date ? true : false;
            content = this.props.renderItem(reservation, firstItem);
        }
        else {
            content = this.props.renderEmptyDate(date);
        }
        return (<react_native_1.View style={this.styles.container}>
        {this.renderDate(date, reservation)}
        <react_native_1.View style={{ flex: 1 }}>
          {content}
        </react_native_1.View>
      </react_native_1.View>);
    };
    return ReservationListItem;
}(react_1.Component));
exports.default = ReservationListItem;
