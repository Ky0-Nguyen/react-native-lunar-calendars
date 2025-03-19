import { ViewStyle, RegisteredStyle } from 'react-native';
interface Theme {
    [key: string]: any;
}
export interface CalendarStyle {
    container: RegisteredStyle<ViewStyle>;
    monthView: RegisteredStyle<ViewStyle>;
    week: RegisteredStyle<ViewStyle>;
    divider: RegisteredStyle<ViewStyle>;
    dayContainer: RegisteredStyle<ViewStyle>;
    [key: string]: RegisteredStyle<ViewStyle>;
}
export default function getStyle(theme?: Theme): CalendarStyle;
export {};
