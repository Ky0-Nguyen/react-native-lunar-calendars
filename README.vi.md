# React Native Lunar Calendars ✨ 🗓️ 📆

Module này là một fork của [react-native-calendars](https://github.com/wix/react-native-calendars) với các component lịch React Native có thể tùy chỉnh và hỗ trợ **Lịch Âm Việt Nam (Âm Lịch)**.

Package này tương thích với cả **Android** và **iOS**.

## 🔄 Về Fork Này

Đây là một fork được duy trì của thư viện `react-native-calendars` gốc của Wix.com. Chúng tôi đã thêm tính năng lịch âm Việt Nam trong khi vẫn giữ nguyên tất cả tính năng gốc.

### Tại Sao Fork Này Tồn Tại

- **Hỗ Trợ Lịch Âm**: Thêm tính toán và hiển thị ngày âm lịch Việt Nam
- **Duy Trì Tích Cực**: Cập nhật và sửa lỗi thường xuyên
- **Hỗ Trợ TypeScript**: Định nghĩa TypeScript đầy đủ
- **Tập Trung Cộng Đồng**: Hỗ trợ cộng đồng developer Việt Nam

### Chiến Lược Đồng Bộ Với Upstream

Chúng tôi duy trì tính tương thích với thư viện gốc trong khi thêm tính năng lịch âm. Khi upstream repository phát hành phiên bản mới:

1. **Cập Nhật Tính Năng**: Chúng tôi merge các tính năng mới từ upstream
2. **Sửa Lỗi**: Chúng tôi tích hợp các bản sửa lỗi từ upstream
3. **Thay Đổi Breaking**: Chúng tôi đánh giá và thích ứng cẩn thận các thay đổi breaking
4. **Tính Năng Lịch Âm**: Chúng tôi bảo tồn và cải thiện tính năng lịch âm

### Tương Thích Phiên Bản

- **Phiên Bản Cơ Sở**: Fork này dựa trên `react-native-calendars` v1.x
- **React Native**: Tương thích với React Native 0.47+ (giống upstream)
- **Lịch Âm**: Hỗ trợ năm 1800-2199

## 🌙 Tính Năng

- **Hỗ Trợ Lịch Âm**: Hiển thị ngày âm lịch Việt Nam cùng với ngày dương lịch
- **Nhiều Loại Lịch**: Basic, Period, Multi-dot, Multi-period và Custom marking styles
- **Tính Toán Ngày Âm**: Chuyển đổi ngày âm chính xác cho năm 1800-2199
- **Tùy Chỉnh Theme**: Hỗ trợ tùy chỉnh theme đầy đủ
- **Hỗ Trợ TypeScript**: Viết bằng TypeScript với định nghĩa type đầy đủ
- **Tối Ưu Hiệu Suất**: Render và cập nhật hiệu quả

## Cài Đặt

```
$ npm install --save react-native-lunar-calendars
```

Giải pháp được triển khai bằng JavaScript nên không cần liên kết native module.

## 🔄 Migration từ react-native-calendars

Nếu bạn đang chuyển từ thư viện `react-native-calendars` gốc:

### Migration Đơn Giản
```javascript
// Trước
import { Calendar } from 'react-native-calendars';

// Sau
import { Calendar } from 'react-native-lunar-calendars';
```

### Migration Nâng Cao Với Tính Năng Lịch Âm
```javascript
import { Calendar } from 'react-native-lunar-calendars';

// Code lịch hiện tại của bạn sẽ hoạt động chính xác
// Plus bạn có thêm tính năng lịch âm tự động
<Calendar
  markingType={'multi-period'}
  // Ngày âm sẽ được hiển thị tự động
/>
```

### Ghi Chú Tương Thích

- ✅ **100% API Tương Thích**: Tất cả API methods gốc hoạt động giống hệt
- ✅ **Cùng Props**: Tất cả props gốc được hỗ trợ
- ✅ **Cùng Events**: Tất cả event handlers gốc hoạt động
- ✅ **Cùng Styling**: Tất cả theme properties gốc hoạt động
- ✅ **Plus Tính Năng Lịch Âm**: Thêm tính năng lịch âm

## Sử Dụng

`import {` [Calendar](#calendar), [CalendarList](#calendarlist), [Agenda](#agenda) `} from 'react-native-lunar-calendars';`

## 🌙 Tính Năng Lịch Âm

Thư viện này bao gồm tính năng lịch âm Việt Nam. Ngày âm được hiển thị tự động bên dưới ngày dương trong lịch. Lịch âm hỗ trợ:

- **Hiển Thị Ngày Âm**: Hiển thị ngày và tháng âm bên dưới ngày dương
- **Ngày Đặc Biệt**: Ngày mùng 1 âm lịch được highlight màu đỏ
- **Tính Toán Chính Xác**: Dựa trên thuật toán lịch âm Việt Nam
- **Phạm Vi Năm**: Hỗ trợ năm 1800-2199

### Ví Dụ Lịch Âm

```javascript
<Calendar
  markingType={'multi-period'}
  // Ngày âm sẽ được hiển thị tự động
  // Ngày mùng 1 âm lịch sẽ hiển thị màu đỏ
  // Các ngày âm khác sẽ hiển thị màu xám
/>
```

Tất cả tham số cho components đều tùy chọn. Theo mặc định, tháng của ngày hiện tại sẽ được hiển thị.

Event handler callbacks được gọi với `calendar objects` như sau:

```javascript
{
  day: 1,     // ngày trong tháng (1-31)
  month: 1,   // tháng trong năm (1-12)
  year: 2017, // năm
  timestamp,   // UTC timestamp đại diện cho 00:00 AM của ngày này
  dateString: '2016-05-13' // ngày được format thành string 'YYYY-MM-DD'
}
```

Các tham số yêu cầu kiểu date chấp nhận datestrings format YYYY-MM-DD, JavaScript date objects, `calendar objects` và UTC timestamps.

Lịch có thể được localize bằng cách thêm custom locales vào object `LocaleConfig`:

```javascript
import {LocaleConfig} from 'react-native-lunar-calendars';

LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
  monthNamesShort: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
  dayNames: ['Chủ Nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'],
  dayNamesShort: ['CN','T2','T3','T4','T5','T6','T7']
};

LocaleConfig.defaultLocale = 'vi';
```

### Calendar

#### Tham Số Cơ Bản

```javascript
<Calendar
  // Tháng hiển thị ban đầu. Mặc định = Date()
  current={'2012-03-01'}
  // Ngày tối thiểu có thể chọn, ngày trước minDate sẽ bị làm xám. Mặc định = undefined
  minDate={'2012-05-10'}
  // Ngày tối đa có thể chọn, ngày sau maxDate sẽ bị làm xám. Mặc định = undefined
  maxDate={'2012-05-30'}
  // Handler được thực thi khi nhấn ngày. Mặc định = undefined
  onDayPress={(day) => {console.log('ngày được chọn', day)}}
  // Handler được thực thi khi nhấn giữ ngày. Mặc định = undefined
  onDayLongPress={(day) => {console.log('ngày được chọn', day)}}
  // Format tháng trong tiêu đề lịch. Giá trị format: http://arshaw.com/xdate/#Formatting
  monthFormat={'yyyy MM'}
  // Handler được thực thi khi tháng hiển thị thay đổi trong lịch. Mặc định = undefined
  onMonthChange={(month) => {console.log('tháng thay đổi', month)}}
  // Ẩn mũi tên điều hướng tháng. Mặc định = false
  hideArrows={true}
  // Thay thế mũi tên mặc định bằng mũi tên tùy chỉnh (direction có thể là 'left' hoặc 'right')
  renderArrow={(direction) => (<Arrow />)}
  // Không hiển thị ngày của tháng khác trong trang tháng. Mặc định = false
  hideExtraDays={true}
  // Nếu hideArrows=false và hideExtraDays=false không chuyển tháng khi tap vào ngày xám
  // từ tháng khác hiển thị trong trang lịch. Mặc định = false
  disableMonthChange={true}
  // Nếu firstDay=1 tuần bắt đầu từ Thứ 2. Lưu ý dayNames và dayNamesShort vẫn nên bắt đầu từ Chủ Nhật.
  firstDay={1}
  // Ẩn tên ngày. Mặc định = false
  hideDayNames={true}
  // Hiển thị số tuần bên trái. Mặc định = false
  showWeekNumbers={true}
  // Handler được thực thi khi nhấn icon mũi tên trái. Nhận callback có thể quay lại tháng trước
  onPressArrowLeft={substractMonth => substractMonth()}
  // Handler được thực thi khi nhấn icon mũi tên phải. Nhận callback có thể tiến tháng sau
  onPressArrowRight={addMonth => addMonth()}
/>
```

#### Đánh Dấu Ngày

**!Disclaimer!** Đảm bảo tham số `markedDates` là immutable. Nếu bạn thay đổi nội dung object `markedDates` nhưng reference đến nó không thay đổi, cập nhật lịch sẽ không được kích hoạt.

#### Tùy Chỉnh Giao Diện

```javascript
<Calendar
  // Chỉ định style cho container element lịch. Mặc định = {}
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350
  }}
  // Chỉ định thuộc tính theme để override specific styles cho các phần lịch. Mặc định = {}
  theme={{
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    monthTextColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textMonthFontWeight: 'bold',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }}
/>
```

### CalendarList

`<CalendarList />` là lịch có thể scroll semi-infinite được tạo thành từ các component `<Calendar />`. Hiện tại có thể scroll 4 năm về trước và 4 năm về tương lai. Tất cả tham số có sẵn cho `<Calendar />` cũng có sẵn cho component này. Cũng có một số tham số bổ sung có thể sử dụng:

```javascript
<CalendarList
  // Callback được thực thi khi các tháng hiển thị thay đổi trong scroll view. Mặc định = undefined
  onVisibleMonthsChange={(months) => {console.log('bây giờ các tháng này hiển thị', months);}}
  // Số lượng tháng tối đa được phép scroll về quá khứ. Mặc định = 50
  pastScrollRange={50}
  // Số lượng tháng tối đa được phép scroll về tương lai. Mặc định = 50
  futureScrollRange={50}
  // Bật hoặc tắt scroll của calendar list
  scrollEnabled={true}
  // Bật hoặc tắt vertical scroll indicator. Mặc định = false
  showScrollIndicator={true}
  ...calendarParams
/>
```

### Agenda

Component agenda nâng cao có thể hiển thị danh sách tương tác cho các item lịch ngày.

```javascript
<Agenda
  // danh sách các item phải được hiển thị trong agenda. Nếu bạn muốn render item như ngày trống
  // giá trị của date key phải là array rỗng []. Nếu không có giá trị cho date key thì
  // được coi là ngày trong câu hỏi chưa được load
  items={
    {'2012-05-22': [{text: 'item 1 - any js object'}],
     '2012-05-23': [{text: 'item 2 - any js object'}],
     '2012-05-24': [],
     '2012-05-25': [{text: 'item 3 - any js object'},{text: 'any js object'}],
    }}
  // callback được gọi khi items cho một tháng nhất định phải được load (tháng trở nên hiển thị)
  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
  // callback được kích hoạt khi lịch được mở hoặc đóng
  onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
  // callback được gọi khi nhấn ngày
  onDayPress={(day)=>{console.log('ngày được nhấn')}}
  // callback được gọi khi ngày thay đổi trong khi scroll agenda list
  onDayChange={(day)=>{console.log('ngày thay đổi')}}
  // ngày được chọn ban đầu
  selected={'2012-05-16'}
  // Ngày tối thiểu có thể chọn, ngày trước minDate sẽ bị làm xám. Mặc định = undefined
  minDate={'2012-05-10'}
  // Ngày tối đa có thể chọn, ngày sau maxDate sẽ bị làm xám. Mặc định = undefined
  maxDate={'2012-05-30'}
  // Số lượng tháng tối đa được phép scroll về quá khứ. Mặc định = 50
  pastScrollRange={50}
  // Số lượng tháng tối đa được phép scroll về tương lai. Mặc định = 50
  futureScrollRange={50}
  // chỉ định cách mỗi item nên được render trong agenda
  renderItem={(item, firstItemInDay) => {return (<View />);}}
  // chỉ định cách mỗi ngày nên được render. day có thể undefined nếu item không phải đầu tiên trong ngày đó.
  renderDay={(day, item) => {return (<View />);}}
  // chỉ định cách nội dung ngày trống không có items nên được render
  renderEmptyDate={() => {return (<View />);}}
  // chỉ định cách agenda knob nên trông như thế nào
  renderKnob={() => {return (<View />);}}
  // chỉ định cái gì nên được render thay vì ActivityIndicator
  renderEmptyData = {() => {return (<View />);}}
  // chỉ định function so sánh item của bạn để tăng performance
  rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
  // Ẩn nút knob. Mặc định = false
  hideKnob={true}
  // Theo mặc định, ngày agenda được đánh dấu nếu chúng có ít nhất một item, nhưng bạn có thể override nếu cần
  markedDates={{
    '2012-05-16': {selected: true, marked: true},
    '2012-05-17': {marked: true},
    '2012-05-18': {disabled: true}
  }}
  // agenda theme
  theme={{
    ...calendarTheme,
    agendaDayTextColor: 'yellow',
    agendaDayNumColor: 'green',
    agendaTodayColor: 'red',
    agendaKnobColor: 'blue'
  }}
  // agenda container style
  style={{}}
/>
```

## 🔧 Bảo Trì & Cập Nhật

### Quy Trình Đồng Bộ Upstream

Khi thư viện `react-native-calendars` gốc phát hành cập nhật, chúng tôi theo quy trình này:

1. **Giám Sát Upstream**: Chúng tôi theo dõi releases từ repository gốc
2. **Đánh Giá Thay Đổi**: Chúng tôi đánh giá tính năng mới và breaking changes
3. **Merge Cập Nhật**: Chúng tôi cẩn thận merge thay đổi upstream trong khi bảo tồn tính năng lịch âm
4. **Test Tương Thích**: Chúng tôi đảm bảo tính năng lịch âm vẫn hoạt động
5. **Phát Hành Cập Nhật**: Chúng tôi publish phiên bản mới với cả cải tiến upstream và lịch âm

### Trạng Thái Hiện Tại

- **Phiên Bản Upstream**: Dựa trên `react-native-calendars` v1.x
- **Lần Sync Cuối**: Tháng 12 2024
- **Tính Năng Lịch Âm**: Hoạt động đầy đủ và đã test
- **Tương Thích**: 100% tương thích với API gốc

### Báo Cáo Vấn Đề

Nếu bạn gặp vấn đề:
1. Kiểm tra xem có phải vấn đề cụ thể về lịch âm không
2. Kiểm tra xem có tồn tại trong thư viện gốc không
3. Báo cáo vấn đề cụ thể về lịch âm ở đây
4. Báo cáo vấn đề lịch chung cho upstream repository

## Đóng Góp

Pull requests được chào đón. Chạy `npm run test` và `npm run lint` trước khi push.

### Hướng Dẫn Phát Triển

- **Tính Năng Lịch Âm**: Tập trung vào cải tiến lịch âm
- **Tương Thích Upstream**: Duy trì tương thích với thư viện gốc
- **Testing**: Test cả tính năng lịch dương và âm
- **Documentation**: Cập nhật docs cho tính năng lịch âm mới

## Tác Giả

- **Tuan Nguyen** - *Công việc ban đầu* - [Ky0-Nguyen](https://github.com/Ky0-Nguyen)

Dự án này là fork của [react-native-calendars](https://github.com/wix/react-native-calendars) với tính năng lịch âm được thêm vào.

Xem thêm danh sách [contributors] đã tham gia dự án này.
