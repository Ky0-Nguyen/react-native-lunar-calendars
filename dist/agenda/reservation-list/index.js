"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var reservation_1 = __importDefault(require("./reservation"));
var prop_types_1 = __importDefault(require("prop-types"));
var xdate_1 = __importDefault(require("xdate"));
var dateutils_1 = __importDefault(require("../../dateutils"));
var style_1 = __importDefault(require("./style"));
var ReactComp = /** @class */ (function (_super) {
    __extends(ReactComp, _super);
    function ReactComp(props) {
        var _this = _super.call(this, props) || this;
        _this.styles = (0, style_1.default)(props.theme);
        _this.state = {
            reservations: []
        };
        _this.heights = [];
        _this.selectedDay = _this.props.selectedDay;
        _this.scrollOver = true;
        return _this;
    }
    ReactComp.prototype.componentDidMount = function () {
        this.updateDataSource(this.getReservations(this.props).reservations);
    };
    ReactComp.prototype.updateDataSource = function (reservations) {
        this.setState({
            reservations: reservations
        });
    };
    ReactComp.prototype.updateReservations = function (props) {
        var reservations = this.getReservations(props);
        if (this.list && !dateutils_1.default.sameDate(props.selectedDay, this.selectedDay)) {
            var scrollPosition = 0;
            for (var i = 0; i < reservations.scrollPosition; i++) {
                scrollPosition += this.heights[i] || 0;
            }
            this.scrollOver = false;
            this.list.scrollToOffset({ offset: scrollPosition, animated: true });
        }
        this.selectedDay = props.selectedDay;
        this.updateDataSource(reservations.reservations);
    };
    ReactComp.prototype.componentWillReceiveProps = function (props) {
        var _this = this;
        if (!dateutils_1.default.sameDate(props.topDay, this.props.topDay)) {
            this.setState({
                reservations: []
            }, function () {
                _this.updateReservations(props);
            });
        }
        else {
            this.updateReservations(props);
        }
    };
    ReactComp.prototype.onScroll = function (event) {
        var yOffset = event.nativeEvent.contentOffset.y;
        this.props.onScroll(yOffset);
        var topRowOffset = 0;
        var topRow;
        for (topRow = 0; topRow < this.heights.length; topRow++) {
            if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
                break;
            }
            topRowOffset += this.heights[topRow];
        }
        var row = this.state.reservations[topRow];
        if (!row)
            return;
        var day = row.day;
        var sameDate = dateutils_1.default.sameDate(day, this.selectedDay);
        if (!sameDate && this.scrollOver) {
            this.selectedDay = day.clone();
            this.props.onDayChange(day.clone());
        }
    };
    ReactComp.prototype.onRowLayoutChange = function (ind, event) {
        this.heights[ind] = event.nativeEvent.layout.height;
    };
    ReactComp.prototype.renderRow = function (_a) {
        var item = _a.item, index = _a.index;
        return (<react_native_1.View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <reservation_1.default item={item} renderItem={this.props.renderItem} renderDay={this.props.renderDay} renderEmptyDate={this.props.renderEmptyDate} theme={this.props.theme} rowHasChanged={this.props.rowHasChanged}/>
      </react_native_1.View>);
    };
    ReactComp.prototype.getReservationsForDay = function (iterator, props) {
        var day = iterator.clone();
        var res = props.reservations[day.toString('yyyy-MM-dd')];
        if (res && res.length) {
            return res.map(function (reservation, i) {
                return {
                    reservation: reservation,
                    date: i ? false : day,
                    day: day
                };
            });
        }
        else if (res) {
            return [{
                    date: iterator.clone(),
                    day: day
                }];
        }
        else {
            return false;
        }
    };
    ReactComp.prototype.onListTouch = function () {
        this.scrollOver = true;
    };
    ReactComp.prototype.getReservations = function (props) {
        if (!props.reservations || !props.selectedDay) {
            return { reservations: [], scrollPosition: 0 };
        }
        var reservations = [];
        if (this.state.reservations && this.state.reservations.length) {
            var iterator_1 = this.state.reservations[0].day.clone();
            while (iterator_1.getTime() < props.selectedDay.getTime()) {
                var res = this.getReservationsForDay(iterator_1, props);
                if (!res) {
                    reservations = [];
                    break;
                }
                else {
                    reservations = reservations.concat(res);
                }
                iterator_1.addDays(1);
            }
        }
        var scrollPosition = reservations.length;
        var iterator = props.selectedDay.clone();
        for (var i = 0; i < 31; i++) {
            var res = this.getReservationsForDay(iterator, props);
            if (res) {
                reservations = reservations.concat(res);
            }
            iterator.addDays(1);
        }
        return { reservations: reservations, scrollPosition: scrollPosition };
    };
    ReactComp.prototype.render = function () {
        var _this = this;
        if (!this.props.reservations || !this.props.reservations[this.props.selectedDay.toString('yyyy-MM-dd')]) {
            if (this.props.renderEmptyData) {
                return this.props.renderEmptyData();
            }
            return (<react_native_1.ActivityIndicator style={{ marginTop: 80 }}/>);
        }
        return (<react_native_1.FlatList ref={function (c) { return _this.list = c; }} style={this.props.style} contentContainerStyle={this.styles.content} renderItem={this.renderRow.bind(this)} data={this.state.reservations} onScroll={this.onScroll.bind(this)} showsVerticalScrollIndicator={false} scrollEventThrottle={200} onMoveShouldSetResponderCapture={function () { _this.onListTouch(); return false; }} keyExtractor={function (item, index) { return String(index); }}/>);
    };
    ReactComp.propTypes = {
        // specify your item comparison function for increased performance
        rowHasChanged: prop_types_1.default.func,
        // specify how each item should be rendered in agenda
        renderItem: prop_types_1.default.func,
        // specify how each date should be rendered. day can be undefined if the item is not first in that day.
        renderDay: prop_types_1.default.func,
        // specify how empty date content with no items should be rendered
        renderEmptyDate: prop_types_1.default.func,
        // callback that gets called when day changes while scrolling agenda list
        onDayChange: prop_types_1.default.func,
        // onScroll ListView event
        onScroll: prop_types_1.default.func,
        // the list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key kas to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        reservations: prop_types_1.default.object,
        selectedDay: prop_types_1.default.instanceOf(xdate_1.default),
        topDay: prop_types_1.default.instanceOf(xdate_1.default),
    };
    return ReactComp;
}(react_1.Component));
exports.default = ReactComp;
