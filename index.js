import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native-macos';

import { name as appName } from './app.json';
import ReminderListWindow from './src/components/ReminderListWindow';

import AppWrapper from '~/AppWrapper';

NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled(false);

AppRegistry.registerComponent(appName, () => AppWrapper);
AppRegistry.registerComponent('WindowHost', () => WindowHost);

function WindowHost({ target }) {
  if (target === 'ReminderListWindow') {
    return <ReminderListWindow />;
  }
  return null;
}

const emitter = new NativeEventEmitter(NativeModules.NativeAnimatedModule);

emitter.addListener('onAnimatedValueUpdate', () => {
  console.trace();
});
