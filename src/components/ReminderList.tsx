// @ts-expect-error
import { Popover } from '@rn-macos/popover';
import { ReactNode, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View, PlatformColor } from 'react-native-macos';

import AccentButton from './AccentButton';

import ReminderItem from '~/components/ReminderItem.tsx';
import ReminderListFooter from '~/components/ReminderListFooter.tsx';
import { useAppContext } from '~/context/AppContext.tsx';
import { useDataContext } from '~/context/DataContext.tsx';
import clearMenu from '~/menus/ClearMenu.ts';
import sharedStyles from '~/sharedStyles.ts';
import { ReminderItemSection, ReminderItemType, RemindersType } from '~/types.ts';
import { PREDEFINED_KEYS } from '~/utils/constants.ts';
import {
  filterSearchHits,
  getListColor,
  getRemindersCounts,
  getSpecialListContent,
  getTitle,
  processRemindersList,
} from '~/utils/helpers.ts';
import { findAndReplaceEntry } from '~/utils/storage.ts';

export default function ReminderList() {
  const [popoverData, setPopoverData] = useState<ReactNode>(null);

  const { selectedKey, isSearchMode, searchQuery } = useAppContext();
  const { data, setData, listData, removeAllRemindersByList, overwriteSelectedListData } =
    useDataContext();

  const sections = useMemo(() => {
    return getRemindersSections();
  }, [selectedKey, data]);

  function processListData(
    list: RemindersType[string],
    filterFn?: (list: ReminderItemType) => boolean,
  ) {
    return processRemindersList(
      filterFn ? list.reminders.filter(filterFn) : list.reminders,
      list.showCompleted ?? true,
    );
  }

  function calculateCompletedForList() {
    if (isSearchMode || selectedKey === 'search') {
      return (
        [...Object.values(data).flatMap((list) => list.reminders)]
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
    return data[selectedKey].reminders.filter((entry: ReminderItemType) => entry.done).length;
  }

  function multiListMapper(
    key: string,
    itemFilter?: (item: ReminderItemType) => boolean,
  ): ReminderItemSection {
    const title = getTitle(listData, key);

    if (!title) {
      return {
        key,
        data: processListData(data[key]),
      };
    }

    return {
      key,
      title,
      data: itemFilter ? processListData(data[key], itemFilter) : processListData(data[key]),
    };
  }

  function getRemindersSections(): ReminderItemSection[] {
    if (isSearchMode) {
      return getSpecialListContent(
        data,
        (key) =>
          multiListMapper(
            key,
            (entry) =>
              filterSearchHits(searchQuery, entry) &&
              (data[selectedKey].showCompleted ? true : !entry.done),
          ),
        (section) => (section.data ? section.data.length > 0 : false),
      );
    } else if (selectedKey === 'all') {
      return getSpecialListContent(data, (key) =>
        multiListMapper(key, (entry) => (data[selectedKey].showCompleted ? true : !entry.done)),
      );
    } else if (selectedKey === 'completed') {
      return getSpecialListContent(
        data,
        (key) => multiListMapper(key, (entry) => entry.done),
        (section) => (section.data ? section.data.filter((entry) => entry.done).length > 0 : false),
      );
    } else if (selectedKey === 'flagged') {
      return getSpecialListContent(
        data,
        (key) =>
          multiListMapper(
            key,
            (entry) => entry.flagged && (data[selectedKey].showCompleted ? true : !entry.done),
          ),
        (section) =>
          section.data ? section.data.filter((entry) => entry.flagged).length > 0 : false,
      );
    } else {
      if (data[selectedKey].reminders?.length > 0) {
        return [{ ...data[selectedKey], data: processListData(data[selectedKey]) }].filter(Boolean);
      }
      return [];
    }
  }

  const { allCompletedCount, flaggedCompletedCount } = getRemindersCounts(data);

  const completedCount = calculateCompletedForList();

  const shouldShowClearAction =
    (selectedKey !== 'scheduled' && selectedKey !== 'flagged') ||
    (isSearchMode && sections.length > 0);

  return (
    <>
      <Popover style={{ position: 'absolute' }}>{popoverData}</Popover>
      <SectionList
        contentContainerStyle={sections?.length ? {} : { flexGrow: 2 }}
        sections={sections}
        keyExtractor={(item) => item.key}
        renderSectionHeader={({ section: { title } }) =>
          selectedKey !== 'flagged' && selectedKey !== 'completed' && title ? (
            <View style={styles.contentStickyHeaderWrapper}>
              <Text style={[sharedStyles.contentHeader, styles.allListHeader]}>{title}</Text>
            </View>
          ) : null
        }
        renderItem={({ item, section }) => {
          const dataKey = section.key || selectedKey;
          return (
            <ReminderItem
              setPopoverData={setPopoverData}
              item={item}
              sectionTitle={section.title}
              onEdit={(text, fieldName = 'text') => {
                overwriteSelectedListData(dataKey, (list) =>
                  findAndReplaceEntry(list, item.key, () => ({ [fieldName]: text })),
                );
              }}
              onEditEnd={(event) => {
                if (!event.nativeEvent.text) {
                  overwriteSelectedListData(dataKey, (list) =>
                    list.filter((entry) => entry.key !== item.key),
                  );
                }
              }}
              onStatusChange={(fieldName: keyof ReminderItemType) => {
                overwriteSelectedListData(dataKey, (list) =>
                  findAndReplaceEntry(list, item.key, (entry) => {
                    if (fieldName === 'done') {
                      return {
                        [fieldName]: !entry[fieldName],
                        completedAt: !entry[fieldName] ? Date.now() : null,
                      };
                    }
                    return {
                      [fieldName]: !entry[fieldName],
                    };
                  }),
                );
              }}
            />
          );
        }}
        ListHeaderComponent={() => {
          if (!isSearchMode && selectedKey === 'today') return null;

          const color = isSearchMode ? PlatformColor('systemGray') : getListColor(selectedKey);

          return (
            <View style={styles.completedHeader}>
              <View style={styles.completedTextWrapper}>
                <Text style={styles.completedText}>{completedCount} Completed</Text>
                {shouldShowClearAction && (
                  <>
                    <Text style={styles.completedText}> • </Text>
                    <AccentButton
                      onPress={() =>
                        clearMenu(completedCount, () => {
                          const keys = data[selectedKey].reminders
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
                  onPress={() =>
                    setData({
                      ...data,
                      [selectedKey]: {
                        ...data[selectedKey],
                        showCompleted: !data[selectedKey].showCompleted,
                      },
                    })
                  }
                  color={color}>
                  {data[selectedKey].showCompleted ? 'Hide' : 'Show'}
                </AccentButton>
              )}
            </View>
          );
        }}
        ListFooterComponent={
          !isSearchMode && !PREDEFINED_KEYS.includes(selectedKey) ? (
            <ReminderListFooter selectedKey={selectedKey} />
          ) : null
        }
        ListEmptyComponent={
          !isSearchMode ? (
            <View style={styles.noContentWrapper}>
              <Text style={styles.noContentText}>
                {data[selectedKey]?.showCompleted || sections?.length === 0
                  ? 'No Reminders'
                  : 'All Reminders Completed'}
              </Text>
            </View>
          ) : null
        }
      />
    </>
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
  noContentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  noContentText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'SF Pro Rounded',
    color: PlatformColor('secondaryLabel'),
  },
});
