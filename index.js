import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native-macos';

import AppWrapper from '~/AppWrapper';

import ReminderListWindow from '@ui/ReminderList/ReminderListWindow';

import { name as appName } from './app.json';

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
