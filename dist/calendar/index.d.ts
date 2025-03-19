import React, { Component } from 'react';
import { ViewStyle } from 'react-native';
import XDate from 'xdate';
interface CalendarProps {
    theme?: {
        [key: string]: any;
    };
    markedDates?: {
        [key: string]: any;
    };
    style?: ViewStyle;
    current?: any;
    minDate?: any;
    maxDate?: any;
    firstDay?: number;
    markingType?: 'simple' | 'period' | 'multi-dot' | 'multi-period' | 'custom';
    hideArrows?: boolean;
    displayLoadingIndicator?: boolean;
    hideExtraDays?: boolean;
    onDayPress?: (date: any) => void;
    onDayLongPress?: (date: any) => void;
    onMonthChange?: (date: any) => void;
    onVisibleMonthsChange?: (dates: any[]) => void;
    renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
    dayComponent?: any;
    monthFormat?: string;
    disableMonthChange?: boolean;
    hideDayNames?: boolean;
    disabledByDefault?: boolean;
    showWeekNumbers?: boolean;
    onPressArrowLeft?: (callback: () => void) => void;
    onPressArrowRight?: (callback: () => void) => void;
}
interface CalendarState {
    currentMonth: string;
}
declare class Calendar extends Component<CalendarProps, CalendarState> {
    private style;
    constructor(props: CalendarProps);
    componentWillReceiveProps(nextProps: CalendarProps): void;
    getDayComponent(): any;
    getDateMarking(day: XDate): any;
    updateMonth(day: XDate, doNotTriggerListeners?: boolean): void;
    _handleDayInteraction(date: any, interaction?: (date: any) => void): void;
    pressDay(date: any): void;
    longPressDay(date: any): void;
    addMonth(count: number): void;
    renderDay(day: XDate, id: number): JSX.Element;
    renderWeekNumber(weekNumber: number): JSX.Element;
    renderWeek(days: XDate[], id: number, count: number): JSX.Element;
    render(): JSX.Element;
}
export default Calendar;
