import { StyleSheet, View } from 'react-native-macos';

import Section from '~/components/Section';
import { useAppContext } from '~/context/AppContext.tsx';
import { useDataContext } from '~/context/DataContext.tsx';
import { getRemindersCounts } from '~/utils/helpers.ts';

type Props = {
  onPress: () => void;
};

function Sections({ onPress }: Props) {
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

export default Sections;
