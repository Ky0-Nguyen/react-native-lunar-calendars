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
    style: {
        [x: string]: import("react-native").RegisteredStyle<any>;
    };
    onDayPress(): void;
    onDayLongPress(): void;
    shouldComponentUpdate(nextProps: any): boolean;
    render(): React.JSX.Element;
}
import React from "react";
import PropTypes from "prop-types";
