import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import styles from '../styles';

const ReminderList = ({
  selectedKey,
  sections,
  renderItem,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
}) => (
  <SectionList
    contentContainerStyle={sections?.length ? {} : { flexGrow: 2 }}
    sections={sections}
    stickySectionHeadersEnabled
    contentOffset={{ y: 52 }}
    keyExtractor={(item) => item.key}
    renderItem={renderItem}
    renderSectionHeader={({ section: { title } }) =>
      selectedKey !== 'flagged' && title ? (
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

const componentStyles = StyleSheet.create({
  contentStickyHeaderWrapper: {
    backgroundColor: { semantic: 'controlBackgroundColor' },
  },
  allListHeader: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 12,
    color: { semantic: 'systemBlueColor' },
  },
});

export default ReminderList;
