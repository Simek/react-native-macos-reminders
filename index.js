import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native-macos';

import AppWrapper from '~/AppWrapper';
import WindowHost from '~/WindowHost';

import { name as appName } from './app.json';

NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(false);

AppRegistry.registerComponent(appName, () => AppWrapper);
AppRegistry.registerComponent('WindowHost', () => WindowHost);

const emitter = new NativeEventEmitter(NativeModules.NativeAnimatedModule);

emitter.addListener('onAnimatedValueUpdate', () => {
  console.trace();
});
