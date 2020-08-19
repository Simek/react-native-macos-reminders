/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

// TODO: https://github.com/microsoft/react-native-macos/pull/528
// NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(true);

AppRegistry.registerComponent(appName, () => App);
