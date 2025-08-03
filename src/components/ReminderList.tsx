import React from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  PlatformColor,
  SectionListProps,
} from 'react-native-macos';

import styles from '../styles';
import { ReminderItemType } from '../types.ts';

type Props = SectionListProps<ReminderItemType> & {
  selectedKey: string;
};

function ReminderList({
  selectedKey,
  sections,
  renderItem,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
}: Props) {
  return (
    <SectionList
      contentContainerStyle={sections?.length ? {} : { flexGrow: 2 }}
      sections={sections}
      stickySectionHeadersEnabled
      contentOffset={{ y: 52, x: 0 }}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) =>
        selectedKey !== 'flagged' && selectedKey !== 'completed' && title ? (
          <View style={componentStyles.contentStickyHeaderWrapper}>
            <Text style={[styles.contentHeader, componentStyles.allListHeader]}>{title}</Text>
          </View>
        ) : null
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

const componentStyles = StyleSheet.create({
  contentStickyHeaderWrapper: {
    backgroundColor: PlatformColor('controlBackgroundColor'),
  },
  allListHeader: {
    fontSize: 18,
    marginTop: -4,
    marginBottom: 4,
    color: PlatformColor('systemBlue'),
  },
});

export default ReminderList;
