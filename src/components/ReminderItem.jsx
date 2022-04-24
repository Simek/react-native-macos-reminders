import { PopoverManager } from '@rn-macos/popover';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import CONSTANTS from '../utils/constants';
import Button from './Button';
import ReminderItemPopover from './ReminderItemPopover';

const FLAGGED_OFFSET = 24;

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

  const hasNote = textNote?.length > 0;
  const isExpanded = id && id === lastSelectedTarget;
  const isFlagVisible = item.flagged && !isExpanded;

  const updatePopoverData = () =>
    setPopoverData(<ReminderItemPopover item={item} onStatusChange={onStatusChange} />);

  useEffect(() => updatePopoverData(), [item.flagged]);

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
        onPress={() => onStatusChange('done')}>
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
          multiline
          numberOfLines={1}
          scrollEnabled={false}
          autoFocus={item.text === ''}
          value={text}
          style={[
            styles.listInput,
            styles.listItemInput,
            item.done ? styles.listItemInputDone : {},
          ]}
          blurOnSubmit
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
        {hasNote || isExpanded ? (
          <TextInput
            multiline
            ref={noteInputRef}
            placeholder="Notes"
            value={textNote}
            scrollEnabled={false}
            style={[
              styles.listInput,
              styles.listItemNoteInput,
              item.done ? styles.listItemInputDone : {},
            ]}
            blurOnSubmit
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
        {isExpanded ? (
          <View style={styles.listItemButtonsWrapper}>
            <Button
              disabled
              onPress={() => null}
              icon="􀉉"
              text="Add Date"
              style={styles.listItemButton}
              iconStyle={styles.listItemButtonIcon}
            />
            <Button
              disabled
              onPress={() => null}
              icon="􀋒"
              text="Add Location"
              style={styles.listItemButton}
              iconStyle={styles.listItemButtonIcon}
            />
            <Button
              onPress={() => null}
              icon="􀆃"
              style={styles.listItemButton}
              iconStyle={styles.listItemButtonBigIcon}
            />
            <Button
              onPress={() => onStatusChange('flagged')}
              icon={item.flagged ? '􀋊' : '􀋉'}
              style={styles.listItemButton}
              iconStyle={[
                styles.listItemButtonBigIcon,
                item.flagged ? { color: CONSTANTS.COLORS.flagged } : {},
              ]}
            />
          </View>
        ) : null}
      </View>
      {isFlagVisible ? (
        <Text style={[styles.flaggedIcon, { color: CONSTANTS.COLORS.flagged }]}>􀋊</Text>
      ) : null}
      {id && id === lastSelectedTarget ? (
        <TouchableOpacity
          style={[styles.popoverIconWrapper, { right: isFlagVisible ? 16 + FLAGGED_OFFSET : 16 }]}
          onPress={() => {
            updatePopoverData();
            setTimeout(() => {
              PopoverManager.show(
                layout.pageX + layout.width - 18 - (isFlagVisible ? FLAGGED_OFFSET : 0),
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
  listItemButtonBigIcon: {
    fontSize: 12,
  },
  flaggedIcon: {
    position: 'absolute',
    top: 3,
    right: 16,
    fontSize: 12,
  },
  popoverIconWrapper: {
    position: 'absolute',
    top: 2,
  },
  popoverIcon: {
    fontSize: 14,
  },
});

export default RemindersListItem;
