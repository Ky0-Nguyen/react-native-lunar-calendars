# react-native-lunar-calendars 🗓️ 🌙

Bộ component lịch cho React Native, hỗ trợ **Âm Lịch Việt Nam**.
Đây là bản fork được duy trì từ [wix/react-native-calendars](https://github.com/wix/react-native-calendars) v1,
giữ nguyên API gốc và bổ sung âm lịch, viết bằng TypeScript, không có native module.

Dùng được với **React Native thuần** và **Expo** (kể cả Expo Go — không cần prebuild).

> Tài liệu đầy đủ bằng tiếng Anh: [README.md](README.md) · [Changelog](CHANGELOG.md)

---

## Demo

<p align="center">
  <a href="https://github.com/Ky0-Nguyen/react-native-lunar-calendars/blob/master/docs/media/demo.mp4">
    <img src="https://raw.githubusercontent.com/Ky0-Nguyen/react-native-lunar-calendars/master/docs/media/demo.gif" width="300" alt="Âm lịch dưới mỗi ngày dương, năm kiểu marking, danh sách tháng cuộn được và agenda trong app Expo mẫu">
  </a>
</p>

<p align="center">
  <sub>
    Ngày âm dưới mỗi ngày dương · Tết tô đỏ · năm kiểu marking · danh sách tháng cuộn được ·
    agenda — <a href="https://github.com/Ky0-Nguyen/react-native-lunar-calendars/blob/master/docs/media/demo.mp4">bấm để xem video chất lượng cao</a>
  </sub>
</p>

Quay trên iPhone với app Expo trong [`example/`](example), điều khiển hoàn toàn bằng flow
[Maestro](https://maestro.dev) tại [`.maestro/demo.yaml`](.maestro/demo.yaml) — nên demo cũng
chính là bài test tích hợp: flow chạy qua nghĩa là mọi màn hình ở trên đều hoạt động thật.
Tự quay lại theo [Chạy demo](#chạy-demo).

## Cài đặt

```bash
npm install react-native-lunar-calendars
```

Thư viện viết hoàn toàn bằng JavaScript, không cần link native.

| Peer dependency | Phiên bản hỗ trợ |
| --- | --- |
| `react` | 17 → 19 |
| `react-native` | 0.64 → 0.87 |
| Expo SDK | 49 → 57 |
| TypeScript | 5.0+ (đã kèm sẵn type) |

## Bắt đầu nhanh

```tsx
import React, {useState} from 'react';
import {Calendar, type DateData} from 'react-native-lunar-calendars';

export default function Screen() {
  const [selected, setSelected] = useState('2026-02-17');

  return (
    <Calendar
      current="2026-02-17"
      markingType="multi-period"
      markedDates={{[selected]: {selected: true, selectedColor: '#0d9488'}}}
      onDayPress={(day: DateData) => setSelected(day.dateString)}
    />
  );
}
```

Mọi callback đều nhận một `DateData`:

```ts
{
  day: 17,                  // ngày trong tháng, 1-31
  month: 2,                 // tháng, 1-12
  year: 2026,
  timestamp: 1771286400000, // timestamp UTC lúc 00:00 của ngày đó
  dateString: '2026-02-17'
}
```

Các prop nhận ngày đều chấp nhận chuỗi `YYYY-MM-DD`, `Date`, `XDate`, timestamp UTC
hoặc object `DateData`.

## Expo

Không cần config plugin, không cần prebuild, không cần `expo-dev-client`:

```bash
npx expo install react-native-lunar-calendars
```

App Expo đầy đủ nằm trong [`example/`](example) (Expo SDK 57, TypeScript):

```bash
npm run build                 # build thư viện ra dist/
npm --prefix example install
npm --prefix example run ios  # hoặc: run android / run web
```

Vì app mẫu dùng thư viện từ thư mục gốc của repo nên
[`metro.config.js`](example/metro.config.js) phải trỏ `react` và `react-native` về bản của
chính app mẫu. Nếu bạn phát triển với một bản checkout cục bộ thì làm tương tự; còn khi cài
từ npm thì không cần gì cả.

## Âm lịch

Ngày âm được hiển thị ngay dưới ngày dương khi dùng marking type `multi-period`:

```tsx
<Calendar markingType="multi-period" />
```

- Ngày mùng 1 âm lịch hiển thị dạng `ngày/tháng` màu đỏ, để dễ nhận ra ranh giới tháng.
- Các ngày còn lại chỉ hiển thị số ngày âm, màu xám.
- Đổi màu qua theme: `lunarNewMonthTextColor` và `lunarTextColor`.

### Dùng trực tiếp hàm chuyển đổi

```ts
import {
  getLunarDate,
  getLunarDateFromString,
  formatLunarDay,
  LUNAR_MIN_YEAR,
  LUNAR_MAX_YEAR
} from 'react-native-lunar-calendars';

getLunarDate(17, 2, 2026);
// { day: 1, month: 1, year: 2026, leap: false, jd: 2461454, isValid: true }  ← Tết

getLunarDateFromString('2024-09-17');
// { day: 15, month: 8, year: 2024, ... }  ← Tết Trung Thu

formatLunarDay(getLunarDate(17, 2, 2026)); // '1/1'
```

| Export | Mô tả |
| --- | --- |
| `getLunarDate(day, month, year)` | Chuyển ngày dương sang âm, trả về `LunarDate`. |
| `getLunarDateFromString('YYYY-MM-DD')` | Tương tự, nhận chuỗi ngày. |
| `formatLunarDay(lunar)` | `'ngày/tháng'` nếu là mùng 1, ngược lại chỉ `'ngày'`. |
| `jdn(day, month, year)` | Số ngày Julius của một ngày dương. |
| `LUNAR_MIN_YEAR` / `LUNAR_MAX_YEAR` | `1800` / `2199` — phạm vi bảng dữ liệu. |
| `clearLunarCache()` / `getLunarCacheStats()` | Điều khiển cache, dùng cho test và benchmark. |

Ngày ngoài khoảng 1800–2199 trả về `{isValid: false}` chứ không ném lỗi, nên không bao giờ
làm crash màn hình.

Độ chính xác được kiểm tra với các mốc Tết đã công bố (2026, 2025, 2024, 2023, 2016, 2015,
2000, 1975), Trung Thu 2024 và tháng 6 nhuận năm 2025 — xem
[`src/lunar/__tests__`](src/lunar/__tests__/lunar.test.ts).

## Các component

| Component | Dùng khi |
| --- | --- |
| `Calendar` | Một tháng cố định. |
| `CalendarList` | Danh sách tháng cuộn được (dọc hoặc ngang). |
| `Agenda` | Lịch thu gọn phía trên danh sách sự kiện theo ngày. |

Danh sách prop đầy đủ của từng component nằm trong [README tiếng Anh](README.md#components),
và mọi prop đều có type + JSDoc nên IDE sẽ gợi ý trực tiếp.

## Các kiểu marking

`markedDates` là object ánh xạ `YYYY-MM-DD` sang marking. **Hãy tạo object mới thay vì sửa
tại chỗ** — lịch so sánh theo tham chiếu, sửa tại chỗ sẽ không re-render.

| `markingType` | Key của marking | Có âm lịch |
| --- | --- | --- |
| `'simple'` (mặc định) | `selected`, `selectedColor`, `marked`, `dotColor`, `disabled`, `textColor` | — |
| `'period'` | `startingDay`, `endingDay`, `color`, `textColor` | — |
| `'multi-dot'` | `dots: [{key, color, selectedDotColor}]` | — |
| `'multi-period'` | `periods: [{startingDay, endingDay, color}]` | ✅ |
| `'custom'` | `customStyles: {container, text}` | — |

Không thể trộn nhiều kiểu marking trong cùng một lịch.

## Theme

```tsx
<Calendar
  theme={{
    calendarBackground: '#ffffff',
    selectedDayBackgroundColor: '#0d9488',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#0d9488',
    dayTextColor: '#0f172a',
    textDisabledColor: '#cbd5e1',
    arrowColor: '#0d9488',
    monthTextColor: '#0f172a',
    // Dành riêng cho âm lịch:
    lunarTextColor: '#64748b',
    lunarNewMonthTextColor: '#e11d48'
  }}
/>
```

Nên giữ object theme ổn định (hằng số ở module hoặc `useMemo`). Stylesheet được cache theo
object theme, tạo object mới mỗi lần render sẽ làm mất hiệu quả cache.

## Ngôn ngữ

```ts
import {LocaleConfig} from 'react-native-lunar-calendars';

LocaleConfig.locales.vi = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
               'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
};

LocaleConfig.defaultLocale = 'vi';
```

`dayNames` luôn bắt đầu từ Chủ Nhật, không phụ thuộc `firstDay`.

## Hiệu năng

Mỗi tháng phải dựng 30–42 ô ngày, và khi bật âm lịch thì mỗi ô cần một phép chuyển đổi lịch.
v3 loại bỏ phần việc lặp lại:

- **Chuyển đổi âm lịch được cache hai tầng** — cache năm âm đã giải mã và cache ngày đã chuyển
  đổi. v2 giải mã lại nguyên một năm âm cho *từng ô*, ở *mỗi lần render*.
- **Stylesheet được cache theo object theme**, thay vì gọi `StyleSheet.create` cho mỗi ô ngày.
- **Component ngày được bọc `React.memo`**, nên các ô không đổi sẽ bỏ qua render.
- **`Calendar` đưa phần tính toán chung ra ngoài vòng lặp ngày** (parse `minDate`/`maxDate`,
  dựng tháng hiện tại).

Đo trên máy Mac chip M bằng `npm run benchmark`, so với thuật toán v2:

| Kịch bản | v2 | v3 | |
| --- | --- | --- | --- |
| Một tháng (42 ô), cache rỗng | 13.0 µs | 9.7 µs | **1.3×** |
| Render lại cùng một tháng | 5.5 µs | 1.2 µs | **4.7×** |
| Cuộn 24 tháng (1008 ô) | 92.5 µs | 24.6 µs | **3.8×** |

Benchmark cũng kiểm tra v3 cho kết quả **giống hệt** v2 trên 2000 ngày mẫu trải khắp
1800–2199, nên tăng tốc mà không mất độ chính xác.

## Nâng cấp từ v2

API component không đổi, nhưng bốn hành vi vốn bị hard-code trong v2 nay đã được sửa hoặc
chuyển thành tuỳ chọn:

| v2 | v3 |
| --- | --- |
| Mọi ngày đều ở trạng thái `disabled` (lỗi — không bao giờ highlight `today`) | Trạng thái ngày được tính đúng |
| Mọi ngày quá khứ đều bị disable | Bật bằng prop `disablePastDates` |
| Nút mũi tên "tháng trước" bị ẩn với các tháng quá khứ | Mũi tên luôn hoạt động; dùng `minDate` để giới hạn |
| `firstDay` mặc định là Thứ Hai ở lưới nhưng Chủ Nhật ở header | Cả hai mặc định Chủ Nhật; truyền `firstDay={1}` nếu muốn Thứ Hai |
| Màu theme mặc định là chữ trắng trên nền trắng ở vài marking type | Trả về bảng màu gốc của upstream |

Ngoài ra `prop-types` đã bị bỏ (dùng type của TypeScript) và các hàm âm lịch được export ở
package root. Xem [CHANGELOG.md](CHANGELOG.md) để biết đầy đủ.

## Chạy demo

Toàn bộ quá trình quay diễn ra trên máy bạn, không upload đi đâu cả.

```bash
# 1. Build thư viện và cài app mẫu
npm install
npm run build
npm --prefix example install

# 2. Mở app mẫu bằng Expo Go trên iOS Simulator đang chạy
npm --prefix example run ios

# 3. Maestro điều khiển app, simctl quay màn hình
./scripts/record-demo.sh
```

Kết quả là `docs/media/demo.mp4` và `docs/media/demo.gif`. Cần cài
[Maestro](https://maestro.dev), `ffmpeg` và công cụ simulator của Xcode.

Kiểm tra nhanh (không quay video):

```bash
maestro test .maestro/smoke.yaml
```

## Đóng góp

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

Chạy đủ bốn lệnh trên trước khi mở pull request. Các lỗi không liên quan đến âm lịch nên
báo trực tiếp ở [wix/react-native-calendars](https://github.com/wix/react-native-calendars).

## Ghi công

- Component lịch: [wix/react-native-calendars](https://github.com/wix/react-native-calendars)
- Fork được duy trì bởi [Tuan Nguyen](https://github.com/Ky0-Nguyen)

Giấy phép MIT — xem [LICENSE](LICENSE).
