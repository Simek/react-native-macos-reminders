import { TouchableWithoutFeedback, View } from 'react-native-macos';

import { useDataContext } from '~/context/DataContext.tsx';
import sharedStyles from '~/sharedStyles.ts';

type Props = {
  selectedKey: string;
};

export default function ReminderListFooter({ selectedKey }: Props) {
  const { addReminder } = useDataContext();
  return (
    <TouchableWithoutFeedback onPress={() => addReminder(selectedKey)}>
      <View style={sharedStyles.addReminderRow} />
    </TouchableWithoutFeedback>
  );
}
