import { ViewStyle, TextStyle } from 'react-native';
interface Theme {
    textColor?: string;
    textSectionTitleColor?: string;
    selectedDayBackgroundColor?: string;
    selectedDayTextColor?: string;
    todayTextColor?: string;
    dayTextColor?: string;
    textDisabledColor?: string;
    dotColor?: string;
    monthTextColor?: string;
    arrowColor?: string;
    indicatorColor?: string;
    [key: string]: any;
}
interface Styles {
    base: ViewStyle;
    text: TextStyle;
    alignedText: TextStyle;
    selected: ViewStyle;
    disabled: TextStyle;
    today: ViewStyle;
    todayText: TextStyle;
    disabledText: TextStyle;
    dot: ViewStyle;
    visibleDot: ViewStyle;
    selectedDot: ViewStyle;
    selectedText: TextStyle;
    [key: string]: ViewStyle | TextStyle;
}
declare const styleConstructor: (theme?: Theme) => Styles;
export default styleConstructor;
