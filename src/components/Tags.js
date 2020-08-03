import React from 'react';
import type { Node } from 'react';
import { StyleSheet, View } from 'react-native';

import Tag from './Tag';

const Tags: () => Node = ({
  selectedKey,
  setSelectedKey,
  onPress,
  allCount,
}) => (
  <View style={styles.tags}>
    <Tag
      title="Today"
      icon="􀉉"
      isActive={selectedKey === 'today'}
      onPress={() => {
        onPress();
        setSelectedKey('today');
      }}
    />
    <Tag
      title="Scheduled"
      icon="􀐬"
      isActive={selectedKey === 'scheduled'}
      onPress={() => {
        onPress();
        setSelectedKey('scheduled');
      }}
    />
    <Tag
      title="All"
      icon="􀈤"
      isActive={selectedKey === 'all'}
      onPress={() => {
        onPress();
        setSelectedKey('all');
      }}
      count={allCount}
    />
    <Tag
      title="Flagged"
      icon="􀋊"
      isActive={selectedKey === 'flagged'}
      onPress={() => {
        onPress();
        setSelectedKey('flagged');
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 16,
  },
});

export default Tags;
