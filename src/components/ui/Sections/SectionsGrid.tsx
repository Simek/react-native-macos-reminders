import { StyleSheet, View } from 'react-native-macos';

import { useAppContext } from '~/context/AppContext';
import { useDataContext } from '~/context/DataContext';
import { getRemindersCounts } from '~/utils/helpers';

import { Section } from './Section';

type Props = {
  onPress: () => void;
};

export function SectionsGrid({ onPress }: Props) {
  const { isSearchMode, selectedKey, setSelectedKey } = useAppContext();
  const { data } = useDataContext();

  const { allCount, flaggedCount } = getRemindersCounts(data);

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
