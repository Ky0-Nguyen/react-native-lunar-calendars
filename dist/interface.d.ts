import XDate from 'xdate';
interface DateData {
    year: number;
    month: number;
    day: number;
    timestamp: number;
    dateString: string;
}
export declare function xdateToData(xdate: XDate): DateData;
export declare function parseDate(d?: number | string | Date | XDate | DateData): XDate | undefined;
export {};
