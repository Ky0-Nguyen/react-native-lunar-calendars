/**
 * Metro configuration for the example app.
 *
 * The example consumes the library from the repository root (`file:..`), so Metro has to
 * watch the root and - crucially - resolve `react` and `react-native` to the *example's*
 * copies. Without that, the library's own dev-dependency copies get bundled too and React
 * throws "Invalid hook call" from two Reacts in one bundle.
 */
const path = require('path');
const {getDefaultConfig} = require('expo/metro-config');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [libraryRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(libraryRoot, 'node_modules')
];

config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-lunar-calendars': libraryRoot
};

// Never let the library's dev-dependency React / React Native reach the bundle.
// (Only those two - the root also contains this example, which must stay resolvable.)
config.resolver.blockList = [
  new RegExp(`^${path.resolve(libraryRoot, 'node_modules/react')}/.*$`),
  new RegExp(`^${path.resolve(libraryRoot, 'node_modules/react-native')}/.*$`)
];

module.exports = config;
