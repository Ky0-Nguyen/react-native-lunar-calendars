import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import XDate from 'xdate';
import * as dateutils from '../dateutils';
import {parseDate, xdateToData} from '../interface';
import {VelocityTracker} from '../input';
import CalendarList from '../calendar-list';
import ReservationList, {type AgendaItems} from './reservation-list';
import styleConstructor from './style';
import type {CalendarTheme, DateData, MarkedDates, MarkingType} from '../theme';

const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;

/**
 * Structural types for the two imperative handles this component needs. React Native's
 * generated component types do not expose them, and only these methods are used.
 */
interface ScrollableHandle {
  scrollTo(options: {x: number; y: number; animated: boolean}): void;
  /** Older React Native wrapped the inner ScrollView of an `Animated.ScrollView`. */
  _component?: ScrollableHandle;
}

interface NativePropsHandle {
  setNativeProps(props: {style: ViewStyle}): void;
}

export interface AgendaProps<T = unknown> {
  theme?: CalendarTheme;
  style?: StyleProp<ViewStyle>;
  /** Test identifier placed on the agenda container. */
  testID?: string;
  /** Items to show, keyed by `YYYY-MM-DD`. `[]` = loaded but empty, missing key = not loaded yet. */
  items?: AgendaItems<T>;
  /** Initially selected day. */
  selected?: string | number | Date | XDate | DateData;
  minDate?: string | number | Date | XDate | DateData;
  maxDate?: string | number | Date | XDate | DateData;
  pastScrollRange?: number;
  futureScrollRange?: number;
  markedDates?: MarkedDates;
  markingType?: MarkingType;
  firstDay?: number;
  monthFormat?: string;
  /** Hide the drag knob under the calendar. */
  hideKnob?: boolean;
  removeClippedSubviews?: boolean;
  dayComponent?: React.ComponentType<unknown>;
  disabledByDefault?: boolean;
  disablePastDates?: boolean;
  loadItemsForMonth?: (month: DateData) => void;
  onCalendarToggled?: (calendarOpened: boolean) => void;
  onDayPress?: (day: DateData) => void;
  onDayChange?: (day: DateData) => void;
  renderItem?: (reservation: T, isFirstOfDay: boolean) => React.ReactNode;
  renderDay?: (date: DateData | undefined, reservation?: T) => React.ReactNode;
  renderEmptyDate?: (date?: XDate | false) => React.ReactNode;
  renderEmptyData?: () => React.ReactElement;
  renderKnob?: () => React.ReactNode;
  rowHasChanged?: (a: T, b: T) => boolean;
}

interface AgendaState {
  scrollY: Animated.Value;
  calendarIsReady: boolean;
  calendarScrollable: boolean;
  firstReservationLoad: boolean;
  selectedDay: XDate;
  topDay: XDate;
}

class Agenda<T = unknown> extends Component<AgendaProps<T>, AgendaState> {
  private styles: ReturnType<typeof styleConstructor>;
  private viewHeight: number;
  private viewWidth: number;
  private scrollTimeout?: ReturnType<typeof setTimeout>;
  private headerState: 'idle' | 'touched' | 'dragged' = 'idle';
  private currentMonth: XDate;
  private knobTracker = new VelocityTracker();
  private isMounted_ = false;

  private calendar = React.createRef<CalendarList>();
  private scrollPad: ScrollableHandle | null = null;
  private knob: NativePropsHandle | null = null;

  private setScrollPadRef = (ref: unknown): void => {
    this.scrollPad = ref as ScrollableHandle | null;
  };

  private setKnobRef = (ref: unknown): void => {
    this.knob = ref as NativePropsHandle | null;
  };

  constructor(props: AgendaProps<T>) {
    super(props);
    this.styles = styleConstructor(props.theme);

    const window = Dimensions.get('window');
    this.viewHeight = window.height;
    this.viewWidth = window.width;

    const selected = parseDate(props.selected) ?? new XDate(true);
    this.state = {
      scrollY: new Animated.Value(0),
      calendarIsReady: false,
      calendarScrollable: false,
      firstReservationLoad: false,
      selectedDay: selected,
      topDay: selected.clone()
    };
    this.currentMonth = selected.clone();
    this.state.scrollY.addListener(({value}) => this.knobTracker.add(value));
  }

  override componentDidMount(): void {
    this.isMounted_ = true;
    this.loadReservations(this.props);
  }

