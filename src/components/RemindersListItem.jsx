import React, { useState } from 'react';
import { ActionSheetIOS, Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';

import RoundIcon from './RoundIcon';

const RemindersListItem = ({
  item,
  count,
  onPress,
  onTextInputPress,
  onDelete,
  onEdit,
  onEditEnd,
  onRename,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      onPress={(e) => {
        if (e.nativeEvent.button === 2) {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Show Info', 'Rename', 'Delete'],
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                Alert.prompt(
                  `"${item.title}" Info`,
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
                onRename(e);
              } else if (buttonIndex === 2) {
                onDelete(e);
              }
            },
          );
        } else {
          onPress(e);
        }
      }}
      onPressIn={(e) => {
        if (e.nativeEvent.button === 2) {
          setFocused(true);
        }
      }}
      onPressOut={() => setFocused(false)}
      style={[
        styles.listItem,
        item.selected ? styles.listItemSelected : {},
        focused
          ? {
              borderColor: {
                semantic: item.selected ? 'labelColor' : 'selectedContentBackgroundColor',
              },
            }
          : {},
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
          blurOnSubmit
          onSubmitEditing={(e) => {
            onEditEnd(e.nativeEvent.text);
          }}
          onChangeText={onEdit}
          numberOfLines={1}
        />
      ) : (
        <Pressable
          onPress={(e) => (item.selected ? onTextInputPress(e) : onPress(e))}
          style={styles.listItemTextWrapper}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.listItemText,
              {
                color: item.selected ? '#fff' : { semantic: 'labelColor' },
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
            color: item.selected ? '#fff' : { semantic: 'secondaryLabelColor' },
          },
        ]}>
        {count || 0}
      </Text>
    </Pressable>
  );
};

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
    backgroundColor: {
      semantic: 'selectedContentBackgroundColor',
    },
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
    color: { semantic: 'labelColor' },
    backgroundColor: {
      semantic: 'controlBackgroundColor',
    },
  },
  listItemCounter: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 13,
    lineHeight: 23,
    opacity: 0.65,
  },
});

export default RemindersListItem;
