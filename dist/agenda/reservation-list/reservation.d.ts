export default ReservationListItem;
declare class ReservationListItem extends React.Component<any, any, any> {
    constructor(props: any);
    styles: {
        [x: string]: import("react-native").RegisteredStyle<any>;
    };
    shouldComponentUpdate(nextProps: any): boolean;
    renderDate(date: any, item: any): any;
    render(): React.JSX.Element;
}
import React from "react";
