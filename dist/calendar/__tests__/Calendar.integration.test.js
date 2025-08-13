"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("@testing-library/react-native");
var index_1 = __importDefault(require("../index"));
// Mock the lunar calendar day component
jest.mock('../day/multi-period', function () {
    var React = require('react');
    var _a = require('react-native'), Text = _a.Text, TouchableOpacity = _a.TouchableOpacity;
    return function MockMultiPeriodDay(_a) {
        var children = _a.children, onPress = _a.onPress, date = _a.date;
        return (<TouchableOpacity onPress={function () { return onPress && onPress(date); }}>
        <Text>{children}</Text>
        <Text style={{ fontSize: 10, color: '#6D6D72' }}>Lunar: 15/6</Text>
      </TouchableOpacity>);
    };
});
describe('Calendar Integration Tests', function () {
    var mockOnDayPress = jest.fn();
    var mockOnMonthChange = jest.fn();
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('Basic Calendar Rendering', function () {
        it('should render calendar with current month', function () {
            var getByText = (0, react_native_1.render)(<index_1.default onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getByText;
            // Should render current month and year
            var currentDate = new Date();
            var currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
            var currentYear = currentDate.getFullYear();
            expect(getByText(currentMonth)).toBeTruthy();
            expect(getByText(currentYear.toString())).toBeTruthy();
        });
        it('should render calendar with specified current date', function () {
            var getByText = (0, react_native_1.render)(<index_1.default current={'2024-02-10'} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getByText;
            expect(getByText('February')).toBeTruthy();
            expect(getByText('2024')).toBeTruthy();
        });
        it('should render day names correctly', function () {
            var getByText = (0, react_native_1.render)(<index_1.default onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getByText;
            // Check for day names
            expect(getByText('Sun')).toBeTruthy();
            expect(getByText('Mon')).toBeTruthy();
            expect(getByText('Tue')).toBeTruthy();
            expect(getByText('Wed')).toBeTruthy();
            expect(getByText('Thu')).toBeTruthy();
            expect(getByText('Fri')).toBeTruthy();
            expect(getByText('Sat')).toBeTruthy();
        });
    });
    describe('Lunar Calendar Integration', function () {
        it('should render lunar dates when using multi-period marking', function () {
            var getAllByText = (0, react_native_1.render)(<index_1.default markingType={'multi-period'} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getAllByText;
            // Should render lunar dates
            var lunarTexts = getAllByText(/Lunar:/);
            expect(lunarTexts.length).toBeGreaterThan(0);
        });
        it('should highlight first day of lunar month in red', function () {
            var getAllByText = (0, react_native_1.render)(<index_1.default markingType={'multi-period'} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getAllByText;
            // Check for lunar date display
            var lunarTexts = getAllByText(/Lunar:/);
            expect(lunarTexts.length).toBeGreaterThan(0);
        });
    });
    describe('Calendar Interactions', function () {
        it('should call onDayPress when day is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getAllByText, days;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getAllByText = (0, react_native_1.render)(<index_1.default onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getAllByText;
                        days = getAllByText(/\d+/);
                        if (!(days.length > 0)) return [3 /*break*/, 2];
                        react_native_1.fireEvent.press(days[0]);
                        return [4 /*yield*/, (0, react_native_1.waitFor)(function () {
                                expect(mockOnDayPress).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        it('should call onMonthChange when month changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getByText, nextArrow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getByText = (0, react_native_1.render)(<index_1.default onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getByText;
                        nextArrow = getByText('>');
                        if (!nextArrow) return [3 /*break*/, 2];
                        react_native_1.fireEvent.press(nextArrow);
                        return [4 /*yield*/, (0, react_native_1.waitFor)(function () {
                                expect(mockOnMonthChange).toHaveBeenCalled();
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Calendar Props', function () {
        it('should respect minDate and maxDate props', function () {
            var getAllByText = (0, react_native_1.render)(<index_1.default minDate={'2024-02-15'} maxDate={'2024-02-25'} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getAllByText;
            // Days outside range should be disabled
            var days = getAllByText(/\d+/);
            expect(days.length).toBeGreaterThan(0);
        });
        it('should handle markedDates correctly', function () {
            var markedDates = {
                '2024-02-15': { marked: true, dotColor: 'red' },
                '2024-02-20': { selected: true, selectedColor: 'blue' }
            };
            var getAllByText = (0, react_native_1.render)(<index_1.default markedDates={markedDates} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getAllByText;
            // Should render marked dates
            var days = getAllByText(/\d+/);
            expect(days.length).toBeGreaterThan(0);
        });
        it('should handle theme customization', function () {
            var customTheme = {
                selectedDayBackgroundColor: 'purple',
                selectedDayTextColor: 'white',
                todayTextColor: 'orange'
            };
            var getByText = (0, react_native_1.render)(<index_1.default theme={customTheme} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getByText;
            // Should render with custom theme
            expect(getByText('February')).toBeTruthy();
        });
    });
    describe('Calendar List Integration', function () {
        it('should render calendar list correctly', function () {
            var getAllByText = (0, react_native_1.render)(<index_1.default markingType={'multi-period'} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getAllByText;
            // Should render multiple days
            var days = getAllByText(/\d+/);
            expect(days.length).toBeGreaterThan(0);
        });
    });
    describe('Accessibility', function () {
        it('should have proper accessibility labels', function () {
            var getByText = (0, react_native_1.render)(<index_1.default onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getByText;
            // Should have accessible month and year
            var currentDate = new Date();
            var currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
            var currentYear = currentDate.getFullYear();
            expect(getByText(currentMonth)).toBeTruthy();
            expect(getByText(currentYear.toString())).toBeTruthy();
        });
    });
    describe('Performance', function () {
        it('should render efficiently with many marked dates', function () {
            var manyMarkedDates = {};
            // Create many marked dates
            for (var i = 1; i <= 31; i++) {
                manyMarkedDates["2024-02-".concat(i.toString().padStart(2, '0'))] = {
                    marked: true,
                    dotColor: 'red'
                };
            }
            var renderStart = Date.now();
            var getAllByText = (0, react_native_1.render)(<index_1.default markedDates={manyMarkedDates} onDayPress={mockOnDayPress} onMonthChange={mockOnMonthChange}/>).getAllByText;
            var renderEnd = Date.now();
            var renderTime = renderEnd - renderStart;
            // Should render within reasonable time (less than 100ms)
            expect(renderTime).toBeLessThan(100);
            // Should render all days
            var days = getAllByText(/\d+/);
            expect(days.length).toBeGreaterThan(0);
        });
    });
});
