import { View } from 'react-native-macos';

import ReminderList from './ReminderList';

import ReminderListTitle from '~/components/ReminderListTitle.tsx';
import { AppProvider } from '~/context/AppContext.tsx';
import { DataProvider } from '~/context/DataContext.tsx';
import sharedStyles from '~/sharedStyles.ts';

export default function ReminderListWindow() {
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