  override componentWillUnmount(): void {
    this.isMounted_ = false;
    this.state.scrollY.removeAllListeners();
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  override componentDidUpdate(prevProps: AgendaProps<T>): void {
    if (prevProps.items === this.props.items) {
      return;
    }
    if (this.props.items) {
      if (this.state.firstReservationLoad) {
        this.setState({firstReservationLoad: false});
      }
      return;
    }
    this.loadReservations(this.props);
  }

  private loadReservations(props: AgendaProps<T>): void {
    if ((props.items && Object.keys(props.items).length) || this.state.firstReservationLoad) {
      return;
    }
    this.setState({firstReservationLoad: true}, () => {
      this.props.loadItemsForMonth?.(xdateToData(this.state.selectedDay));
    });
  }

  private calendarOffset(): number {
    return 90 - this.viewHeight / 2;
  }

  private initialScrollPadPosition(): number {
    return Math.max(0, this.viewHeight - HEADER_HEIGHT);
  }

  private setScrollPadPosition(y: number, animated: boolean): void {
    // `Animated.ScrollView` hands back the ScrollView itself on modern React Native and
    // wrapped it in `_component` on older versions, so accept either.
    const pad = this.scrollPad;
    (pad?._component ?? pad)?.scrollTo({x: 0, y, animated});
  }

  private onScrollPadLayout = (): void => {
    // The knob is a ScrollView pinned at its bottom: only then does dragging downwards
    // actually move it. Rendering the full-height calendar is deferred by a tick to
    // avoid a visible flicker.
    this.setScrollPadPosition(this.initialScrollPadPosition(), false);
    setTimeout(() => {
      if (this.isMounted_) {
        this.setState({calendarIsReady: true});
      }
    }, 0);
  };

  private onLayout = (event: LayoutChangeEvent): void => {
    this.viewHeight = event.nativeEvent.layout.height;
    this.viewWidth = event.nativeEvent.layout.width;
    this.forceUpdate();
  };

  private onTouchStart = (): void => {
    this.headerState = 'touched';
    this.knob?.setNativeProps({style: {opacity: 0.5}});
  };

  private onTouchEnd = (): void => {
    this.knob?.setNativeProps({style: {opacity: 1}});
    if (this.headerState === 'touched') {
      this.setScrollPadPosition(0, true);
      this.enableCalendarScrolling();
    }
    this.headerState = 'idle';
  };

  private onStartDrag = (): void => {
    this.headerState = 'dragged';
    this.knobTracker.reset();
  };

  private onSnapAfterDrag = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    // Android does not call onTouchEnd once a drag started.
    this.onTouchEnd();
    const currentY = event.nativeEvent.contentOffset.y;
    this.knobTracker.add(currentY);
    const projectedY = currentY + this.knobTracker.estimateSpeed() * 250;
    const maxY = this.initialScrollPadPosition();
    const snapY = projectedY > maxY / 2 ? maxY : 0;
    this.setScrollPadPosition(snapY, true);
    if (snapY === 0) {
      this.enableCalendarScrolling();
    }
  };

