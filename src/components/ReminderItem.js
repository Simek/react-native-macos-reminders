import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PopoverManager } from '@rn-macos/popover';

import Button from './Button';

const calcPopoverHeight = (item) =>
  item.textNote ? 102 + parseInt(item.textNote.length / 24 - 1, 10) * 16 : 102;

const RemindersListItem = ({
  item,
  color = { semantic: 'systemBlueColor' },
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
            borderColor: item.done ? color : '#8c8c8c70',
          },
        ]}
        onPress={onStatusChange}>
        {item.done ? (
          <View
            style={[
              styles.listItemCheckInner,
              {
                backgroundColor: color,
              },
            ]}
          />
        ) : null}
      </TouchableOpacity>
      <View style={styles.listItemContent}>
        <TextInput
          multiline={true}
          numberOfLines={1}
          scrollEnabled={false}
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
          onBlur={onEditEnd}
          onChangeText={(newValue) => {
            setText(newValue);
            if (onEdit && typeof onEdit === 'function') {
              onEdit(newValue);
            }
          }}
        />
        {isExpanded ? (
          <TextInput
            multiline={true}
            ref={noteInputRef}
            placeholder="Notes"
            value={textNote}
            scrollEnabled={false}
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
        {isExpanded && id && id === lastSelectedTarget ? (
          <View style={styles.listItemButtonsWrapper}>
            <Button
              disabled={true}
              onPress={() => null}
              icon="􀉉"
              text="Add Date"
              style={styles.listItemButton}
              iconStyle={styles.listItemButtonIcon}
            />
            <Button
              disabled={true}
              onPress={() => null}
              icon="􀋒"
              text="Add Location"
              style={styles.listItemButton}
              iconStyle={styles.listItemButtonIcon}
            />
            <Button
              onPress={() => null}
              icon="􀋉"
              style={styles.listItemButton}
              iconStyle={styles.listItemButtonIcon}
            />
          </View>
        ) : null}
      </View>
      {id && id === lastSelectedTarget ? (
        <TouchableOpacity
          style={styles.popoverIconWrapper}
          onPress={() => {
            setPopoverData(
              <View style={styles.popoverWrapper}>
                <View>
                  <Text style={styles.popoverTitle}>{item.text}</Text>
                  <Button
                    onPress={() => undefined}
                    text="􀋉"
                    textStyle={{ fontSize: 12 }}
                    style={styles.popoverFlagButton}
                  />
                </View>
                <Text style={styles.popoverSecondary}>{item.textNote || 'Notes'}</Text>
                <View style={styles.popoverSeparator} />
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.popoverSecondary, styles.popoverLabel]}>priority</Text>
                  <Text style={{ color: { semantic: 'labelColor' } }}>None</Text>
                </View>
              </View>,
            );
            setTimeout(() => {
              PopoverManager.show(
                280,
                calcPopoverHeight(item),
                layout.pageX + layout.width - 18,
                window.height - (layout.pageY + 9),
              );
            }, 50);
          }}>
          <Text style={[styles.popoverIcon, { color }]}>􀅴</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 42,
    paddingVertical: 6,
    marginLeft: 34,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8c8c8c50',
  },
  listItemCheck: {
    width: 18,
    height: 18,
    left: -32,
    top: 2,
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
    marginTop: -4,
    zIndex: 10,
  },
  listItemNoteInput: {
    fontSize: 12,
    marginTop: 2,
    color: { semantic: 'systemGrayColor' },
    backgroundColor: {
      semantic: 'controlBackgroundColor',
    },
    zIndex: 9,
  },
  listItemInputDone: {
    color: { semantic: 'secondaryLabelColor' },
  },
  listItemButtonsWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 2,
  },
  listItemButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: {
      semantic: 'gridColor',
    },
    marginRight: 6,
  },
  listItemButtonIcon: {
    fontSize: 10,
  },
  popoverIconWrapper: {
    position: 'absolute',
    right: 16,
  },
  popoverIcon: {
    fontSize: 17,
  },
  popoverWrapper: {
    width: 280,
    height: 102,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  popoverTitle: {
    color: {
      semantic: 'labelColor',
    },
    fontSize: 16,
    lineHeight: 28,
    fontWeight: '500',
    marginBottom: 4,
  },
  popoverSecondary: {
    color: {
      semantic: 'systemGrayColor',
    },
    fontSize: 13,
  },
  popoverSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: {
      semantic: 'tertiaryLabelColor',
    },
    marginVertical: 8,
  },
  popoverFlagButton: {
    position: 'absolute',
    height: 21,
    paddingHorizontal: 8,
    right: 0,
    top: 4,
  },
  popoverLabel: {
    fontSize: 12,
    minWidth: 64,
    textAlign: 'right',
    paddingRight: 8,
    lineHeight: 18,
  },
});

export default RemindersListItem;
