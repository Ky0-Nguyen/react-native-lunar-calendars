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
var dateutils_1 = __importDefault(require("../dateutils"));
var calendar_list_1 = __importDefault(require("../calendar-list"));
var reservation_list_1 = __importDefault(require("./reservation-list"));
var style_1 = __importDefault(require("./style"));
var input_1 = require("../input");
var HEADER_HEIGHT = 104;
var KNOB_HEIGHT = 24;
//Fallback when RN version is < 0.44
var viewPropTypes = react_native_1.ViewPropTypes || react_native_1.View.propTypes;
var AgendaView = /** @class */ (function (_super) {
    __extends(AgendaView, _super);
    function AgendaView(props) {
        var _this = _super.call(this, props) || this;
        _this.styles = (0, style_1.default)(props.theme);
        var windowSize = react_native_1.Dimensions.get('window');
        _this.viewHeight = windowSize.height;
        _this.viewWidth = windowSize.width;
        _this.scrollTimeout = undefined;
        _this.headerState = 'idle';
        _this.state = {
            scrollY: new react_native_1.Animated.Value(0),
            calendarIsReady: false,
            calendarScrollable: false,
            firstResevationLoad: false,
            selectedDay: (0, interface_1.parseDate)(_this.props.selected) || (0, xdate_1.default)(true),
            topDay: (0, interface_1.parseDate)(_this.props.selected) || (0, xdate_1.default)(true),
        };
        _this.currentMonth = _this.state.selectedDay.clone();
        _this.onLayout = _this.onLayout.bind(_this);
        _this.onScrollPadLayout = _this.onScrollPadLayout.bind(_this);
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.onStartDrag = _this.onStartDrag.bind(_this);
        _this.onSnapAfterDrag = _this.onSnapAfterDrag.bind(_this);
        _this.generateMarkings = _this.generateMarkings.bind(_this);
        _this.knobTracker = new input_1.VelocityTracker();
        _this.state.scrollY.addListener(function (_a) {
            var value = _a.value;
            return _this.knobTracker.add(value);
        });
        return _this;
    }
    AgendaView.prototype.calendarOffset = function () {
        return 90 - (this.viewHeight / 2);
    };
    AgendaView.prototype.initialScrollPadPosition = function () {
        return Math.max(0, this.viewHeight - HEADER_HEIGHT);
    };
    AgendaView.prototype.setScrollPadPosition = function (y, animated) {
        this.scrollPad._component.scrollTo({ x: 0, y: y, animated: animated });
    };
    AgendaView.prototype.onScrollPadLayout = function () {
        var _this = this;
        // When user touches knob, the actual component that receives touch events is a ScrollView.
        // It needs to be scrolled to the bottom, so that when user moves finger downwards,
        // scroll position actually changes (it would stay at 0, when scrolled to the top).
        this.setScrollPadPosition(this.initialScrollPadPosition(), false);
        // delay rendering calendar in full height because otherwise it still flickers sometimes
        setTimeout(function () { return _this.setState({ calendarIsReady: true }); }, 0);
    };
    AgendaView.prototype.onLayout = function (event) {
        this.viewHeight = event.nativeEvent.layout.height;
        this.viewWidth = event.nativeEvent.layout.width;
        this.forceUpdate();
    };
    AgendaView.prototype.onTouchStart = function () {
        this.headerState = 'touched';
        if (this.knob) {
            this.knob.setNativeProps({ style: { opacity: 0.5 } });
        }
    };
    AgendaView.prototype.onTouchEnd = function () {
        if (this.knob) {
            this.knob.setNativeProps({ style: { opacity: 1 } });
        }
        if (this.headerState === 'touched') {
            this.setScrollPadPosition(0, true);
            this.enableCalendarScrolling();
        }
        this.headerState = 'idle';
    };
    AgendaView.prototype.onStartDrag = function () {
        this.headerState = 'dragged';
        this.knobTracker.reset();
    };
    AgendaView.prototype.onSnapAfterDrag = function (e) {
        // on Android onTouchEnd is not called if dragging was started
        this.onTouchEnd();
        var currentY = e.nativeEvent.contentOffset.y;
        this.knobTracker.add(currentY);
        var projectedY = currentY + this.knobTracker.estimateSpeed() * 250 /*ms*/;
        var maxY = this.initialScrollPadPosition();
        var snapY = (projectedY > maxY / 2) ? maxY : 0;
        this.setScrollPadPosition(snapY, true);
        if (snapY === 0) {
            this.enableCalendarScrolling();
        }
    };
    AgendaView.prototype.onVisibleMonthsChange = function (months) {
        var _this = this;
        if (this.props.items && !this.state.firstResevationLoad) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(function () {
                if (_this.props.loadItemsForMonth && _this._isMounted) {
                    _this.props.loadItemsForMonth(months[0]);
                }
            }, 200);
        }
    };
    AgendaView.prototype.loadReservations = function (props) {
        var _this = this;
        if ((!props.items || !Object.keys(props.items).length) && !this.state.firstResevationLoad) {
            this.setState({
                firstResevationLoad: true
            }, function () {
                if (_this.props.loadItemsForMonth) {
                    _this.props.loadItemsForMonth((0, interface_1.xdateToData)(_this.state.selectedDay));
                }
            });
        }
    };
    AgendaView.prototype.componentWillMount = function () {
        this._isMounted = true;
    };
    AgendaView.prototype.componentDidMount = function () {
        this.loadReservations(this.props);
    };
    AgendaView.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    AgendaView.prototype.componentWillReceiveProps = function (props) {
        if (props.items) {
            this.setState({
                firstResevationLoad: false
            });
        }
        else {
            this.loadReservations(props);
        }
    };
    AgendaView.prototype.enableCalendarScrolling = function () {
        this.setState({
            calendarScrollable: true
        });
        if (this.props.onCalendarToggled) {
            this.props.onCalendarToggled(true);
        }
        // Enlarge calendarOffset here as a workaround on iOS to force repaint.
        // Otherwise the month after current one or before current one remains invisible.
        // The problem is caused by overflow: 'hidden' style, which we need for dragging
        // to be performant.
        // Another working solution for this bug would be to set removeClippedSubviews={false}
        // in CalendarList listView, but that might impact performance when scrolling
        // month list in expanded CalendarList.
        // Further info https://github.com/facebook/react-native/issues/1831
        this.calendar.scrollToDay(this.state.selectedDay, this.calendarOffset() + 1, true);
    };
    AgendaView.prototype._chooseDayFromCalendar = function (d) {
        this.chooseDay(d, !this.state.calendarScrollable);
    };
    AgendaView.prototype.chooseDay = function (d, optimisticScroll) {
        var day = (0, interface_1.parseDate)(d);
        this.setState({
            calendarScrollable: false,
            selectedDay: day.clone()
        });
        if (this.props.onCalendarToggled) {
            this.props.onCalendarToggled(false);
        }
        if (!optimisticScroll) {
            this.setState({
                topDay: day.clone()
            });
        }
        this.setScrollPadPosition(this.initialScrollPadPosition(), true);
        this.calendar.scrollToDay(day, this.calendarOffset(), true);
        if (this.props.loadItemsForMonth) {
            this.props.loadItemsForMonth((0, interface_1.xdateToData)(day));
        }
        if (this.props.onDayPress) {
            this.props.onDayPress((0, interface_1.xdateToData)(day));
        }
    };
    AgendaView.prototype.renderReservations = function () {
        var _this = this;
        return (<reservation_list_1.default rowHasChanged={this.props.rowHasChanged} renderItem={this.props.renderItem} renderDay={this.props.renderDay} renderEmptyDate={this.props.renderEmptyDate} reservations={this.props.items} selectedDay={this.state.selectedDay} renderEmptyData={this.props.renderEmptyData} topDay={this.state.topDay} onDayChange={this.onDayChange.bind(this)} onScroll={function () { }} ref={function (c) { return _this.list = c; }} theme={this.props.theme}/>);
    };
    AgendaView.prototype.onDayChange = function (day) {
        var newDate = (0, interface_1.parseDate)(day);
        var withAnimation = dateutils_1.default.sameMonth(newDate, this.state.selectedDay);
        this.calendar.scrollToDay(day, this.calendarOffset(), withAnimation);
        this.setState({
            selectedDay: (0, interface_1.parseDate)(day)
        });
        if (this.props.onDayChange) {
            this.props.onDayChange((0, interface_1.xdateToData)(newDate));
        }
    };
    AgendaView.prototype.generateMarkings = function () {
        var _a;
        var _this = this;
        var markings = this.props.markedDates;
        if (!markings) {
            markings = {};
            Object.keys(this.props.items || {}).forEach(function (key) {
                if (_this.props.items[key] && _this.props.items[key].length) {
                    markings[key] = { marked: true };
                }
            });
        }
        var key = this.state.selectedDay.toString('yyyy-MM-dd');
        return __assign(__assign({}, markings), (_a = {}, _a[key] = __assign(__assign({}, (markings[key] || {})), { selected: true }), _a));
    };
    AgendaView.prototype.render = function () {
        var _this = this;
        var agendaHeight = Math.max(0, this.viewHeight - HEADER_HEIGHT);
        var weekDaysNames = dateutils_1.default.weekDayNames(this.props.firstDay);
        var weekdaysStyle = [this.styles.weekdays, {
                opacity: this.state.scrollY.interpolate({
                    inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                }),
                transform: [{ translateY: this.state.scrollY.interpolate({
                            inputRange: [Math.max(0, agendaHeight - HEADER_HEIGHT), agendaHeight],
                            outputRange: [-HEADER_HEIGHT, 0],
                            extrapolate: 'clamp',
                        }) }]
            }];
        var headerTranslate = this.state.scrollY.interpolate({
            inputRange: [0, agendaHeight],
            outputRange: [agendaHeight, 0],
            extrapolate: 'clamp',
        });
        var contentTranslate = this.state.scrollY.interpolate({
            inputRange: [0, agendaHeight],
            outputRange: [0, agendaHeight / 2],
            extrapolate: 'clamp',
        });
        var headerStyle = [
            this.styles.header,
            { bottom: agendaHeight, transform: [{ translateY: headerTranslate }] },
        ];
        if (!this.state.calendarIsReady) {
            // limit header height until everything is setup for calendar dragging
            headerStyle.push({ height: 0 });
            // fill header with appStyle.calendarBackground background to reduce flickering
            weekdaysStyle.push({ height: HEADER_HEIGHT });
        }
        var shouldAllowDragging = !this.props.hideKnob && !this.state.calendarScrollable;
        var scrollPadPosition = (shouldAllowDragging ? HEADER_HEIGHT : 0) - KNOB_HEIGHT;
        var scrollPadStyle = {
            position: 'absolute',
            width: 80,
            height: KNOB_HEIGHT,
            top: scrollPadPosition,
            left: (this.viewWidth - 80) / 2,
        };
        var knob = (<react_native_1.View style={this.styles.knobContainer}/>);
        if (!this.props.hideKnob) {
            var knobView = this.props.renderKnob ? this.props.renderKnob() : (<react_native_1.View style={this.styles.knob}/>);
            knob = this.state.calendarScrollable ? null : (<react_native_1.View style={this.styles.knobContainer}>
          <react_native_1.View ref={function (c) { return _this.knob = c; }}>{knobView}</react_native_1.View>
        </react_native_1.View>);
        }
        return (<react_native_1.View onLayout={this.onLayout} style={[this.props.style, { flex: 1, overflow: 'hidden' }]}>
        <react_native_1.View style={this.styles.reservations}>
          {this.renderReservations()}
        </react_native_1.View>
        <react_native_1.Animated.View style={headerStyle}>
          <react_native_1.Animated.View style={{ flex: 1, transform: [{ translateY: contentTranslate }] }}>
            <calendar_list_1.default onLayout={function () {
                _this.calendar.scrollToDay(_this.state.selectedDay.clone(), _this.calendarOffset(), false);
            }} theme={this.props.theme} onVisibleMonthsChange={this.onVisibleMonthsChange.bind(this)} ref={function (c) { return _this.calendar = c; }} minDate={this.props.minDate} maxDate={this.props.maxDate} current={this.currentMonth} markedDates={this.generateMarkings()} markingType={this.props.markingType} removeClippedSubviews={this.props.removeClippedSubviews} onDayPress={this._chooseDayFromCalendar.bind(this)} scrollingEnabled={this.state.calendarScrollable} hideExtraDays={this.state.calendarScrollable} firstDay={this.props.firstDay} monthFormat={this.props.monthFormat} pastScrollRange={this.props.pastScrollRange} futureScrollRange={this.props.futureScrollRange} dayComponent={this.props.dayComponent} disabledByDefault={this.props.disabledByDefault}/>
          </react_native_1.Animated.View>
          {knob}
        </react_native_1.Animated.View>
        <react_native_1.Animated.View style={weekdaysStyle}>
          {weekDaysNames.map(function (day) { return (<react_native_1.Text allowFontScaling={false} key={day} style={_this.styles.weekday} numberOfLines={1}>{day}</react_native_1.Text>); })}
        </react_native_1.Animated.View>
        <react_native_1.Animated.ScrollView ref={function (c) { return _this.scrollPad = c; }} overScrollMode='never' showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={scrollPadStyle} scrollEventThrottle={1} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onScrollBeginDrag={this.onStartDrag} onScrollEndDrag={this.onSnapAfterDrag} onScroll={react_native_1.Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], { useNativeDriver: true })}>
          <react_native_1.View style={{ height: agendaHeight + KNOB_HEIGHT }} onLayout={this.onScrollPadLayout}/>
        </react_native_1.Animated.ScrollView>
      </react_native_1.View>);
    };
    AgendaView.propTypes = {
        // Specify theme properties to override specific styles for calendar parts. Default = {}
        theme: prop_types_1.default.object,
        // agenda container style
        style: viewPropTypes.style,
        // the list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items: prop_types_1.default.object,
        // callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth: prop_types_1.default.func,
        // callback that fires when the calendar is opened or closed
        onCalendarToggled: prop_types_1.default.func,
        // callback that gets called on day press
        onDayPress: prop_types_1.default.func,
        // callback that gets called when day changes while scrolling agenda list
        onDaychange: prop_types_1.default.func,
        // specify how each item should be rendered in agenda
        renderItem: prop_types_1.default.func,
        // specify how each date should be rendered. day can be undefined if the item is not first in that day.
        renderDay: prop_types_1.default.func,
        // specify how agenda knob should look like
        renderKnob: prop_types_1.default.func,
        // specify how empty date content with no items should be rendered
        renderEmptyDay: prop_types_1.default.func,
        // specify what should be rendered instead of ActivityIndicator
        renderEmptyData: prop_types_1.default.func,
        // specify your item comparison function for increased performance
        rowHasChanged: prop_types_1.default.func,
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange: prop_types_1.default.number,
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange: prop_types_1.default.number,
        // initially selected day
        selected: prop_types_1.default.any,
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate: prop_types_1.default.any,
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        maxDate: prop_types_1.default.any,
        // Collection of dates that have to be marked. Default = items
        markedDates: prop_types_1.default.object,
        // Optional marking type if custom markedDates are provided
        markingType: prop_types_1.default.string,
        // Hide knob button. Default = false
        hideKnob: prop_types_1.default.bool,
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat: prop_types_1.default.string
    };
    return AgendaView;
}(react_1.Component));
exports.default = AgendaView;
