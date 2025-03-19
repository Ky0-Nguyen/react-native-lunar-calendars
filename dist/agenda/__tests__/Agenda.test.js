"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var enzyme_1 = require("enzyme");
var index_1 = __importDefault(require("../index"));
var calendar_list_1 = __importDefault(require("../../calendar-list"));
var xdate_1 = __importDefault(require("xdate"));
describe('Agenda Component', function () {
    var wrapper;
    var onDayPress = jest.fn();
    var onDayChange = jest.fn();
    var loadItemsForMonth = jest.fn();
    var renderItem = jest.fn();
    var renderEmptyDate = jest.fn();
    var items = {
        '2024-03-19': [{ text: 'First Event' }],
        '2024-03-20': [{ text: 'Second Event' }],
        '2024-03-21': []
    };
    var defaultProps = {
        items: items,
        selected: '2024-03-19',
        onDayPress: onDayPress,
        onDayChange: onDayChange,
        loadItemsForMonth: loadItemsForMonth,
        renderItem: renderItem,
        renderEmptyDate: renderEmptyDate
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
    it('should render CalendarList', function () {
        expect(wrapper.find(calendar_list_1.default)).toHaveLength(1);
    });
    it('should render FlatList for items', function () {
        expect(wrapper.find('FlatList')).toHaveLength(1);
    });
    it('should initialize with correct selected date', function () {
        expect(wrapper.instance().state.selectedDay).toBeDefined();
        expect(new xdate_1.default(wrapper.instance().state.selectedDay).toString('yyyy-MM-dd')).toBe('2024-03-19');
    });
    it('should call loadItemsForMonth when month changes', function () {
        var date = new xdate_1.default(2024, 2, 1);
        wrapper.instance().loadItems(date);
        expect(loadItemsForMonth).toHaveBeenCalledWith(date);
    });
    it('should call onDayPress when a day is pressed', function () {
        var day = {
            year: 2024,
            month: 3,
            day: 19,
            timestamp: new Date(2024, 2, 19).getTime(),
            dateString: '2024-03-19'
        };
        wrapper.instance().chooseDay(day);
        expect(onDayPress).toHaveBeenCalledWith(day);
    });
    it('should call onDayChange when selected day changes', function () {
        var day = {
            year: 2024,
            month: 3,
            day: 20,
            timestamp: new Date(2024, 2, 20).getTime(),
            dateString: '2024-03-20'
        };
        wrapper.instance().chooseDay(day);
        expect(onDayChange).toHaveBeenCalledWith(day.dateString);
    });
    it('should handle theme changes', function () {
        var theme = {
            agendaDayTextColor: 'red',
            agendaDayNumColor: 'green',
            agendaTodayColor: 'blue',
            agendaKnobColor: 'yellow'
        };
        wrapper.setProps({ theme: theme });
        expect(wrapper.find(calendar_list_1.default).prop('theme')).toMatchObject(theme);
    });
    it('should handle calendar toggling', function () {
        var onCalendarToggled = jest.fn();
        wrapper.setProps({ onCalendarToggled: onCalendarToggled });
        wrapper.instance().toggleCalendar();
        expect(onCalendarToggled).toHaveBeenCalled();
    });
    it('should handle knob toggling', function () {
        wrapper.instance().toggleCalendarPosition();
        expect(wrapper.state('calendarScrollable')).toBe(true);
    });
    it('should handle item rendering', function () {
        var item = { text: 'Test Event' };
        wrapper.instance().renderItem({ item: item });
        expect(renderItem).toHaveBeenCalledWith(item);
    });
    it('should handle empty date rendering', function () {
        wrapper.instance().renderEmptyDate();
        expect(renderEmptyDate).toHaveBeenCalled();
    });
    it('should handle row comparison', function () {
        var r1 = { text: 'Event 1' };
        var r2 = { text: 'Event 2' };
        var rowHasChanged = wrapper.instance().rowHasChanged(r1, r2);
        expect(rowHasChanged).toBe(true);
    });
    it('should handle calendar scrolling', function () {
        wrapper.setProps({ calendarScrollable: true });
        expect(wrapper.state('calendarScrollable')).toBe(true);
    });
});
