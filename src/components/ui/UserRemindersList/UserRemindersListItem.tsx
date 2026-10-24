import {
  ActionSheetIOS,
  Alert,
  NativeModules,
  PlatformColor,
  type PointerEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native-macos';

import { useAppContext } from '~/context/AppContext';
import { ReminderListItemType } from '~/types';

import { RoundIcon } from '@ui/RoundIcon';

type Props = {
  item: ReminderListItemType;
  count: number;
  onPress: (item: ReminderListItemType) => void;
  onTextInputPress: (item: ReminderListItemType) => void;
  onDelete: (item: ReminderListItemType) => void;
  onRename: (item: ReminderListItemType) => void;
  onEdit: (item: ReminderListItemType, value?: string) => void;
  onEditEnd: (item: ReminderListItemType) => void;
};

export function UserRemindersListItem({
  item,
  count,
  onPress,
  onTextInputPress,
  onDelete,
  onEdit,
  onEditEnd,
  onRename,
}: Props) {
  const { setSearchMode, setPreviousSelectedKey } = useAppContext();

  function showActions() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Open list in new window', 'Show Info', 'Rename', 'Delete'],
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // FIXME: data synchronization, resize listener
          NativeModules.NewWindowModule.openWindow('WindowHost', {
            target: 'ReminderListWindow',
          });
        } else if (buttonIndex === 1) {
          Alert.prompt(
            'Name',
            undefined,
            [
              {
                text: 'OK',
                onPress: (text?: string) => {
                  onEdit(item, text);
                  onEditEnd(item);
                },
              },
              { text: 'Cancel' },
            ],
            undefined,
            item.title
          );
        } else if (buttonIndex === 2) {
          onRename(item);
        } else if (buttonIndex === 3) {
          onDelete(item);
        }
      }
    );
  }

  return (
    <Pressable
      onPress={() => {
        setPreviousSelectedKey(item.key);
        setSearchMode(false);
        onPress(item);
      }}
      // @ts-expect-error onAuxClick is forwarded to View by Pressable at runtime
      onAuxClick={(event: PointerEvent) => {
        if (event.nativeEvent.button !== 2) {
          return;
        }
        setPreviousSelectedKey(item.key);
        setSearchMode(false);
        showActions();
      }}
      style={[styles.listItem, item.selected ? styles.listItemSelected : {}]}>
      <RoundIcon
        icon="􀋲"
        iconSize={12}
        color={item.color}
        style={styles.listItemIconBox}
        iconStyle={styles.listItemIcon}
      />
      {item.editMode ? (
        <TextInput
          autoFocus
          value={item.title}
          style={styles.listItemInput}
          submitBehavior="blurAndSubmit"
          onSubmitEditing={() => onEditEnd(item)}
          onChangeText={value => onEdit(item, value)}
          numberOfLines={1}
        />
      ) : (
        <Pressable
          onPress={() => (item.selected ? onTextInputPress(item) : onPress(item))}
          style={styles.listItemTextWrapper}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.listItemText,
              {
                color: item.selected ? '#fff' : PlatformColor('label'),
              },
            ]}>
            {item.title}
          </Text>
        </Pressable>
      )}
      <Text
        style={[
          styles.listItemCounter,
          {
            color: item.selected ? '#ffffffaa' : PlatformColor('secondaryLabel'),
          },
        ]}>
        {count || 0}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingLeft: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    marginHorizontal: 10,
    minHeight: 36,
  },
  listItemSelected: {
    backgroundColor: PlatformColor('selectedContentBackground'),
  },
  listItemIcon: {
    width: 14,
    height: 14,
  },
  listItemIconBox: {
    marginRight: 10,
  },
  listItemTextWrapper: {
    flex: 1,
    flexGrow: 1,
    marginRight: 12,
  },
  listItemText: {
    fontSize: 13,
    lineHeight: 24,
  },
  listItemInput: {
    flex: 1,
    marginRight: 12,
    marginLeft: -2,
    marginTop: 4,
    fontSize: 13,
    height: 16,
    color: PlatformColor('label'),
    backgroundColor: PlatformColor('controlBackground'),
  },
  listItemCounter: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 13,
    lineHeight: 23,
    opacity: 0.65,
  },
});
