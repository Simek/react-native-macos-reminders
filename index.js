import { AppRegistry, NativeModules } from 'react-native-macos';

import { name as appName } from './app.json';
import AppWrapper from './src/AppWrapper';

NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(false);

AppRegistry.registerComponent(appName, () => AppWrapper);
