export default ReactComp;
declare class ReactComp extends React.Component<any, any, any> {
    static propTypes: {
        rowHasChanged: PropTypes.Requireable<(...args: any[]) => any>;
        renderItem: PropTypes.Requireable<(...args: any[]) => any>;
        renderDay: PropTypes.Requireable<(...args: any[]) => any>;
        renderEmptyDate: PropTypes.Requireable<(...args: any[]) => any>;
        onDayChange: PropTypes.Requireable<(...args: any[]) => any>;
        onScroll: PropTypes.Requireable<(...args: any[]) => any>;
        reservations: PropTypes.Requireable<object>;
        selectedDay: PropTypes.Requireable<XDate>;
        topDay: PropTypes.Requireable<XDate>;
    };
    constructor(props: any);
    styles: {
        [x: string]: import("react-native").RegisteredStyle<any>;
    };
    state: {
        reservations: never[];
    };
    heights: any[];
    selectedDay: any;
    scrollOver: boolean;
    componentDidMount(): void;
    updateDataSource(reservations: any): void;
    updateReservations(props: any): void;
    componentWillReceiveProps(props: any): void;
    onScroll(event: any): void;
    onRowLayoutChange(ind: any, event: any): void;
    renderRow({ item, index }: {
        item: any;
        index: any;
    }): React.JSX.Element;
    getReservationsForDay(iterator: any, props: any): any;
    onListTouch(): void;
    getReservations(props: any): {
        reservations: any[];
        scrollPosition: number;
    };
    render(): any;
    list: React.Component<import("react-native").FlatListProperties<any>, any, any> | null | undefined;
}
import React from "react";
import PropTypes from "prop-types";
import XDate from "xdate";
