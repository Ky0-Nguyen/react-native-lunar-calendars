"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var enzyme_1 = require("enzyme");
var basic_1 = __importDefault(require("../basic"));
var xdate_1 = __importDefault(require("xdate"));
var testDate = new xdate_1.default('2019-01-01');
describe('Day component', function () {
    it('should render without issues', function () {
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={testDate}/>);
        expect(wrapper.length).toBe(1);
    });
    it('should render with custom styles', function () {
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={testDate} theme={{
                textDayFontFamily: 'Arial',
                textDayFontSize: 14
            }}/>);
        expect(wrapper.length).toBe(1);
    });
    it('should handle onPress', function () {
        var onPress = jest.fn();
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={testDate} onPress={onPress}/>);
        wrapper.simulate('press');
        expect(onPress).toHaveBeenCalled();
    });
    it('should handle onLongPress', function () {
        var onLongPress = jest.fn();
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={testDate} onLongPress={onLongPress}/>);
        wrapper.simulate('longPress');
        expect(onLongPress).toHaveBeenCalled();
    });
    it('should render marked dates', function () {
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={testDate} marking={{ marked: true }}/>);
        expect(wrapper.find(react_native_1.View).length).toBeGreaterThan(1);
    });
    it('should render disabled dates', function () {
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={testDate} marking={{ disabled: true }}/>);
        expect(wrapper.prop('style')).toEqual(expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })]));
    });
    it('should render selected dates', function () {
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={testDate} marking={{ selected: true }}/>);
        expect(wrapper.prop('style')).toEqual(expect.arrayContaining([expect.objectContaining({ backgroundColor: '#00adf5' })]));
    });
    it('should render today', function () {
        var today = new xdate_1.default();
        var wrapper = (0, enzyme_1.shallow)(<basic_1.default date={today}/>);
        expect(wrapper.prop('style')).toEqual(expect.arrayContaining([expect.objectContaining({ backgroundColor: undefined })]));
    });
});
