import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native-macos';

import { name as appName } from './app.json';
import AppWrapper from './src/AppWrapper';

NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(false);

AppRegistry.registerComponent(appName, () => AppWrapper);

const emitter = new NativeEventEmitter(NativeModules.NativeAnimatedModule);

emitter.addListener('onAnimatedValueUpdate', () => {
  console.trace();
});
