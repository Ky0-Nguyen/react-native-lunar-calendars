// Mock React Native completely to avoid TypeScript syntax issues
jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn(obj => obj.default || obj.ios)
  },
  StyleSheet: {
    create: jest.fn(styles => styles)
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 }))
  },
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
  Image: 'Image',
  Animated: {
    Value: jest.fn(),
    timing: jest.fn(() => ({
      start: jest.fn()
    })),
    spring: jest.fn(() => ({
      start: jest.fn()
    }))
  },
  PanResponder: {
    create: jest.fn(() => ({
      panHandlers: {}
    }))
  },
  NativeModules: {
    RNGestureHandlerModule: {
      attachGestureHandler: jest.fn(),
      createGestureHandler: jest.fn(),
      dropGestureHandler: jest.fn(),
      updateGestureHandler: jest.fn(),
      getState: jest.fn(),
      sendEvent: jest.fn(),
      sendTouchEvent: jest.fn(),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    }
  }
}));

// Mock @react-native modules
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  setGlobalErrorHandler: jest.fn(),
  getGlobalErrorHandler: jest.fn(),
}));

jest.mock('@react-native/normalize-color', () => {
  return jest.fn((color) => color);
});

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: 'Swipeable',
  DrawerLayout: 'DrawerLayout',
  State: {},
  ScrollView: 'ScrollView',
  Slider: 'Slider',
  Switch: 'Switch',
  TextInput: 'TextInput',
  ToolbarAndroid: 'ToolbarAndroid',
  ViewPagerAndroid: 'ViewPagerAndroid',
  DrawerLayoutAndroid: 'DrawerLayoutAndroid',
  WebView: 'WebView',
  NativeViewGestureHandler: 'NativeViewGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
  FlingGestureHandler: 'FlingGestureHandler',
  ForceTouchGestureHandler: 'ForceTouchGestureHandler',
  LongPressGestureHandler: 'LongPressGestureHandler',
  PanGestureHandler: 'PanGestureHandler',
  PinchGestureHandler: 'PinchGestureHandler',
  RotationGestureHandler: 'RotationGestureHandler',
  Directions: {},
  gestureHandlerRootHOC: jest.fn((component) => component),
  TouchableHighlight: 'TouchableHighlight',
  TouchableNativeFeedback: 'TouchableNativeFeedback',
  TouchableOpacity: 'TouchableOpacity',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    call: () => {},
    Value: jest.fn(),
    timing: jest.fn(() => ({
      start: jest.fn()
    })),
    spring: jest.fn(() => ({
      start: jest.fn()
    }))
  }
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Setup global mocks
global.__reanimatedWorkletInit = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configure Enzyme for React 18
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

// Mock XDate
jest.mock('xdate', () => {
  return jest.fn().mockImplementation((arg?: any) => {
    const date = arg ? new Date(arg) : new Date();
    date.toString = jest.fn(() => '2024-03-19');
    date.setDate = jest.fn();
    date.setMonth = jest.fn();
    date.setFullYear = jest.fn();
    date.getDate = jest.fn(() => 19);
    date.getMonth = jest.fn(() => 2);
    date.getFullYear = jest.fn(() => 2024);
    date.addMonths = jest.fn();
    date.addDays = jest.fn();
    date.clone = jest.fn(() => date);
    return date;
  });
});

// Add custom matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },
});
