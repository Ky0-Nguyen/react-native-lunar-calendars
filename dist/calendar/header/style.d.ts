import { ViewStyle, TextStyle, RegisteredStyle } from 'react-native';
interface Theme {
    [key: string]: any;
}
export interface HeaderStyle {
    header: RegisteredStyle<ViewStyle>;
    monthText: RegisteredStyle<TextStyle>;
    arrow: RegisteredStyle<ViewStyle>;
    arrowImage: RegisteredStyle<ViewStyle>;
    week: RegisteredStyle<ViewStyle>;
    dayHeader: RegisteredStyle<TextStyle>;
    [key: string]: RegisteredStyle<ViewStyle | TextStyle>;
}
export default function styleConstructor(theme?: Theme): HeaderStyle;
export {};
