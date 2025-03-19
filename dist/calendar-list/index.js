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
var react_native_1 = require("react-native");
var prop_types_1 = __importDefault(require("prop-types"));
var xdate_1 = __importDefault(require("xdate"));
var interface_1 = require("../interface");
var style_1 = __importDefault(require("./style"));
var dateutils_1 = __importDefault(require("../dateutils"));
var calendar_1 = __importDefault(require("../calendar"));
var item_1 = __importDefault(require("./item"));
var width = react_native_1.Dimensions.get('window').width;
var CalendarList = /** @class */ (function (_super) {
    __extends(CalendarList, _super);
    function CalendarList(props) {
        var _this = _super.call(this, props) || this;
        _this.pastScrollRange = props.pastScrollRange === undefined ? 50 : props.pastScrollRange;
        _this.futureScrollRange = props.futureScrollRange === undefined ? 50 : props.futureScrollRange;
        _this.style = (0, style_1.default)(props.theme);
        _this.calendarWidth = _this.props.calendarWidth || width;
        _this.calendarHeight = props.calendarHeight;
        var rows = [];
        var texts = [];
        var date = (0, interface_1.parseDate)(props.current) || (0, xdate_1.default)();
        for (var i = 0; i <= _this.pastScrollRange + _this.futureScrollRange; i++) {
            var rangeDate = date.clone().addMonths(i - _this.pastScrollRange, true);
            var rangeDateStr = rangeDate.toString('MMM yyyy');
            texts.push(rangeDateStr);
            /*
             * This selects range around current shown month [-0, +2] or [-1, +1] month for detail calendar rendering.
             * If `this.pastScrollRange` is `undefined` it's equal to `false` or 0 in next condition.
             */
            if (_this.pastScrollRange - 1 <= i && i <= _this.pastScrollRange + 1 || !_this.pastScrollRange && i <= _this.pastScrollRange + 2) {
                rows.push(rangeDate);
            }
            else {
                rows.push(rangeDateStr);
            }
        }
        _this.state = {
            rows: rows,
            texts: texts,
            openDate: date
        };
        _this.onViewableItemsChangedBound = _this.onViewableItemsChanged.bind(_this);
        _this.renderCalendarBound = _this.renderCalendar.bind(_this);
        _this.getItemLayout = _this.getItemLayout.bind(_this);
        _this.onLayout = _this.onLayout.bind(_this);
        return _this;
    }
    CalendarList.prototype.onLayout = function (event) {
        if (this.props.onLayout) {
            this.props.onLayout(event);
        }
    };
    CalendarList.prototype.scrollToDay = function (d, offset, animated) {
        var day = (0, interface_1.parseDate)(d);
        var diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1)));
        var size = this.props.horizontal ? this.calendarWidth : this.calendarHeight;
        var scrollAmount = (size * this.pastScrollRange) + (diffMonths * size) + (offset || 0);
        if (!this.props.horizontal) {
            var week = 0;
            var days = dateutils_1.default.page(day, this.props.firstDay);
            for (var i = 0; i < days.length; i++) {
                week = Math.floor(i / 7);
                if (dateutils_1.default.sameDate(days[i], day)) {
                    scrollAmount += 46 * week;
                    break;
                }
            }
        }
        this.listView.scrollToOffset({ offset: scrollAmount, animated: animated });
    };
    CalendarList.prototype.scrollToMonth = function (m) {
        var month = (0, interface_1.parseDate)(m);
        var scrollTo = month || this.state.openDate;
        var diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(scrollTo.clone().setDate(1)));
        var size = this.props.horizontal ? this.calendarWidth : this.calendarHeight;
        var scrollAmount = (size * this.pastScrollRange) + (diffMonths * size);
        //console.log(month, this.state.openDate);
        //console.log(scrollAmount, diffMonths);
        this.listView.scrollToOffset({ offset: scrollAmount, animated: false });
    };
    CalendarList.prototype.componentWillReceiveProps = function (props) {
        var current = (0, interface_1.parseDate)(this.props.current);
        var nextCurrent = (0, interface_1.parseDate)(props.current);
        if (nextCurrent && current && nextCurrent.getTime() !== current.getTime()) {
            this.scrollToMonth(nextCurrent);
        }
        var rowclone = this.state.rows;
        var newrows = [];
        for (var i = 0; i < rowclone.length; i++) {
            var val = this.state.texts[i];
            if (rowclone[i].getTime) {
                val = rowclone[i].clone();
                val.propbump = rowclone[i].propbump ? rowclone[i].propbump + 1 : 1;
            }
            newrows.push(val);
        }
        this.setState({
            rows: newrows
        });
    };
    CalendarList.prototype.onViewableItemsChanged = function (_a) {
        var viewableItems = _a.viewableItems;
        function rowIsCloseToViewable(index, distance) {
            for (var i = 0; i < viewableItems.length; i++) {
                if (Math.abs(index - parseInt(viewableItems[i].index)) <= distance) {
                    return true;
                }
            }
            return false;
        }
        var rowclone = this.state.rows;
        var newrows = [];
        var visibleMonths = [];
        for (var i = 0; i < rowclone.length; i++) {
            var val = rowclone[i];
            var rowShouldBeRendered = rowIsCloseToViewable(i, 1);
            if (rowShouldBeRendered && !rowclone[i].getTime) {
                val = this.state.openDate.clone().addMonths(i - this.pastScrollRange, true);
            }
            else if (!rowShouldBeRendered) {
                val = this.state.texts[i];
            }
            newrows.push(val);
            if (rowIsCloseToViewable(i, 0)) {
                visibleMonths.push((0, interface_1.xdateToData)(val));
            }
        }
        if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange(visibleMonths);
        }
        this.setState({
            rows: newrows
        });
    };
    CalendarList.prototype.renderCalendar = function (_a) {
        var item = _a.item;
        return (<item_1.default item={item} calendarHeight={this.calendarHeight} calendarWidth={this.props.horizontal ? this.calendarWidth : undefined} {...this.props}/>);
    };
    CalendarList.prototype.getItemLayout = function (data, index) {
        return { length: this.props.horizontal ? this.calendarWidth : this.calendarHeight, offset: (this.props.horizontal ? this.calendarWidth : this.calendarHeight) * index, index: index };
    };
    CalendarList.prototype.getMonthIndex = function (month) {
        var diffMonths = this.state.openDate.diffMonths(month) + this.pastScrollRange;
        return diffMonths;
    };
    CalendarList.prototype.render = function () {
        var _this = this;
        return (<react_native_1.FlatList onLayout={this.onLayout} ref={function (c) { return _this.listView = c; }} 
        //scrollEventThrottle={1000}
        style={[this.style.container, this.props.style]} initialListSize={this.pastScrollRange + this.futureScrollRange + 1} data={this.state.rows} 
        //snapToAlignment='start'
        //snapToInterval={this.calendarHeight}
        removeClippedSubviews={this.props.removeClippedSubviews !== undefined ? this.props.removeClippedSubviews : (react_native_1.Platform.OS === 'android' ? false : true)} pageSize={1} horizontal={this.props.horizontal || false} pagingEnabled={this.props.pagingEnabled} onViewableItemsChanged={this.onViewableItemsChangedBound} renderItem={this.renderCalendarBound} showsVerticalScrollIndicator={this.props.showScrollIndicator !== undefined ? this.props.showScrollIndicator : false} showsHorizontalScrollIndicator={this.props.showScrollIndicator !== undefined ? this.props.showScrollIndicator : false} scrollEnabled={this.props.scrollingEnabled !== undefined ? this.props.scrollingEnabled : true} keyExtractor={function (item, index) { return String(index); }} initialScrollIndex={this.state.openDate ? this.getMonthIndex(this.state.openDate) : false} getItemLayout={this.getItemLayout} scrollsToTop={this.props.scrollsToTop !== undefined ? this.props.scrollsToTop : false}/>);
    };
    CalendarList.propTypes = __assign(__assign({}, calendar_1.default.propTypes), { 
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange: prop_types_1.default.number, 
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange: prop_types_1.default.number, 
        // Enable or disable scrolling of calendar list
        scrollEnabled: prop_types_1.default.bool, 
        // Enable or disable vertical scroll indicator. Default = false
        showScrollIndicator: prop_types_1.default.bool, 
        // When true, the calendar list scrolls to top when the status bar is tapped. Default = true
        scrollsToTop: prop_types_1.default.bool, 
        // Enable or disable paging on scroll
        pagingEnabled: prop_types_1.default.bool, 
        // Used when calendar scroll is horizontal, default is device width, pagination should be disabled
        calendarWidth: prop_types_1.default.number, 
        // Whether the scroll is horizontal
        horizontal: prop_types_1.default.bool, 
        // Dynamic calendar height
        calendarHeight: prop_types_1.default.number });
    return CalendarList;
}(react_1.Component));
CalendarList.defaultProps = {
    calendarHeight: 360
};
exports.default = CalendarList;
