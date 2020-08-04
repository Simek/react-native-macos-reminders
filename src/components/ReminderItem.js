import React, { useState } from 'react';
import type { Node } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const RemindersListItem: () => Node = ({
  item,
  color = 'systemBlueColor',
  onEdit,
  onEditEnd,
  onStatusChange,
}) => {
  const [text, setText] = useState(item.text);

  return (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={[
          styles.listItemCheck,
          {
            borderColor: item.done
              ? { semantic: color }
              : { semantic: 'systemGrayColor' },
          },
        ]}
        onPress={onStatusChange}>
        {item.done ? <View style={styles.listItemCheckInner} /> : null}
      </TouchableOpacity>
      <TextInput
        autoFocus={item.text === ''}
        value={text}
        style={[
          styles.listItemInput,
          item.done ? styles.listItemInputDone : {},
        ]}
        blurOnSubmit={true}
        onBlur={(e) => onEditEnd(e.nativeEvent.text)}
        onChangeText={(newValue) => {
          setText(newValue);
          if (onEdit && typeof onEdit === 'function') {
            onEdit(newValue);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 32,
    paddingVertical: 8,
    marginLeft: 32,
    minHeight: 28,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8c8c8c50',
  },
  listItemCheck: {
    width: 18,
    height: 18,
    left: -30,
    top: 1,
    position: 'absolute',
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemCheckInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: {
      semantic: 'systemBlueColor',
    },
  },
  listItemInput: {
    flex: 1,
    fontSize: 13,
    height: 16,
    marginTop: -6,
    color: { semantic: 'labelColor' },
    backgroundColor: {
      semantic: 'controlBackgroundColor',
    },
  },
  listItemInputDone: {
    color: { semantic: 'secondaryLabelColor' },
  },
});

export default RemindersListItem;
