import React from 'react';
import type { Node } from 'react';
import {
  ActionSheetIOS,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import RoundIcon from './RoundIcon';

const RemindersListItem: () => Node = ({
  item,
  count,
  onPress,
  onLongPress,
  onEdit,
  onEditEnd,
  onRename,
}) => (
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
              onLongPress(e);
            }
          },
        );
      } else {
        onPress(e);
      }
    }}
    onLongPress={onLongPress}
    style={[styles.listItem, item.selected ? styles.listItemSelected : {}]}
    activeOpacity={0.66}>
    <RoundIcon icon="􀋲" color={item.color} style={styles.listItemIcon} />
    {item.editMode ? (
      <TextInput
        autoFocus={true}
        value={item.title}
        style={styles.listItemInput}
        blurOnSubmit={true}
        onBlur={(e) => onEditEnd(e.nativeEvent.text)}
        onChangeText={onEdit}
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
      style={{
        color: item.selected ? '#fff' : { semantic: 'secondaryLabelColor' },
      }}>
      {count || 0}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItemSelected: {
    backgroundColor: {
      semantic: 'selectedContentBackgroundColor',
    },
  },
  listItemIcon: {
    width: 20,
    height: 20,
    padding: 2,
    marginRight: 8,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 13,
    lineHeight: 20,
    flexGrow: 99,
  },
  listItemInput: {
    flex: 1,
    marginRight: 12,
    fontSize: 13,
    height: 16,
    marginTop: 2,
    color: { semantic: 'labelColor' },
    backgroundColor: {
      semantic: 'controlBackgroundColor',
    },
  },
});

export default RemindersListItem;
