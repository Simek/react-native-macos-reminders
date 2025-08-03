import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native-macos';

import Section from './Section';

type Props = {
  selectedKey: string;
  setSelectedKey: Dispatch<SetStateAction<string>>;
  onPress: () => void;
  allCount: number;
  flaggedCount: number;
  isSearchMode: boolean;
  setCompletedVisible: Dispatch<SetStateAction<boolean>>;
};

function Sections({
  selectedKey,
  setSelectedKey,
  onPress,
  allCount,
  flaggedCount,
  isSearchMode,
  setCompletedVisible,
}: Props) {
  return (
    <View style={styles.tags}>
      <Section
        title="today"
        icon="􀧵"
        iconSize={14.5}
        isActive={!isSearchMode && selectedKey === 'today'}
        onPress={() => {
          onPress();
          setSelectedKey('today');
        }}
      />
      <Section
        title="scheduled"
        icon="􀉉"
        iconSize={14.5}
        isActive={!isSearchMode && selectedKey === 'scheduled'}
        onPress={() => {
          onPress();
          setSelectedKey('scheduled');
        }}
      />
      <Section
        title="all"
        icon="􀈤"
        isActive={!isSearchMode && selectedKey === 'all'}
        onPress={() => {
          onPress();
          setSelectedKey('all');
        }}
        count={allCount}
      />
      <Section
        title="flagged"
        icon="􀋊"
        iconSize={12}
        isActive={!isSearchMode && selectedKey === 'flagged'}
        onPress={() => {
          onPress();
          setSelectedKey('flagged');
        }}
        count={flaggedCount}
      />
      <Section
        title="completed"
        icon="􀆅"
        iconSize={13}
        isActive={!isSearchMode && selectedKey === 'completed'}
        onPress={() => {
          onPress();
          setSelectedKey('completed');
          setCompletedVisible(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 12,
  },
});

export default Sections;
