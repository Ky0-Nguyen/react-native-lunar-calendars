import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import XDate from 'xdate';
import * as dateutils from '../../dateutils';
import Reservation, {type ReservationRow} from './reservation';
import styleConstructor from './style';
import type {CalendarTheme, DateData} from '../../theme';

/** Items to show, keyed by `YYYY-MM-DD`. An empty array means "loaded, but nothing on this day". */
export type AgendaItems<T = unknown> = Record<string, T[]>;

export interface ReservationListProps<T = unknown> {
  reservations?: AgendaItems<T>;
  selectedDay: XDate;
  topDay: XDate;
  theme?: CalendarTheme;
  style?: StyleProp<ViewStyle>;
  rowHasChanged?: (a: T, b: T) => boolean;
  renderItem?: (reservation: T, isFirstOfDay: boolean) => React.ReactNode;
  renderDay?: (date: DateData | undefined, reservation?: T) => React.ReactNode;
  renderEmptyDate?: (date?: XDate | false) => React.ReactNode;
  renderEmptyData?: () => React.ReactElement;
  onDayChange?: (day: XDate) => void;
  onScroll?: (offset: number) => void;
}

interface ReservationListState<T> {
  reservations: ReservationRow<T>[];
}

/** How many days ahead of the selected day are materialised into rows. */
const LOOKAHEAD_DAYS = 31;

class ReservationList<T = unknown> extends Component<ReservationListProps<T>, ReservationListState<T>> {
  private styles: ReturnType<typeof styleConstructor>;
  private heights: number[] = [];
  private selectedDay: XDate;
  private scrollOver = true;
  private list = React.createRef<FlatList<ReservationRow<T>>>();

  constructor(props: ReservationListProps<T>) {
    super(props);
    this.styles = styleConstructor(props.theme);
    this.selectedDay = props.selectedDay;
    this.state = {reservations: []};
  }

  override componentDidMount(): void {
    this.setState({reservations: this.getReservations(this.props).reservations});
  }

  override componentDidUpdate(prevProps: ReservationListProps<T>): void {
    if (!dateutils.sameDate(prevProps.topDay, this.props.topDay)) {
      this.setState({reservations: []}, () => this.updateReservations(this.props));
      return;
    }
    if (
      prevProps.reservations !== this.props.reservations ||
      !dateutils.sameDate(prevProps.selectedDay, this.props.selectedDay)
    ) {
      this.updateReservations(this.props);
    }
  }

  private updateReservations(props: ReservationListProps<T>): void {
    const result = this.getReservations(props);
    if (this.list.current && !dateutils.sameDate(props.selectedDay, this.selectedDay)) {
      let scrollPosition = 0;
      for (let i = 0; i < result.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list.current.scrollToOffset({offset: scrollPosition, animated: true});
    }
    this.selectedDay = props.selectedDay;
    this.setState({reservations: result.reservations});
  }

  private getReservationsForDay(day: XDate, props: ReservationListProps<T>): ReservationRow<T>[] | false {
    const items = props.reservations?.[day.toString('yyyy-MM-dd')];
    if (items === undefined) {
      return false;
    }
    if (items.length) {
      return items.map((reservation, index) => ({
        reservation,
        date: index ? false : day.clone(),
        day: day.clone()
      }));
    }
    return [{date: day.clone(), day: day.clone()}];
  }

  private getReservations(props: ReservationListProps<T>): {
    reservations: ReservationRow<T>[];
    scrollPosition: number;
  } {
    if (!props.reservations || !props.selectedDay) {
      return {reservations: [], scrollPosition: 0};
    }

    let reservations: ReservationRow<T>[] = [];
    const existing = this.state.reservations;

    if (existing.length) {
      const iterator = existing[0].day.clone();
      while (iterator.getTime() < props.selectedDay.getTime()) {
        const rows = this.getReservationsForDay(iterator, props);
        if (!rows) {
          reservations = [];
          break;
        }
        reservations = reservations.concat(rows);
        iterator.addDays(1);
      }
    }

    const scrollPosition = reservations.length;
    const iterator = props.selectedDay.clone();
    for (let i = 0; i < LOOKAHEAD_DAYS; i++) {
      const rows = this.getReservationsForDay(iterator, props);
      if (rows) {
        reservations = reservations.concat(rows);
      }
      iterator.addDays(1);
    }

    return {reservations, scrollPosition};
  }

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const yOffset = event.nativeEvent.contentOffset.y;
    this.props.onScroll?.(yOffset);

    let topRowOffset = 0;
    let topRow = 0;
    for (; topRow < this.heights.length; topRow++) {
      if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
        break;
      }
      topRowOffset += this.heights[topRow];
    }

    const row = this.state.reservations[topRow];
    if (!row) {
      return;
    }
    if (!dateutils.sameDate(row.day, this.selectedDay) && this.scrollOver) {
      this.selectedDay = row.day.clone();
      this.props.onDayChange?.(row.day.clone());
    }
  };

  private onRowLayoutChange(index: number, event: LayoutChangeEvent): void {
    this.heights[index] = event.nativeEvent.layout.height;
  }

  private renderRow = ({item, index}: {item: ReservationRow<T>; index: number}): React.ReactElement => (
    <View onLayout={event => this.onRowLayoutChange(index, event)}>
      <Reservation
        item={item}
        theme={this.props.theme}
        rowHasChanged={this.props.rowHasChanged}
        renderItem={this.props.renderItem}
        renderDay={this.props.renderDay}
        renderEmptyDate={this.props.renderEmptyDate}
      />
    </View>
  );

  private onListTouch = (): boolean => {
    this.scrollOver = true;
    return false;
  };

  override render(): React.ReactElement {
    const {reservations, selectedDay} = this.props;
    if (!reservations || !reservations[selectedDay.toString('yyyy-MM-dd')]) {
      return this.props.renderEmptyData?.() ?? <ActivityIndicator style={{marginTop: 80}} />;
    }

    return (
      <FlatList
        ref={this.list}
        style={this.props.style}
        contentContainerStyle={this.styles.content}
        data={this.state.reservations}
        renderItem={this.renderRow}
        keyExtractor={(_item, index) => String(index)}
        onScroll={this.onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onMoveShouldSetResponderCapture={this.onListTouch}
      />
    );
  }
}

export default ReservationList;
