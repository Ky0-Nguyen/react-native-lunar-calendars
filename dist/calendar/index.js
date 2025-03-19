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
var dateutils = __importStar(require("../dateutils"));
var interface_1 = require("../interface");
var style_1 = __importDefault(require("./style"));
var basic_1 = __importDefault(require("./day/basic"));
var period_1 = __importDefault(require("./day/period"));
var multi_dot_1 = __importDefault(require("./day/multi-dot"));
var multi_period_1 = __importDefault(require("./day/multi-period"));
var custom_1 = __importDefault(require("./day/custom"));
var header_1 = __importDefault(require("./header"));
var updater_1 = __importDefault(require("./updater"));
var EmptyArray = [];
var Calendar = /** @class */ (function (_super) {
    __extends(Calendar, _super);
    function Calendar(props) {
        var _this = _super.call(this, props) || this;
        _this.style = (0, style_1.default)(_this.props.theme);
        var currentMonth;
        if (props.current) {
            var parsed = (0, interface_1.parseDate)(props.current);
            if (parsed) {
                currentMonth = parsed;
            }
            else {
                currentMonth = new xdate_1.default();
            }
        }
        else {
            currentMonth = new xdate_1.default();
        }
        _this.state = {
            currentMonth: currentMonth.toString('yyyy MM')
        };
        _this.updateMonth = _this.updateMonth.bind(_this);
        _this.addMonth = _this.addMonth.bind(_this);
        _this.pressDay = _this.pressDay.bind(_this);
        _this.longPressDay = _this.longPressDay.bind(_this);
        _this.shouldComponentUpdate = function (nextProps, nextState) {
            return (0, updater_1.default)(nextProps, nextState, _this.props, _this.state);
        };
        return _this;
    }
    Calendar.prototype.componentWillReceiveProps = function (nextProps) {
        var current = (0, interface_1.parseDate)(nextProps.current);
        if (current && current.toString('yyyy MM') !== this.state.currentMonth) {
            this.setState({
                currentMonth: current.toString('yyyy MM')
            });
        }
    };
    Calendar.prototype.getDayComponent = function () {
        if (this.props.dayComponent) {
            return this.props.dayComponent;
        }
        switch (this.props.markingType) {
            case 'period':
                return period_1.default;
            case 'multi-dot':
                return multi_dot_1.default;
            case 'multi-period':
                return multi_period_1.default;
            case 'custom':
                return custom_1.default;
            default:
                return basic_1.default;
        }
    };
    Calendar.prototype.getDateMarking = function (day) {
        if (!this.props.markedDates) {
            return false;
        }
        var dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
        if (dates.length || dates) {
            return dates;
        }
        else {
            return false;
        }
    };
    Calendar.prototype.updateMonth = function (day, doNotTriggerListeners) {
        var _this = this;
        if (day.toString('yyyy MM') === this.state.currentMonth) {
            return;
        }
        this.setState({
            currentMonth: day.toString('yyyy MM')
        }, function () {
            if (!doNotTriggerListeners) {
                var currMont = new xdate_1.default(_this.state.currentMonth);
                if (_this.props.onMonthChange) {
                    _this.props.onMonthChange((0, interface_1.xdateToData)(currMont));
                }
                if (_this.props.onVisibleMonthsChange) {
                    _this.props.onVisibleMonthsChange([(0, interface_1.xdateToData)(currMont)]);
                }
            }
        });
    };
    Calendar.prototype._handleDayInteraction = function (date, interaction) {
        var day = (0, interface_1.parseDate)(date);
        if (!day)
            return;
        var minDate = (0, interface_1.parseDate)(this.props.minDate);
        var maxDate = (0, interface_1.parseDate)(this.props.maxDate);
        if (!(minDate && !dateutils.isGTE(day, minDate)) && !(maxDate && !dateutils.isLTE(day, maxDate))) {
            var shouldUpdateMonth = this.props.disableMonthChange === undefined || !this.props.disableMonthChange;
            if (shouldUpdateMonth) {
                this.updateMonth(day);
            }
            if (interaction) {
                interaction((0, interface_1.xdateToData)(day));
            }
        }
    };
    Calendar.prototype.pressDay = function (date) {
        this._handleDayInteraction(date, this.props.onDayPress);
    };
    Calendar.prototype.longPressDay = function (date) {
        this._handleDayInteraction(date, this.props.onDayLongPress);
    };
    Calendar.prototype.addMonth = function (count) {
        var currMonth = new xdate_1.default(this.state.currentMonth);
        this.updateMonth(currMonth.addMonths(count, true));
    };
    Calendar.prototype.renderDay = function (day, id) {
        var minDate = (0, interface_1.parseDate)(this.props.minDate);
        var maxDate = (0, interface_1.parseDate)(this.props.maxDate);
        var state = '';
        if (this.props.disabledByDefault) {
            state = 'disabled';
        }
        else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
            state = 'disabled';
        }
        else if (!dateutils.sameMonth(day, new xdate_1.default(this.state.currentMonth))) {
            state = 'disabled';
        }
        else if (dateutils.sameDate(day, new xdate_1.default())) {
            state = 'today';
        }
        state = 'disabled';
        var dayComp;
        if (!dateutils.sameMonth(day, new xdate_1.default(this.state.currentMonth)) && this.props.hideExtraDays) {
            if (this.props.markingType && ['period', 'multi-period'].indexOf(this.props.markingType) !== -1) {
                dayComp = <react_native_1.View key={id} style={{ flex: 1 }}/>;
            }
            else {
                dayComp = <react_native_1.View key={id} style={this.style.dayContainer}/>;
            }
        }
        else {
            var DayComp = this.getDayComponent();
            var date = day.getDate();
            dayComp = (<DayComp key={id} state={state} theme={this.props.theme} onPress={this.pressDay} onLongPress={this.longPressDay} date={(0, interface_1.xdateToData)(day)} marking={this.getDateMarking(day)}>
          {date}
        </DayComp>);
        }
        return dayComp;
    };
    Calendar.prototype.renderWeekNumber = function (weekNumber) {
        return <basic_1.default key={"week-".concat(weekNumber)} theme={this.props.theme} marking={{ disableTouchEvent: true }} state="disabled">{weekNumber}</basic_1.default>;
    };
    Calendar.prototype.renderWeek = function (days, id, count) {
        var _this = this;
        var week = [];
        days.forEach(function (day, id2) {
            week.push(_this.renderDay(day, id2));
        }, this);
        if (this.props.showWeekNumbers) {
            week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
        }
        return (<react_native_1.View key={id}>
        <react_native_1.View style={this.style.week}>{week}</react_native_1.View>
        {count !== 0 && <react_native_1.View style={this.style.divider}/>}
      </react_native_1.View>);
    };
    Calendar.prototype.render = function () {
        var _this = this;
        var days = dateutils.page(new xdate_1.default(this.state.currentMonth), this.props.firstDay || 1);
        var weeks = [];
        var week = [];
        days.forEach(function (day, id) {
            week.push(day);
            if (week.length === 7) {
                weeks.push(_this.renderWeek(week, id, weeks.length));
                week = [];
            }
        });
        if (week.length > 0) {
            weeks.push(this.renderWeek(week, days.length, weeks.length));
        }
        return (<react_native_1.View style={[this.style.container, this.props.style]}>
        <header_1.default theme={this.props.theme} hideArrows={this.props.hideArrows} month={new xdate_1.default(this.state.currentMonth)} addMonth={this.addMonth} showIndicator={this.props.displayLoadingIndicator} firstDay={this.props.firstDay} renderArrow={this.props.renderArrow} hideDayNames={this.props.hideDayNames} weekNumbers={this.props.showWeekNumbers} onPressArrowLeft={this.props.onPressArrowLeft} onPressArrowRight={this.props.onPressArrowRight}/>
        <react_native_1.View style={this.style.monthView}>
          {weeks}
        </react_native_1.View>
      </react_native_1.View>);
    };
    return Calendar;
}(react_1.Component));
exports.default = Calendar;
