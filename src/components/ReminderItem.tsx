// @ts-expect-error FIXME
import { PopoverManager } from '@rn-macos/popover';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  OpaqueColorValue,
  PlatformColor,
  TextInputProps,
  NativeMethods,
  Pressable,
} from 'react-native-macos';

import Button from './Button';
import ReminderItemPopover from './ReminderItemPopover';
import { MeasureOnSuccessParams, ReminderItemType } from '../types.ts';
import { COLORS } from '../utils/constants';

const FLAGGED_OFFSET = 24;

type Props = {
  item: ReminderItemType;
  color?: OpaqueColorValue;
  setPopoverData: Dispatch<SetStateAction<ReactNode>>;
  onStatusChange: (fieldName: keyof ReminderItemType) => void;
  onEdit: (value: string, fieldName?: string) => void;
  onEditEnd: TextInputProps['onBlur'];
  lastSelectedTarget: NativeMethods | null;
  setLastSelectedTarget: Dispatch<SetStateAction<NativeMethods | null>>;
};

function RemindersListItem({
  item,
  color = PlatformColor('systemBlue'),
  onEdit,
  onEditEnd,
  onStatusChange,
  setPopoverData,
  lastSelectedTarget,
  setLastSelectedTarget,
}: Props) {
  const [text, setText] = useState<string | undefined>(item.text);
  const [textNote, setTextNote] = useState<string | undefined>(item.textNote);
  const [layout, setLayout] = useState<MeasureOnSuccessParams | null>(null);
  const [id, setId] = useState<NativeMethods | null>(null);

  const rowRef = useRef<View>(null);
  const noteInputRef = useRef(null);
  const window = Dimensions.get('window');

  const hasNote = textNote ? textNote.length > 0 : false;
  const isExpanded = id && id === lastSelectedTarget;
  const isFlagVisible = item.flagged && !isExpanded;

  function updatePopoverData() {
    setPopoverData(<ReminderItemPopover item={item} onStatusChange={onStatusChange} />);
  }

  useEffect(() => updatePopoverData(), [item.flagged]);

  return (
    <Pressable
      onPress={(event) => {
        setId(event.target);
        setLastSelectedTarget(event.target);
      }}>
      <View
        ref={rowRef}
        style={[
          styles.listItem,
          {
            minHeight: isExpanded ? 48 : 28,
          },
        ]}
        onLayout={() => {
          rowRef?.current?.measure((x, y, width, height, pageX, pageY) => {
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
            autoFocus={item.text === ''}
            value={text}
            style={[
              styles.listInput,
              styles.listItemInput,
              item.done ? styles.listItemInputDone : {},
            ]}
            submitBehavior="blurAndSubmit"
            onFocus={(event) => {
              setId(event.target);
              setLastSelectedTarget(event.target);
            }}
            onBlur={onEditEnd}
            onChangeText={(newValue) => {
              setText(newValue);
              if (onEdit && typeof onEdit === 'function') {
                onEdit(newValue);
              }
            }}
            enableFocusRing={false}
          />
          {hasNote || isExpanded ? (
            <TextInput
              multiline
              ref={noteInputRef}
              placeholder="Notes"
              value={textNote}
              style={[
                styles.listInput,
                styles.listItemNoteInput,
                item.done ? styles.listItemInputDone : {},
              ]}
              submitBehavior="blurAndSubmit"
              onFocus={(event) => {
                setId(event.target);
                setLastSelectedTarget(event.target);
              }}
              onChangeText={(newValue) => {
                setTextNote(newValue);
                if (onEdit && typeof onEdit === 'function') {
                  onEdit(newValue, 'textNote');
                }
              }}
              enableFocusRing={false}
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
                  item.flagged ? { color: COLORS.flagged } : {},
                ]}
              />
            </View>
          ) : null}
        </View>
        {isFlagVisible ? (
          <Text style={[styles.flaggedIcon, { color: COLORS.flagged }]}>􀋊</Text>
        ) : null}
        {id && id === lastSelectedTarget ? (
          <TouchableOpacity
            style={[styles.popoverIconWrapper, { right: isFlagVisible ? 16 + FLAGGED_OFFSET : 16 }]}
            onPress={() => {
              updatePopoverData();
              if (layout) {
                setTimeout(() => {
                  PopoverManager.show(
                    layout.pageX + layout.width - 18 - (isFlagVisible ? FLAGGED_OFFSET : 0),
                    window.height - (layout.pageY + 9),
                  );
                }, 50);
              }
            }}>
            <Text style={[styles.popoverIcon, { color }]}>􀅴</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Pressable>
  );
}

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
    fontSize: 13,
    color: PlatformColor('label'),
    backgroundColor: PlatformColor('controlBackground'),
  },
  listItemInput: {
    minHeight: 18,
    marginTop: -4,
    marginBottom: -6,
    zIndex: 10,
  },
  listItemNoteInput: {
    marginVertical: 2,
    color: PlatformColor('systemGray'),
    backgroundColor: PlatformColor('controlBackground'),
    zIndex: 9,
  },
  listItemInputDone: {
    color: PlatformColor('secondaryLabel'),
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
    backgroundColor: PlatformColor('grid'),
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
