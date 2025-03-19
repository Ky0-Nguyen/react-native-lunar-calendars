"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agendaKnobColor = exports.agendaTodayColor = exports.agendaDayNumColor = exports.agendaDayTextColor = exports.monthTextColor = exports.arrowColor = exports.selectedDotColor = exports.dotColor = exports.textDisabledColor = exports.dayTextColor = exports.todayTextColor = exports.selectedDayTextColor = exports.selectedDayBackgroundColor = exports.textSectionTitleColor = exports.calendarBackground = exports.textDayHeaderFontSize = exports.textMonthFontSize = exports.textDayFontSize = exports.textMonthFontWeight = exports.textDayHeaderFontFamily = exports.textMonthFontFamily = exports.textDayFontFamily = exports.textSecondaryColor = exports.textLinkColor = exports.textColor = exports.textDefaultColor = exports.failedColor = exports.processingColor = exports.processedColor = exports.separatorColor = exports.backgroundColor = exports.foregroundColor = void 0;
var react_native_1 = require("react-native");
exports.foregroundColor = '#ffffff';
exports.backgroundColor = '#f4f4f4';
exports.separatorColor = '#e8e9ec';
exports.processedColor = '#a7e0a3';
exports.processingColor = '#ffce5c';
exports.failedColor = 'rgba(246, 126, 126,1)';
// export const textDefaultColor = '#2d4150';
exports.textDefaultColor = 'white';
exports.textColor = '#43515c';
// export const textLinkColor = '#00adf5';
exports.textLinkColor = 'white';
exports.textSecondaryColor = '#7a92a5';
exports.textDayFontFamily = 'System';
exports.textMonthFontFamily = 'System';
exports.textDayHeaderFontFamily = 'System';
exports.textMonthFontWeight = '300';
exports.textDayFontSize = 17;
exports.textMonthFontSize = 17;
exports.textDayHeaderFontSize = 13;
exports.calendarBackground = exports.foregroundColor;
// export const textSectionTitleColor = '#b6c1cd';
exports.textSectionTitleColor = 'white';
exports.selectedDayBackgroundColor = exports.textLinkColor;
exports.selectedDayTextColor = exports.foregroundColor;
exports.todayTextColor = exports.textLinkColor;
exports.dayTextColor = exports.textDefaultColor;
exports.textDisabledColor = '#d9e1e8';
exports.dotColor = exports.textLinkColor;
exports.selectedDotColor = exports.foregroundColor;
exports.arrowColor = exports.textLinkColor;
exports.monthTextColor = exports.textDefaultColor;
exports.agendaDayTextColor = '#7a92a5';
exports.agendaDayNumColor = '#7a92a5';
exports.agendaTodayColor = exports.textLinkColor;
exports.agendaKnobColor = react_native_1.Platform.OS === 'ios' ? '#f2F4f5' : '#4ac4f7';
