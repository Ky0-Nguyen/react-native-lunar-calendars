import { ViewStyle, TextStyle } from 'react-native';
interface Theme {
    [key: string]: any;
}
export interface HeaderStyle {
    header: ViewStyle;
    monthText: TextStyle;
    arrow: ViewStyle;
    arrowImage: ViewStyle;
    week: ViewStyle;
    dayHeader: TextStyle;
    [key: string]: ViewStyle | TextStyle;
}
export default function styleConstructor(theme?: Theme): HeaderStyle;
export {};
