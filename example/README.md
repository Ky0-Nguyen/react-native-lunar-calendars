# React Native Lunar Calendars - Example App

This is an example application demonstrating the features of `react-native-lunar-calendars`.

## Features Demonstrated

- **Basic Calendar**: Simple calendar with day selection
- **Lunar Calendar**: Calendar with Vietnamese lunar dates
- **Period Marking**: Date range selection
- **Multi-Dot Marking**: Multiple events per day
- **Multi-Period Marking**: Multiple date ranges with lunar dates
- **Calendar List**: Scrollable list of calendars
- **Agenda**: Event agenda view

## Getting Started

### Prerequisites

- Node.js >= 16
- React Native development environment
- iOS Simulator or Android Emulator

### Installation

1. Install dependencies:
```bash
cd example
npm install
```

2. For iOS:
```bash
cd ios
pod install
cd ..
```

3. Start the Metro bundler:
```bash
npm start
```

4. Run the app:

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## Examples

### Basic Calendar
Simple calendar with day selection and marking.

### Lunar Calendar
Calendar with Vietnamese lunar dates displayed below solar dates. First day of lunar month is highlighted in red.

### Period Marking
Select date ranges with visual indicators.

### Multi-Dot Marking
Display multiple events per day with different colored dots.

### Multi-Period Marking
Show multiple date ranges with lunar date support.

### Calendar List
Scrollable list of calendars for browsing multiple months.

### Agenda
Event agenda view with lunar calendar integration.

## Lunar Calendar Features

The example demonstrates:
- Automatic lunar date calculation
- Vietnamese lunar calendar display
- Special highlighting for lunar new year
- Integration with all calendar marking types

## Customization

You can customize the calendar appearance by modifying the theme object in each example:

```javascript
theme={{
  selectedDayBackgroundColor: '#00adf5',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: '#ffffff',
  arrowColor: '#00adf5',
  monthTextColor: '#00adf5',
  indicatorColor: '#00adf5',
}}
```

## Troubleshooting

If you encounter issues:

1. Make sure all dependencies are installed
2. Clear Metro cache: `npm start -- --reset-cache`
3. Clean and rebuild the project
4. Check that the library is properly linked

## Contributing

Feel free to add more examples or improve existing ones by submitting a pull request.
