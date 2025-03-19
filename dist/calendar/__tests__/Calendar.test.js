"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var index_1 = __importDefault(require("../index"));
var xdate_1 = __importDefault(require("xdate"));
describe('Calendar Component', function () {
    var wrapper;
    var onDayPress = jest.fn();
    var onDayLongPress = jest.fn();
    var onMonthChange = jest.fn();
    beforeEach(function () {
        wrapper = (0, enzyme_1.shallow)(<index_1.default current={'2024-03-19'} onDayPress={onDayPress} onDayLongPress={onDayLongPress} onMonthChange={onMonthChange}/>);
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    it('should render correctly', function () {
        expect(wrapper).toBeDefined();
    });
    it('should initialize with correct current date', function () {
        var instance = wrapper.instance();
        expect(instance.state.currentMonth).toBeDefined();
        expect(new xdate_1.default(instance.state.currentMonth).toString('yyyy-MM-dd')).toBe('2024-03-01');
    });
    it('should call onDayPress when a day is pressed', function () {
        var day = {
            year: 2024,
            month: 3,
            day: 19,
            timestamp: new Date(2024, 2, 19).getTime(),
            dateString: '2024-03-19'
        };
        var instance = wrapper.instance();
        instance.pressDay(day);
        expect(onDayPress).toHaveBeenCalledWith(day);
    });
    it('should call onDayLongPress when a day is long pressed', function () {
        var day = {
            year: 2024,
            month: 3,
            day: 19,
            timestamp: new Date(2024, 2, 19).getTime(),
            dateString: '2024-03-19'
        };
        var instance = wrapper.instance();
        instance.longPressDay(day);
        expect(onDayLongPress).toHaveBeenCalledWith(day);
    });
    it('should call onMonthChange when month changes', function () {
        var newMonth = new xdate_1.default(2024, 3, 1);
        var instance = wrapper.instance();
        instance.updateMonth(newMonth);
        expect(onMonthChange).toHaveBeenCalledWith({
            year: 2024,
            month: 4,
            timestamp: newMonth.getTime(),
            dateString: newMonth.toString('yyyy-MM-dd')
        });
    });
    it('should update currentMonth when receiving new current prop', function () {
        wrapper.setProps({ current: '2024-04-01' });
        var instance = wrapper.instance();
        expect(new xdate_1.default(instance.state.currentMonth).toString('yyyy-MM-dd')).toBe('2024-04-01');
    });
    it('should render days correctly', function () {
        var days = wrapper.find('Day');
        expect(days.length).toBeGreaterThan(0);
    });
    it('should handle marking dates correctly', function () {
        var markedDates = {
            '2024-03-19': { selected: true, marked: true },
            '2024-03-20': { marked: true },
            '2024-03-21': { disabled: true }
        };
        wrapper.setProps({ markedDates: markedDates });
        var days = wrapper.find('Day');
        expect(days.findWhere(function (day) { var _a; return (_a = day.prop('marking')) === null || _a === void 0 ? void 0 : _a.selected; }).length).toBe(1);
    });
    it('should handle theme changes correctly', function () {
        var theme = {
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            monthTextColor: 'blue'
        };
        wrapper.setProps({ theme: theme });
        expect(wrapper.prop('theme')).toEqual(theme);
    });
});
