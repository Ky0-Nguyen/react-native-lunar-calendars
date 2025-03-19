import React, { Component } from 'react';
import { ViewStyle } from 'react-native';
import XDate from 'xdate';
interface CalendarHeaderProps {
    theme?: {
        [key: string]: any;
    };
    hideArrows?: boolean;
    month: XDate;
    addMonth: (num: number) => void;
    showIndicator?: boolean;
    firstDay?: number;
    renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
    hideDayNames?: boolean;
    weekNumbers?: boolean;
    onPressArrowLeft?: (callback: () => void) => void;
    onPressArrowRight?: (callback: () => void) => void;
    headerColor?: ViewStyle;
}
interface CalendarHeaderState {
}
declare class CalendarHeader extends Component<CalendarHeaderProps, CalendarHeaderState> {
    private style;
    private currentDate;
    constructor(props: CalendarHeaderProps);
    shouldComponentUpdate(nextProps: CalendarHeaderProps): boolean;
    onPressLeft(): void;
    onPressRight(): void;
    substractMonth(): void;
    canViewPreviouMonth(): boolean;
    addMonth(): void;
    render(): JSX.Element;
}
export default CalendarHeader;
