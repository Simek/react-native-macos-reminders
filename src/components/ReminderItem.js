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
  lastSelectedTarget,
  setLastSelectedTarget,
}) => {
  const [text, setText] = useState(item.text);
  const [textNote, setTextNote] = useState(item.textNote);
  const [layout, setLayout] = useState(null);
  const [id, setId] = useState(null);

  const rowRef = useRef(null);
  const noteInputRef = useRef(null);
  const window = Dimensions.get('window');

  const isExpanded = item.textNote || (id && id === lastSelectedTarget);

  return (
    <View
      ref={rowRef}
      style={[
        styles.listItem,
        {
          minHeight: isExpanded ? 48 : 28,
        },
      ]}
      onPress={(e) => {
        setId(e.target);
        setLastSelectedTarget(e.target);
      }}
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
      <View style={styles.listItemContent}>
        <TextInput
          autoFocus={item.text === ''}
          value={text}
          style={[
            styles.listInput,
            styles.listItemInput,
            item.done ? styles.listItemInputDone : {},
          ]}
          blurOnSubmit={true}
          onFocus={(e) => {
            setId(e.target);
            setLastSelectedTarget(e.target);
          }}
          onSubmitEditing={(e) => onEditEnd(e.nativeEvent.text)}
          onChangeText={(newValue) => {
            setText(newValue);
            if (onEdit && typeof onEdit === 'function') {
              onEdit(newValue);
            }
          }}
        />
        {isExpanded ? (
          <TextInput
            ref={noteInputRef}
            placeholder="Notes"
            value={textNote}
            style={[
              styles.listInput,
              styles.listItemNoteInput,
              item.done ? styles.listItemInputDone : {},
            ]}
            blurOnSubmit={true}
            onFocus={(e) => {
              setId(e.target);
              setLastSelectedTarget(e.target);
            }}
            onChangeText={(newValue) => {
              setTextNote(newValue);
              if (onEdit && typeof onEdit === 'function') {
                onEdit(newValue, 'textNote');
              }
            }}
          />
        ) : null}
      </View>
      {id && id === lastSelectedTarget ? (
        <TouchableOpacity
          style={styles.popoverIconWrapper}
          onPress={() => {
            setPopoverData(
              <View style={{ paddingHorizontal: 10, paddingVertical: 12 }}>
                <Text style={styles.popoverTitle}>{item.text}</Text>
                <Text style={styles.popoverSecondary}>
                  {item.textNote || 'Notes'}
                </Text>
              </View>,
            );
            setTimeout(() => {
              PopoverManager.show(
                180,
                62,
                layout.pageX + layout.width - 6,
                window.height - (layout.pageY + 8),
              );
            }, 100);
          }}>
          <Text style={styles.popoverIcon}>􀅴</Text>
        </TouchableOpacity>
      ) : null}
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
  listItemContent: {
    flex: 1,
    flexDirection: 'column',
  },
  listInput: {
    flex: 1,
    color: { semantic: 'labelColor' },
    backgroundColor: {
      semantic: 'controlBackgroundColor',
    },
  },
  listItemInput: {
    fontSize: 13,
    minHeight: 16,
    maxHeight: 16,
    marginTop: -6,
  },
  listItemNoteInput: {
    fontSize: 12,
    minHeight: 15,
    maxHeight: 15,
    marginTop: 4,
    color: { semantic: 'secondaryLabelColor' },
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
