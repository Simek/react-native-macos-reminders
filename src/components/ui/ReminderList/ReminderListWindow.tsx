import { ReminderListTitle } from '@ui/ReminderList/ReminderListTitle';
import { View } from 'react-native-macos';

import { AppProvider } from '~/context/AppContext';
import { DataProvider } from '~/context/DataContext';
import sharedStyles from '~/sharedStyles';

import { ReminderList } from './ReminderList';

export function ReminderListWindow() {
  return (
    <AppProvider>
      <DataProvider>
        <View style={sharedStyles.content}>
          <ReminderListTitle />
          <ReminderList />
        </View>
      </DataProvider>
    </AppProvider>
  );
}
