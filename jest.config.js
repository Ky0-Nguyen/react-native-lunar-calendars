module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./spec/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-native-community|@react-native-picker|@react-native-async-storage|@react-native-masked-view|react-native-.*)/)',
  ],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/spec/mocks/react-native.js',
    '^@react-native/normalize-color$': '<rootDir>/spec/mocks/normalize-color.js',
    '^setupDevtools$': '<rootDir>/spec/mocks/setupDevtools.js',
    '^@react-native/js-polyfills/(.*)$': '<rootDir>/spec/mocks/react-native.js',
    '^@react-native/(.*)$': '<rootDir>/spec/mocks/react-native.js',
    '^react-native/(.*)$': '<rootDir>/spec/mocks/react-native.js',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/spec/setup.ts'],
  testTimeout: 10000,
  testRegex: '/__tests__/.*\\.(test|spec)\\.[jt]sx?$',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}; 