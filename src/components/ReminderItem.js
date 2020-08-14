import React, { useRef, useState } from 'react';
import type { Node } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PopoverManager } from '@rn-macos/popover';

const RemindersListItem: () => Node = ({
  item,
  color = 'systemBlueColor',
  onEdit,
  onEditEnd,
  onStatusChange,
  setPopoverData,
}) => {
  const [text, setText] = useState(item.text);
  const [layout, setLayout] = useState(null);
  const rowRef = useRef(null);
  const window = Dimensions.get('window');

  return (
    <View
      ref={rowRef}
      style={styles.listItem}
      onLayout={() => {
        rowRef.current.measure((x, y, width, height, pageX, pageY) => {
          setLayout({ x, y, width, height, pageX, pageY });
        });
      }}>
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
      <TouchableOpacity
        style={styles.popoverIconWrapper}
        onPress={() => {
          setPopoverData(
            <View style={{ paddingHorizontal: 10, paddingVertical: 12 }}>
              <Text style={styles.popoverTitle}>{item.text}</Text>
              <Text style={styles.popoverSecondary}>Notes</Text>
            </View>,
          );
          setTimeout(() => {
            PopoverManager.show(
              150,
              62,
              layout.pageX + layout.width - 6,
              window.height - (layout.height / 2 - 4.5 + layout.pageY),
            );
          }, 100);
        }}>
        <Text style={styles.popoverIcon}>􀅴</Text>
      </TouchableOpacity>
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
  popoverIconWrapper: {
    position: 'absolute',
    right: 4,
  },
  popoverIcon: {
    color: {
      semantic: 'systemBlueColor',
    },
    fontSize: 16,
  },
  popoverTitle: {
    color: {
      semantic: 'labelColor',
    },
    fontSize: 15,
    lineHeight: 28,
    fontWeight: '500',
  },
  popoverSecondary: {
    color: {
      semantic: 'secondaryLabelColor',
    },
    fontSize: 13,
  },
});

export default RemindersListItem;
