export default Day;
declare class Day extends React.Component<any, any, any> {
    static propTypes: {
        state: PropTypes.Requireable<string>;
        theme: PropTypes.Requireable<object>;
        marking: PropTypes.Requireable<any>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        date: PropTypes.Requireable<object>;
        markingExists: PropTypes.Requireable<boolean>;
    };
    constructor(props: any);
    theme: any;
    style: {
        [x: string]: import("react-native").RegisteredStyle<any>;
    };
    markingStyle: any;
    onDayPress(): void;
    onDayLongPress(): void;
    shouldComponentUpdate(nextProps: any): boolean;
    getDrawingStyle(marking: any): any;
    render(): React.JSX.Element;
}
import React from "react";
import PropTypes from "prop-types";
