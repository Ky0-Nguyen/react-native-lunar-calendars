module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./spec/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*)/)',
  ],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/spec/mocks/react-native.js',
    '^@react-native/normalize-color$': '<rootDir>/spec/mocks/normalize-color.js',
    '^setupDevtools$': '<rootDir>/spec/mocks/setupDevtools.js',
  },
  testEnvironment: 'node',
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
}; 