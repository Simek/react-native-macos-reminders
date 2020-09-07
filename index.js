/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(false);

AppRegistry.registerComponent(appName, () => App);
