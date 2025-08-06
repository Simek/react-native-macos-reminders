import { TouchableWithoutFeedback, View } from 'react-native-macos';

import { useDataContext } from '~/context/DataContext';
import sharedStyles from '~/sharedStyles';

type Props = {
  selectedKey: string;
};

export function ReminderListFooter({ selectedKey }: Props) {
  const { addReminder } = useDataContext();
  return (
    <TouchableWithoutFeedback onPress={() => addReminder(selectedKey)}>
      <View style={sharedStyles.addReminderRow} />
    </TouchableWithoutFeedback>
  );
}
