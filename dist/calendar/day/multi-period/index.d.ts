export default Day;
declare class Day extends React.Component<any, any, any> {
    static propTypes: {
        state: PropTypes.Requireable<string>;
        theme: PropTypes.Requireable<object>;
        marking: PropTypes.Requireable<any>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        date: PropTypes.Requireable<object>;
    };
    constructor(props: any);
    day: string;
    month: string;
    year: string;
    leap: string;
    jd: string;
    style: {
        [x: string]: import("react-native").RegisteredStyle<any>;
    };
    onDayPress(): void;
    getLunarDate(dd: any, mm: any, yyyy: any): any;
    getYearInfo(yyyy: any): any[];
    LunarDate(dd: any, mm: any, yy: any, leap: any, jd: any): void;
    INT(d: any): number;
    jdn(dd: any, mm: any, yy: any): number;
    findLunarDate(jd: any, ly: any): any;
    decodeLunarYear(yy: any, k: any): any[];
    renderPeriods(marking: any): any;
    render(): React.JSX.Element;
}
import React from "react";
import PropTypes from "prop-types";
