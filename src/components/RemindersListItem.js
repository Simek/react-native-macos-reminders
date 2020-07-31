import React from 'react';
import type { Node } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import RoundIcon from './RoundIcon';

const RemindersListItem: () => Node = ({
  item,
  onPress,
  onLongPress,
  onEdit,
  onEditEnd,
}) => (
  <TouchableOpacity
    onPress={onPress}
    onLongPress={onLongPress}
    style={[styles.listItem, item.selected ? styles.listItemSelected : {}]}>
    <RoundIcon icon="☰" color={item.color} style={styles.listItemIcon} />
    {item.editMode ? (
      <TextInput
        autoFocus={true}
        value={item.title}
        style={styles.listItemInput}
        blurOnSubmit={true}
        onBlur={onEditEnd}
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
      {item.count || 0}
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
