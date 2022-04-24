import React from 'react';
import { StyleSheet, View } from 'react-native';

import Tag from './Tag';

const Tags = ({ selectedKey, setSelectedKey, onPress, allCount, flaggedCount }) => (
  <View style={styles.tags}>
    <Tag
      title="today"
      icon="􀧵"
      isActive={selectedKey === 'today'}
      onPress={() => {
        onPress();
        setSelectedKey('today');
      }}
    />
    <Tag
      title="scheduled"
      icon="􀉉"
      isActive={selectedKey === 'scheduled'}
      onPress={() => {
        onPress();
        setSelectedKey('scheduled');
      }}
    />
    <Tag
      title="all"
      icon="􀈤"
      isActive={selectedKey === 'all'}
      onPress={() => {
        onPress();
        setSelectedKey('all');
      }}
      count={allCount}
    />
    <Tag
      title="flagged"
      icon="􀋊"
      isActive={selectedKey === 'flagged'}
      onPress={() => {
        onPress();
        setSelectedKey('flagged');
      }}
      count={flaggedCount}
    />
  </View>
);

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 16,
    paddingHorizontal: 12,
  },
});

export default Tags;
