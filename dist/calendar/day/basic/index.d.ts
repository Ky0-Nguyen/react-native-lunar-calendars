import React from 'react';
interface DayProps {
    state?: string;
    theme?: {
        [key: string]: any;
    };
    onPress?: (date: any) => void;
    onLongPress?: (date: any) => void;
    date?: any;
    marking?: any;
    children?: React.ReactNode;
}
declare const Day: React.FC<DayProps>;
export default Day;
