export default CalendarList;
declare class CalendarList extends React.Component<any, any, any> {
    static propTypes: any;
    constructor(props: any);
    pastScrollRange: any;
    futureScrollRange: any;
    style: {
        [x: string]: import("react-native").RegisteredStyle<any>;
    };
    calendarWidth: any;
    calendarHeight: any;
    state: {
        rows: any[];
        texts: any[];
        openDate: any;
    };
    onViewableItemsChangedBound: ({ viewableItems }: {
        viewableItems: any;
    }) => void;
    renderCalendarBound: ({ item }: {
        item: any;
    }) => React.JSX.Element;
    getItemLayout(data: any, index: any): {
        length: any;
        offset: number;
        index: any;
    };
    onLayout(event: any): void;
    scrollToDay(d: any, offset: any, animated: any): void;
    scrollToMonth(m: any): void;
    componentWillReceiveProps(props: any): void;
    onViewableItemsChanged({ viewableItems }: {
        viewableItems: any;
    }): void;
    renderCalendar({ item }: {
        item: any;
    }): React.JSX.Element;
    getMonthIndex(month: any): any;
    render(): React.JSX.Element;
    listView: React.Component<import("react-native").FlatListProperties<any>, any, any> | null | undefined;
}
declare namespace CalendarList {
    namespace defaultProps {
        const calendarHeight: number;
    }
}
import React from "react";
