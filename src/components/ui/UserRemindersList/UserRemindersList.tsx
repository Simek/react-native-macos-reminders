import { useCallback } from 'react';
import { PlatformColor, SectionList, StyleSheet, Text } from 'react-native-macos';

import { ReminderListItemType } from '~/types';

import { UserRemindersListItem } from './UserRemindersListItem';

type Props = {
  data: ReminderListItemType[];
  getItemCount: (item: ReminderListItemType) => number;
  itemOnPress: (item: ReminderListItemType) => void;
  itemOnTextInputPress: (item: ReminderListItemType) => void;
  itemOnDelete: (item: ReminderListItemType) => void;
  itemOnRename: (item: ReminderListItemType) => void;
  itemOnEdit: (item: ReminderListItemType, value?: string) => void;
  itemOnEditEnd: (item: ReminderListItemType) => void;
};

export function UserRemindersList({
  data = [],
  getItemCount,
  itemOnPress,
  itemOnTextInputPress,
  itemOnDelete,
  itemOnEdit,
  itemOnRename,
  itemOnEditEnd,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: ReminderListItemType }) => (
      <UserRemindersListItem
        item={item}
        count={getItemCount(item)}
        onPress={itemOnPress}
        onTextInputPress={itemOnTextInputPress}
        onDelete={itemOnDelete}
        onRename={itemOnRename}
        onEdit={itemOnEdit}
        onEditEnd={itemOnEditEnd}
      />
    ),
    [getItemCount, itemOnPress, itemOnTextInputPress, itemOnDelete, itemOnRename, itemOnEdit, itemOnEditEnd]
  );

  return (
    <SectionList
      sections={[
        {
          title: 'My Lists',
          data,
        },
      ]}
      keyExtractor={(item, index) => item.key + index}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (title ? <Text style={styles.listHeader}>{title}</Text> : null)}
    />
  );
}

const styles = StyleSheet.create({
  listHeader: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 22,
    color: PlatformColor('secondaryLabel'),
    opacity: 0.65,
  },
});
