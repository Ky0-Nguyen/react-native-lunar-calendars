import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import XDate from 'xdate';
import * as dateutils from '../dateutils';
import {parseDate, xdateToData} from '../interface';
import type {CalendarProps} from '../calendar';
import CalendarListItem from './item';
import styleConstructor from './style';
import type {DateData} from '../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export interface CalendarListProps extends CalendarProps {
  /** Months available before the current one. Default `50`. */
  pastScrollRange?: number;
  /** Months available after the current one. Default `50`. */
  futureScrollRange?: number;
  /** Height of a single month. Default `360`. */
  calendarHeight?: number;
  /** Width of a single month when scrolling horizontally. Default: screen width. */
  calendarWidth?: number;
  /** Scroll horizontally instead of vertically. */
  horizontal?: boolean;
  /** Snap to a full month while scrolling horizontally. */
  pagingEnabled?: boolean;
  /** Allow the list to scroll. Default `true`. */
  scrollEnabled?: boolean;
  /** Show the scroll indicator. Default `false`. */
  showScrollIndicator?: boolean;
  /** Detach off-screen months from the native view hierarchy. Default: `false` on Android. */
  removeClippedSubviews?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Test identifier placed on the underlying list. */
  testID?: string;
  onVisibleMonthsChange?: (months: DateData[]) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

interface CalendarListState {
  rows: (XDate | string)[];
  texts: string[];
  openDate: XDate;
  propbump: number;
}

/** Minimal shape of the tokens FlatList reports; React Native stopped exporting `ViewToken`. */
interface ViewToken {
  index?: number | null;
}

const DEFAULT_CALENDAR_HEIGHT = 360;
const VIEWABILITY_CONFIG = {itemVisiblePercentThreshold: 20};

class CalendarList extends Component<CalendarListProps, CalendarListState> {
  private style: ReturnType<typeof styleConstructor>;
  private pastScrollRange: number;
  private futureScrollRange: number;
  private calendarHeight: number;
  private calendarWidth: number;
  private list = React.createRef<FlatList<XDate | string>>();

  constructor(props: CalendarListProps) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.pastScrollRange = props.pastScrollRange ?? 50;
    this.futureScrollRange = props.futureScrollRange ?? 50;
    this.calendarHeight = props.calendarHeight ?? DEFAULT_CALENDAR_HEIGHT;
    this.calendarWidth = props.calendarWidth ?? SCREEN_WIDTH;

    const rows: (XDate | string)[] = [];
    const texts: string[] = [];
    const date = parseDate(props.current) ?? new XDate();

    for (let i = 0; i <= this.pastScrollRange + this.futureScrollRange; i++) {
      const rangeDate = date.clone().addMonths(i - this.pastScrollRange, true);
      const rangeDateStr = rangeDate.toString('MMM yyyy');
      texts.push(rangeDateStr);
      // Render the month around the initial position eagerly, everything else as a placeholder.
      const isNearInitial =
        (this.pastScrollRange - 1 <= i && i <= this.pastScrollRange + 1) ||
        (!this.pastScrollRange && i <= this.pastScrollRange + 2);
      rows.push(isNearInitial ? rangeDate : rangeDateStr);
    }