  private onVisibleMonthsChange = (months: DateData[]): void => {
    if (!this.props.items || this.state.firstReservationLoad) {
      return;
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      if (this.isMounted_) {
        this.props.loadItemsForMonth?.(months[0]);
      }
    }, 200);
  };

  private enableCalendarScrolling(): void {
    this.setState({calendarScrollable: true});
    this.props.onCalendarToggled?.(true);
    // The +1 offset forces a repaint on iOS; without it neighbouring months stay blank
    // because of the `overflow: hidden` needed for smooth dragging.
    this.calendar.current?.scrollToDay(this.state.selectedDay, this.calendarOffset() + 1, true);
  }

  private chooseDayFromCalendar = (day: DateData): void => {
    this.chooseDay(day, !this.state.calendarScrollable);
  };

  private chooseDay(date: DateData | XDate, optimisticScroll: boolean): void {
    const day = parseDate(date);
    if (!day) {
      return;
    }

    this.setState(state => ({
      calendarScrollable: false,
      selectedDay: day.clone(),
      topDay: optimisticScroll ? state.topDay : day.clone()
    }));
    this.props.onCalendarToggled?.(false);
    this.setScrollPadPosition(this.initialScrollPadPosition(), true);
    this.calendar.current?.scrollToDay(day, this.calendarOffset(), true);
    this.props.loadItemsForMonth?.(xdateToData(day));
    this.props.onDayPress?.(xdateToData(day));
  }

  private onDayChange = (day: XDate): void => {
    const newDate = parseDate(day);
    if (!newDate) {
      return;
    }
    const withAnimation = dateutils.sameMonth(newDate, this.state.selectedDay);
    this.calendar.current?.scrollToDay(day, this.calendarOffset(), withAnimation);
    this.setState({selectedDay: newDate});
    this.props.onDayChange?.(xdateToData(newDate));
  };

  private generateMarkings(): MarkedDates {
    let markings = this.props.markedDates;
    if (!markings) {
      markings = {};
      const items = this.props.items ?? {};
      for (const key of Object.keys(items)) {
        if (items[key]?.length) {
          markings[key] = {marked: true};
        }
      }
    }
    const key = this.state.selectedDay.toString('yyyy-MM-dd');
    return {...markings, [key]: {...(markings[key] ?? {}), selected: true}};
  }

  override render(): React.ReactElement {
    const agendaHeight = Math.max(0, this.viewHeight - HEADER_HEIGHT);
    const weekDaysNames = dateutils.weekDayNames(this.props.firstDay ?? 0);

    const weekdaysStyle: StyleProp<ViewStyle>[] = [
      this.styles.weekdays,
      {
        opacity: this.state.scrollY.interpolate({
          inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }),
        transform: [
          {
            translateY: this.state.scrollY.interpolate({
              inputRange: [Math.max(0, agendaHeight - HEADER_HEIGHT), agendaHeight],
              outputRange: [-HEADER_HEIGHT, 0],
              extrapolate: 'clamp'
            })
          }
        ]
      } as unknown as ViewStyle
    ];

    const headerStyle: StyleProp<ViewStyle>[] = [
      this.styles.header,
      {
        bottom: agendaHeight,
        transform: [
          {
            translateY: this.state.scrollY.interpolate({
              inputRange: [0, agendaHeight],
              outputRange: [agendaHeight, 0],
              extrapolate: 'clamp'
            })
          }
        ]
      } as unknown as ViewStyle
    ];

    const contentTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [0, agendaHeight / 2],
      extrapolate: 'clamp'
    });

    if (!this.state.calendarIsReady) {
      // Keep the header collapsed until the drag machinery is wired up.
      headerStyle.push({height: 0});
      weekdaysStyle.push({height: HEADER_HEIGHT});
    }

    const shouldAllowDragging = !this.props.hideKnob && !this.state.calendarScrollable;
    const scrollPadStyle: ViewStyle = {
      position: 'absolute',
      width: 80,
      height: KNOB_HEIGHT,
      top: (shouldAllowDragging ? HEADER_HEIGHT : 0) - KNOB_HEIGHT,
      left: (this.viewWidth - 80) / 2
    };

    let knob: React.ReactNode = <View style={this.styles.knobContainer} />;
    if (!this.props.hideKnob) {
      knob = this.state.calendarScrollable ? null : (
        <View style={this.styles.knobContainer}>
          <View ref={this.setKnobRef}>
            {this.props.renderKnob ? this.props.renderKnob() : <View style={this.styles.knob} />}
          </View>
        </View>
      );
    }

    return (
      <View testID={this.props.testID} onLayout={this.onLayout} style={[this.props.style, {flex: 1, overflow: 'hidden'}]}>
        <View style={this.styles.reservations}>
          <ReservationList<T>
            reservations={this.props.items}
            selectedDay={this.state.selectedDay}
            topDay={this.state.topDay}
            theme={this.props.theme}
            rowHasChanged={this.props.rowHasChanged}
            renderItem={this.props.renderItem}
            renderDay={this.props.renderDay}
            renderEmptyDate={this.props.renderEmptyDate}
            renderEmptyData={this.props.renderEmptyData}
            onDayChange={this.onDayChange}
          />
        </View>

        <Animated.View style={headerStyle}>
          <Animated.View style={{flex: 1, transform: [{translateY: contentTranslate}]}}>
            <CalendarList
              ref={this.calendar}
              onLayout={() => {
                this.calendar.current?.scrollToDay(this.state.selectedDay.clone(), this.calendarOffset(), false);
              }}
              theme={this.props.theme}
              onVisibleMonthsChange={this.onVisibleMonthsChange}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              current={this.currentMonth}
              markedDates={this.generateMarkings()}
              markingType={this.props.markingType}
              removeClippedSubviews={this.props.removeClippedSubviews}
              onDayPress={this.chooseDayFromCalendar}
              scrollEnabled={this.state.calendarScrollable}
              hideExtraDays={this.state.calendarScrollable}
              firstDay={this.props.firstDay}
              monthFormat={this.props.monthFormat}
              pastScrollRange={this.props.pastScrollRange}
              futureScrollRange={this.props.futureScrollRange}
              dayComponent={this.props.dayComponent}
              disabledByDefault={this.props.disabledByDefault}
              disablePastDates={this.props.disablePastDates}
            />
          </Animated.View>
          {knob}
        </Animated.View>

        <Animated.View style={weekdaysStyle}>
          {weekDaysNames.map(day => (
            <Text allowFontScaling={false} key={day} style={this.styles.weekday} numberOfLines={1}>
              {day}
            </Text>
          ))}
        </Animated.View>

        <Animated.ScrollView
          ref={this.setScrollPadRef}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={scrollPadStyle}
          scrollEventThrottle={1}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          onScrollBeginDrag={this.onStartDrag}
          onScrollEndDrag={this.onSnapAfterDrag}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}], {
            useNativeDriver: true
          })}
        >
          <View style={{height: agendaHeight + KNOB_HEIGHT}} onLayout={this.onScrollPadLayout} />
        </Animated.ScrollView>
      </View>
    );
  }
}

export default Agenda;
