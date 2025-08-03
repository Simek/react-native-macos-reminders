import { Animated, AppRegistry, NativeModules } from 'react-native-macos';

import { name as appName } from './app.json';
import App from './src/App';

NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(false);

AppRegistry.registerComponent(appName, () => App);

const stubAV = new Animated.Value(0);
stubAV.addListener(() => {});
