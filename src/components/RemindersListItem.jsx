import React, { useState } from 'react';
import { ActionSheetIOS, Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import RoundIcon from './RoundIcon';

const RemindersListItem = ({ item, count, onPress, onDelete, onEdit, onEditEnd, onRename }) => {
  const [focused, setFocused] = useState(false);
  return (
    <TouchableOpacity
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
      ]}
      activeOpacity={1}>
      <RoundIcon icon="􀋲" iconSize={13} color={item.color} style={styles.listItemIcon} />
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    marginHorizontal: 10,
  },
  listItemSelected: {
    backgroundColor: {
      semantic: 'selectedContentBackgroundColor',
    },
  },
  listItemIcon: {
    width: 24,
    height: 24,
    paddingLeft: 1,
    marginRight: 8,
  },
  listItemText: {
    flex: 1,
    flexGrow: 1,
    fontSize: 13,
    lineHeight: 24,
    marginRight: 12,
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
