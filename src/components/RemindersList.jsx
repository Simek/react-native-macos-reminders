import React from 'react';
import { SectionList, StyleSheet, Text } from 'react-native';

import RemindersListItem from './RemindersListItem';

const RemindersList = ({
  data = [],
  getItemCount,
  itemOnPress,
  itemOnLongPress,
  itemOnEdit,
  itemOnRename,
  itemOnEditEnd,
}) => (
  <SectionList
    sections={[
      {
        title: 'My Lists',
        data,
      },
    ]}
    keyExtractor={(item, index) => item + index}
    renderItem={({ item }) => (
      <RemindersListItem
        item={item}
        count={getItemCount(item)}
        onPress={() => itemOnPress(item)}
        onLongPress={() => itemOnLongPress(item)}
        onRename={() => itemOnRename(item)}
        onEdit={(title) => itemOnEdit(item, title)}
        onEditEnd={() => itemOnEditEnd(item)}
      />
    )}
    renderSectionHeader={({ section: { title } }) =>
      title ? <Text style={styles.listHeader}>{title}</Text> : null
    }
  />
);

const styles = StyleSheet.create({
  listHeader: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 20,
    color: { semantic: 'secondaryLabelColor' },
    opacity: 0.65,
  },
});

export default RemindersList;
