import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  AlertButton,
  PlatformColor,
  PressableProps,
} from 'react-native-macos';

import RoundIcon from './RoundIcon';
import { ReminderListItemType } from '../types.ts';

type Props = {
  item: ReminderListItemType;
  count: number;
  onPress: NonNullable<PressableProps['onPress']>;
  onTextInputPress: NonNullable<PressableProps['onPress']>;
  onDelete: NonNullable<PressableProps['onPress']>;
  onRename: NonNullable<PressableProps['onPress']>;
  onEdit: NonNullable<AlertButton['onPress']>;
  onEditEnd: NonNullable<AlertButton['onPress']>;
};

export default function RemindersListItem({
  item,
  count,
  onPress,
  onTextInputPress,
  onDelete,
  onEdit,
  onEditEnd,
  onRename,
}: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      onPress={(event) => {
        // @ts-expect-error FIXME
        if (event.nativeEvent.button === 2) {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Show Info', 'Rename', 'Delete'],
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                Alert.prompt(
                  `Name`,
                  undefined,
                  [
                    {
                      text: 'OK',
                      onPress: (text) => {
                        onEdit(text);
                        onEditEnd(text);
                      },
                    },
                    { text: 'Cancel' },
                  ],
                  undefined,
                  item.title,
                );
              } else if (buttonIndex === 1) {
                onRename(event);
              } else if (buttonIndex === 2) {
                onDelete(event);
              }
            },
          );
        } else {
          onPress(event);
        }
      }}
      onPressIn={(event) => {
        // @ts-expect-error FIXME
        if (event.nativeEvent.button === 2) {
          setFocused(true);
        }
      }}
      onPressOut={() => setFocused(false)}
      style={[
        styles.listItem,
        item.selected ? styles.listItemSelected : {},
        focused && {
          borderColor: PlatformColor(item.selected ? 'label' : 'selectedContentBackground'),
        },
      ]}>
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
          onSubmitEditing={(event) => {
            onEditEnd(event.nativeEvent.text);
          }}
          onChangeText={onEdit}
          numberOfLines={1}
        />
      ) : (
        <Pressable
          onPress={(event) => (item.selected ? onTextInputPress(event) : onPress(event))}
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
