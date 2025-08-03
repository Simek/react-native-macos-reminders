import { ActionSheetIOS, Alert } from 'react-native-macos';

function clearMenu(completedCount: number, onDelete: () => void) {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['All Completed'],
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        Alert.alert(
          'Clear completed reminders?',
          `${completedCount} completed reminder${
            completedCount > 1 ? 's' : ''
          } will be deleted from this list. This cannot be undone.`,
          [
            {
              text: 'Delete',
              onPress: onDelete,
            },
            { text: 'Cancel' },
          ],
        );
      }
    },
  );
}

export default clearMenu;
