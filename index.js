import { AppRegistry, NativeModules } from 'react-native-macos';

import { name as appName } from './app.json';
import App from './src/App';

NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(false);

AppRegistry.registerComponent(appName, () => App);
