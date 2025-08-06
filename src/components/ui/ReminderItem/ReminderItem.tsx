import { format } from '@formkit/tempo';
// @ts-expect-error FIXME
import { PopoverManager } from '@rn-macos/popover';
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PlatformColor,
  TextInputProps,
  NativeMethods,
  Pressable,
} from 'react-native-macos';

import { useAppContext } from '~/context/AppContext';
import { MeasureOnSuccessParams, ReminderItemType } from '~/types';
import { COLORS } from '~/utils/constants';
import { getListColor } from '~/utils/helpers';

import { Button } from '@ui/Button';

import { ReminderItemPopover } from './ReminderItemPopover';

const FLAGGED_OFFSET = 24;

type Props = {
  item: ReminderItemType;
  sectionTitle?: string;
  setPopoverData: Dispatch<SetStateAction<ReactNode>>;
  onStatusChange: (fieldName: keyof ReminderItemType) => void;
  onEdit: (value: string, fieldName?: string) => void;
  onEditEnd: TextInputProps['onBlur'];
};

export function ReminderItem({
  item,
  sectionTitle,
  onEdit,
  onEditEnd,
  onStatusChange,
  setPopoverData,
}: Props) {
  const { isSearchMode, selectedKey, lastSelectedTarget, setLastSelectedTarget } = useAppContext();

  const [text, setText] = useState<string | undefined>(item.text);
  const [textNote, setTextNote] = useState<string | undefined>(item.textNote);
  const [layout, setLayout] = useState<MeasureOnSuccessParams | null>(null);
  const [id, setId] = useState<NativeMethods | null>(null);

  useEffect(() => updatePopoverData(), [item.flagged]);

  const rowRef = useRef<View>(null);
  const noteInputRef = useRef(null);
  const window = Dimensions.get('window');

  const hasNote = textNote ? textNote.length > 0 : false;
  const isExpanded = id && id === lastSelectedTarget;
  const isFlagVisible = item.flagged && !isExpanded;

  const shouldShowListName =
    (selectedKey === 'completed' || selectedKey === 'flagged') && !isSearchMode;
  const shouldShowCompletedTime = selectedKey === 'completed' && !isSearchMode;

  const color = getCurrentReminderColor();

  function getCurrentReminderColor() {
    if (selectedKey === 'all') {
      return PlatformColor('systemBlue');
    } else if (isSearchMode) {
      return PlatformColor('systemGray');
    }
    return getListColor(selectedKey);
  }

  function updatePopoverData() {
    setPopoverData(<ReminderItemPopover item={item} onStatusChange={onStatusChange} />);
  }

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
                styles.listItemSecondary,
                item.done ? styles.listItemInputDone : {},
                shouldShowListName ? styles.listItemInputWithListName : {},
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
          {!isExpanded && shouldShowListName && sectionTitle && (
            <View style={styles.listItemListName}>
              <Text
                style={[
                  styles.listInput,
                  styles.listItemSecondary,
                  item.done ? styles.listItemInputDone : {},
                ]}>
                {sectionTitle}
              </Text>
            </View>
          )}
          {shouldShowCompletedTime && item.completedAt && (
            <View style={styles.listItemListName}>
              <Text
                style={[
                  styles.listInput,
                  styles.listItemSecondary,
                  item.done ? styles.listItemInputDone : {},
                ]}>
                Completed: {format(new Date(item.completedAt), 'D/MM/YYYY HH:mm')}
              </Text>
            </View>
          )}
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
    width: 12,
    height: 12,
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
  listItemSecondary: {
    marginTop: 2,
    color: PlatformColor('systemGray'),
    backgroundColor: PlatformColor('controlBackground'),
    zIndex: 9,
  },
  listItemListName: {
    marginLeft: 1,
  },
  listItemInputWithListName: {
    marginBottom: -5,
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
    fontSize: 16,
  },
});
