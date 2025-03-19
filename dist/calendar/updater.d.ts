interface CalendarProps {
    selected?: string[];
    markedDates?: any;
    hideExtraDays?: boolean;
    minDate?: string;
    maxDate?: string;
    current?: string;
    [key: string]: any;
}
interface CalendarState {
    currentMonth: string;
}
export default function shouldComponentUpdate(nextProps: CalendarProps, nextState: CalendarState, currentProps: CalendarProps, currentState: CalendarState): boolean;
export {};