    this.state = {rows, texts, openDate: date, propbump: 0};
  }

  override componentDidUpdate(prevProps: CalendarListProps): void {
    const current = parseDate(prevProps.current);
    const nextCurrent = parseDate(this.props.current);
    if (nextCurrent && current && nextCurrent.getTime() !== current.getTime()) {
      this.scrollToMonth(nextCurrent);
    }
    if (prevProps.markedDates !== this.props.markedDates || prevProps.theme !== this.props.theme) {
      this.setState(state => ({propbump: state.propbump + 1}));
    }
  }

  /** Scroll so that `date` is visible. `offset` nudges the final position in pixels. */
  scrollToDay(date: Parameters<typeof parseDate>[0], offset?: number, animated?: boolean): void {
    const day = parseDate(date);
    if (!day) {
      return;
    }
    const diffMonths = Math.round(
      this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1))
    );
    const size = this.props.horizontal ? this.calendarWidth : this.calendarHeight;
    let scrollAmount = size * this.pastScrollRange + diffMonths * size + (offset ?? 0);

    if (!this.props.horizontal) {
      const days = dateutils.page(day, this.props.firstDay ?? 0);
      for (let i = 0; i < days.length; i++) {
        if (dateutils.sameDate(days[i], day)) {
          scrollAmount += 46 * Math.floor(i / 7);
          break;
        }
      }
    }
    this.list.current?.scrollToOffset({offset: scrollAmount, animated: animated ?? false});
  }

  /** Scroll to the first day of `month`. */
  scrollToMonth(month: Parameters<typeof parseDate>[0]): void {
    const scrollTo = parseDate(month) ?? this.state.openDate;
    const diffMonths = Math.round(
      this.state.openDate.clone().setDate(1).diffMonths(scrollTo.clone().setDate(1))
    );
    const size = this.props.horizontal ? this.calendarWidth : this.calendarHeight;
    this.list.current?.scrollToOffset({
      offset: size * this.pastScrollRange + diffMonths * size,
      animated: false
    });
  }

  private onViewableItemsChanged = ({viewableItems}: {viewableItems: ViewToken[]}): void => {
    const visibleIndexes = viewableItems
      .map(token => token.index)
      .filter((index): index is number => index !== null && index !== undefined);

    if (!visibleIndexes.length) {
      return;
    }

    const min = Math.min(...visibleIndexes);
    const max = Math.max(...visibleIndexes);
    const rows = this.state.rows;
    const nextRows: (XDate | string)[] = new Array(rows.length);
    const visibleMonths: DateData[] = [];
    let changed = false;

    for (let i = 0; i < rows.length; i++) {
      // Keep one month of slack on each side so scrolling never shows a placeholder.
      const shouldRender = i >= min - 1 && i <= max + 1;
      let value = rows[i];

      if (shouldRender && typeof value === 'string') {
        value = this.state.openDate.clone().addMonths(i - this.pastScrollRange, true);
        changed = true;
      } else if (!shouldRender && typeof value !== 'string') {
        value = this.state.texts[i];
        changed = true;
      }

      nextRows[i] = value;

      if (i >= min && i <= max && typeof value !== 'string') {
        visibleMonths.push(xdateToData(value));
      }
    }

    if (visibleMonths.length) {
      this.props.onVisibleMonthsChange?.(visibleMonths);
    }
    if (changed) {
      this.setState({rows: nextRows});
    }
  };

  private renderItem = ({item}: {item: XDate | string}): React.ReactElement => (
    <CalendarListItem
      {...this.props}
      testID={undefined}
      item={item}
      propbump={this.state.propbump}
      calendarHeight={this.calendarHeight}
      calendarWidth={this.props.horizontal ? this.calendarWidth : undefined}
    />
  );

  private getItemLayout = (_data: ArrayLike<XDate | string> | null | undefined, index: number) => {
    const length = this.props.horizontal ? this.calendarWidth : this.calendarHeight;
    return {length, offset: length * index, index};
  };

  private keyExtractor = (_item: XDate | string, index: number): string => String(index);

  override render(): React.ReactElement {
    const showIndicator = this.props.showScrollIndicator ?? false;

    return (
      <FlatList
        ref={this.list}
        testID={this.props.testID}
        style={[this.style.container, this.props.style]}
        data={this.state.rows}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        getItemLayout={this.getItemLayout}
        initialScrollIndex={this.pastScrollRange}
        initialNumToRender={12}
        horizontal={this.props.horizontal ?? false}
        pagingEnabled={this.props.pagingEnabled}
        scrollEnabled={this.props.scrollEnabled ?? true}
        showsVerticalScrollIndicator={showIndicator}
        showsHorizontalScrollIndicator={showIndicator}
        removeClippedSubviews={this.props.removeClippedSubviews ?? Platform.OS !== 'android'}
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onLayout={this.props.onLayout}
      />
    );
  }
}

export default CalendarList;
