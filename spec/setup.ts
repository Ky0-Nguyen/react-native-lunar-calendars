import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Mock XDate
jest.mock('xdate', () => {
  return class XDate {
    constructor(arg?: any) {
      if (arg) {
        return new Date(arg);
      }
      return new Date();
    }

    static UTC = jest.fn();
    toString = jest.fn(() => '2024-03-19');
    setDate = jest.fn();
    setMonth = jest.fn();
    setFullYear = jest.fn();
    getDate = jest.fn(() => 19);
    getMonth = jest.fn(() => 2);
    getFullYear = jest.fn(() => 2024);
    addMonths = jest.fn();
    addDays = jest.fn();
    clone = jest.fn(() => this);
  };
});

// Mock console.warn to reduce noise in tests
console.warn = jest.fn();

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

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn(obj => obj.default)
  },
  StyleSheet: {
    create: jest.fn(styles => styles)
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 }))
  },
  TouchableOpacity: 'TouchableOpacity',
  View: 'View',
  Text: 'Text'
})); 