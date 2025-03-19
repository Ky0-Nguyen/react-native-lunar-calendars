import { ViewStyle, TextStyle, RegisteredStyle } from 'react-native';
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
    base: RegisteredStyle<ViewStyle>;
    text: RegisteredStyle<TextStyle>;
    alignedText: RegisteredStyle<TextStyle>;
    selected: RegisteredStyle<ViewStyle>;
    disabled: RegisteredStyle<TextStyle>;
    today: RegisteredStyle<ViewStyle>;
    todayText: RegisteredStyle<TextStyle>;
    disabledText: RegisteredStyle<TextStyle>;
    dot: RegisteredStyle<ViewStyle>;
    visibleDot: RegisteredStyle<ViewStyle>;
    selectedDot: RegisteredStyle<ViewStyle>;
    selectedText: RegisteredStyle<TextStyle>;
    [key: string]: RegisteredStyle<ViewStyle | TextStyle>;
}
declare const styleConstructor: (theme?: Theme) => Styles;
export default styleConstructor;
