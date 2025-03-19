"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var index_1 = __importDefault(require("../index"));
describe('CalendarList Component', function () {
    var wrapper;
    var onDayPress = jest.fn();
    var onVisibleMonthsChange = jest.fn();
    var defaultProps = {
        current: '2024-03-19',
        pastScrollRange: 24,
        futureScrollRange: 24,
        onDayPress: onDayPress,
        onVisibleMonthsChange: onVisibleMonthsChange
    };
    beforeEach(function () {
        wrapper = (0, enzyme_1.shallow)(<index_1.default {...defaultProps}/>);
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    it('should render correctly', function () {
        expect(wrapper).toBeDefined();
    });
    it('should render FlatList', function () {
        expect(wrapper.find('FlatList')).toHaveLength(1);
    });
    it('should calculate correct number of months', function () {
        // Past range + future range + current month
        var totalMonths = defaultProps.pastScrollRange + defaultProps.futureScrollRange + 1;
        expect(wrapper.instance().state.rows).toHaveLength(totalMonths);
    });
    it('should handle horizontal scrolling', function () {
        wrapper.setProps({ horizontal: true });
        expect(wrapper.find('FlatList').prop('horizontal')).toBe(true);
    });
    it('should handle paging enabled', function () {
        wrapper.setProps({ pagingEnabled: true });
        expect(wrapper.find('FlatList').prop('pagingEnabled')).toBe(true);
    });
    it('should handle scroll enabled', function () {
        wrapper.setProps({ scrollEnabled: false });
        expect(wrapper.find('FlatList').prop('scrollEnabled')).toBe(false);
    });
    it('should handle show scroll indicator', function () {
        wrapper.setProps({ showScrollIndicator: true });
        expect(wrapper.find('FlatList').prop('showsVerticalScrollIndicator')).toBe(true);
    });
    it('should handle theme changes', function () {
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
        var calendar = wrapper.find('Calendar').first();
        expect(calendar.prop('theme')).toEqual(theme);
    });
    it('should handle marked dates', function () {
        var markedDates = {
            '2024-03-19': { selected: true, marked: true },
            '2024-03-20': { marked: true }
        };
        wrapper.setProps({ markedDates: markedDates });
        var calendar = wrapper.find('Calendar').first();
        expect(calendar.prop('markedDates')).toEqual(markedDates);
    });
    it('should call onVisibleMonthsChange when months change', function () {
        var months = [
            { dateString: '2024-03-01' },
            { dateString: '2024-04-01' }
        ];
        wrapper.instance().onViewableItemsChanged({
            viewableItems: months.map(function (month) { return ({ item: month }); })
        });
        expect(onVisibleMonthsChange).toHaveBeenCalledWith(months);
    });
    it('should handle calendar width in horizontal mode', function () {
        var calendarWidth = 350;
        wrapper.setProps({ horizontal: true, calendarWidth: calendarWidth });
        var calendar = wrapper.find('Calendar').first();
        expect(calendar.prop('style').width).toBe(calendarWidth);
    });
});
