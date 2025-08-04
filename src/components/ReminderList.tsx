import {
  SectionList,
  StyleSheet,
  Text,
  View,
  PlatformColor,
  SectionListProps,
} from 'react-native-macos';

import AccentButton from './AccentButton';

import { useAppContext } from '~/context/AppContext.tsx';
import { useDataContext } from '~/context/DataContext.tsx';
import clearMenu from '~/menus/ClearMenu.ts';
import sharedStyles from '~/sharedStyles.ts';
import { ReminderItemType } from '~/types.ts';
import { PREDEFINED_KEYS } from '~/utils/constants';
import { filterSearchHits, getListColor, getRemindersCounts } from '~/utils/helpers.ts';

type Props = SectionListProps<ReminderItemType>;

function ReminderList({ sections, renderItem, ListFooterComponent, ListEmptyComponent }: Props) {
  const { selectedKey, isSearchMode, completedVisible, setCompletedVisible, searchQuery } =
    useAppContext();
  const { data, removeAllRemindersByList } = useDataContext();

  function calculateCompletedForList() {
    if (isSearchMode || selectedKey === 'search') {
      return (
        [...Object.values(data)]
          .flat()
          .filter((entry) => entry.done)
          .filter((entry) => filterSearchHits(searchQuery, entry)).length || 0
      );
    }
    if (selectedKey === 'flagged') {
      return flaggedCompletedCount;
    }
    if (selectedKey === 'all' || selectedKey === 'completed') {
      return allCompletedCount;
    }
    return data[selectedKey].filter((entry: ReminderItemType) => entry.done).length;
  }

  const { allCompletedCount, flaggedCompletedCount } = getRemindersCounts(data);
  const completedCount = calculateCompletedForList();

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
          <View style={styles.contentStickyHeaderWrapper}>
            <Text style={[sharedStyles.contentHeader, styles.allListHeader]}>{title}</Text>
          </View>
        ) : null
      }
      ListHeaderComponent={() => {
        if (!isSearchMode && selectedKey === 'today') return null;

        if (!PREDEFINED_KEYS.includes(selectedKey)) {
          return <View style={styles.customListStubHeader} />;
        }

        const color = isSearchMode ? PlatformColor('systemGray') : getListColor(selectedKey);

        return (
          <View style={styles.completedHeader}>
            <View style={styles.completedTextWrapper}>
              <Text style={styles.completedText}>{completedCount} Completed</Text>
              {selectedKey !== 'scheduled' && selectedKey !== 'flagged' && (
                <>
                  <Text style={styles.completedText}> • </Text>
                  <AccentButton
                    onPress={() =>
                      clearMenu(completedCount, () => {
                        const keys = data[selectedKey]
                          .filter((entry: ReminderItemType) => entry.done)
                          .map((entry: ReminderItemType) => entry.key);
                        removeAllRemindersByList(selectedKey, keys);
                      })
                    }
                    color={color}
                    disabled={completedCount === 0}>
                    Clear
                  </AccentButton>
                </>
              )}
            </View>
            {selectedKey !== 'completed' && (
              <AccentButton
                onPress={() => setCompletedVisible((prevState) => !prevState)}
                color={color}>
                {completedVisible ? 'Hide' : 'Show'}
              </AccentButton>
            )}
          </View>
        );
      }}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  completedHeader: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8c8c8c50',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingRight: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  completedTextWrapper: {
    flexDirection: 'row',
  },
  completedText: {
    color: PlatformColor('systemGray'),
    fontSize: 13,
  },
  contentStickyHeaderWrapper: {
    backgroundColor: PlatformColor('controlBackgroundColor'),
  },
  allListHeader: {
    fontSize: 18,
    marginTop: -4,
    marginBottom: 4,
    color: PlatformColor('systemBlue'),
  },
  customListStubHeader: {
    marginBottom: 12,
  },
});

export default ReminderList;
