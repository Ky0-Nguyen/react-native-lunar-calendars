const React = require('react');
const ReactNative = {
  StyleSheet: {
    create: (styles) => styles,
  },
  Platform: {
    select: (obj) => obj.ios,
  },
  Dimensions: {
    get: () => ({
      width: 375,
      height: 667,
    }),
  },
  TouchableOpacity: 'TouchableOpacity',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  TouchableHighlight: 'TouchableHighlight',
  TouchableNativeFeedback: 'TouchableNativeFeedback',
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  ScrollView: 'ScrollView',
  FlatList: 'FlatList',
  Modal: 'Modal',
  Animated: {
    View: 'Animated.View',
    createAnimatedComponent: (component) => component,
    Value: jest.fn(),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
  },
  UIManager: {
    measure: jest.fn(),
  },
};

module.exports = ReactNative; 