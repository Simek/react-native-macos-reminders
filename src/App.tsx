// @ts-expect-error FIXME
import { Popover } from '@rn-macos/popover';
import { ReactNode, useEffect, useState } from 'react';
import { Dimensions, Text, TouchableWithoutFeedback, View } from 'react-native-macos';

import Button from '~/components/Button';
import ReminderItem from '~/components/ReminderItem';
import ReminderList from '~/components/ReminderList';
import RemindersList from '~/components/RemindersList';
import RemindersListFooter from '~/components/RemindersListFooter';
import { SearchInput } from '~/components/SearchInput';
import SearchResultsHeader from '~/components/SearchResultsHeader';
import Sections from '~/components/Sections';
import { useAppContext } from '~/context/AppContext.tsx';
import { useDataContext } from '~/context/DataContext.tsx';
import sharedStyles from '~/sharedStyles.ts';
import {
  ReminderItemSection,
  ReminderItemType,
  ReminderListItemType,
  RemindersType,
} from '~/types.ts';
import { PREDEFINED_KEYS } from '~/utils/constants';
import {
  filterSearchHits,
  getHeaderStyle,
  getListCount,
  getNewListEntry,
  getRemindersCounts,
  getSpecialListContent,
  getTitle,
  processRemindersList,
} from '~/utils/helpers';
import { findAndReplaceEntry } from '~/utils/storage';

function App() {
  const { searchQuery, selectedKey, setSelectedKey, isSearchMode } = useAppContext();
  const {
    data,
    setData,
    overwriteSelectedListData,
    listData,
    setListData,
    overwriteListData,
    removeAllRemindersByList,
  } = useDataContext();

  const [popoverData, setPopoverData] = useState<ReactNode>(null);
  const [windowSize, setWindowSize] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      if (window.width > 0) {
        setWindowSize(window);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const overwriteListItemsData = (
    overwriteFunc: (lists: ReminderListItemType[]) => ReminderListItemType[],
  ) => {
    setListData(overwriteFunc(listData));
  };

  function clearListTempData(
    content: Partial<ReminderListItemType> = { selected: false, editMode: false },
  ) {
    overwriteListData(() => content);
  }

  function addNewReminder() {
    const ts = Date.now();
    setData(
      Object.assign({}, data, {
        [selectedKey]: {
          ...data[selectedKey],
          reminders: [
            ...data[selectedKey].reminders,
            { text: '', key: `entry-${ts}`, createdAt: ts, completedAt: null, done: false },
          ],
        },
      }),
    );
  }

  function processListData(
    list: RemindersType[string],
    filterFn?: (list: ReminderItemType) => boolean,
  ) {
    return processRemindersList(
      filterFn ? list.reminders.filter(filterFn) : list.reminders,
      list.showCompleted ?? true,
    );
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
      if (data[selectedKey]?.reminders?.length > 0) {
        return [{ ...data[selectedKey], data: processListData(data[selectedKey]) }].filter(Boolean);
      }
      return [];
    }
  }

  const { allCompletedCount } = getRemindersCounts(data);
  const remindersSections = getRemindersSections();

  return (
    <View style={sharedStyles.container}>
      <Popover style={{ position: 'absolute' }}>{popoverData}</Popover>
      <View style={[sharedStyles.sourceList, windowSize.width <= 566 && { display: 'none' }]}>
        <SearchInput />
        <Sections onPress={clearListTempData} />
        <RemindersList
          data={listData}
          getItemCount={(item) => getListCount(data, item)}
          itemOnPress={(item) => {
            setSelectedKey(item.key);
            overwriteListData((listItem) => ({
              selected: listItem.key === item.key,
              editMode: false,
            }));
          }}
          itemOnTextInputPress={(item) => {
            overwriteListData((listItem) => ({
              editMode: listItem.key === item.key,
            }));
          }}
          itemOnDelete={(item) => {
            clearListTempData();
            if (listData.length) {
              const firstUserListKey = listData[0].key;
              setSelectedKey(firstUserListKey);
              overwriteListData((listItem) => ({
                selected: listItem.key === firstUserListKey,
              }));
            } else {
              setSelectedKey('all');
            }
            overwriteListItemsData((list) => list.filter((listItem) => listItem.key !== item.key));
            removeAllRemindersByList(item.key);
          }}
          itemOnRename={(item) => {
            overwriteListData((listItem) =>
              listItem.key === item.key ? { editMode: true, selected: true } : {},
            );
          }}
          itemOnEdit={(item, title) => {
            overwriteListData((listItem) => (listItem.key === item.key ? { title } : {}));
          }}
          itemOnEditEnd={() => {
            overwriteListItemsData((list) =>
              list.map((listItem) => Object.assign({}, listItem, { editMode: false })),
            );
          }}
        />
        <RemindersListFooter
          onPress={() => {
            const entry = getNewListEntry();
            overwriteListItemsData((list) => [
              ...list.map((listItem) =>
                Object.assign({}, listItem, { selected: false, editMode: false }),
              ),
              entry,
            ]);
            setSelectedKey(entry.key);
            setData(
              Object.assign({}, data, { [entry.key]: { showCompleted: true, reminders: [] } }),
            );
          }}
        />
      </View>
      <View style={sharedStyles.content}>
        {isSearchMode ? (
          <SearchResultsHeader searchQuery={searchQuery} />
        ) : (
          <>
            {selectedKey !== 'completed' && (
              <Button icon="􀅼" onPress={addNewReminder} style={sharedStyles.addItemButton} />
            )}
            <View style={sharedStyles.contentHeaderWrapper}>
              <Text style={getHeaderStyle(selectedKey)} numberOfLines={1} ellipsizeMode="tail">
                {selectedKey.startsWith('list-')
                  ? listData.find((item) => item.key === selectedKey)?.title
                  : selectedKey}
              </Text>
              {!PREDEFINED_KEYS.includes(selectedKey) || selectedKey === 'completed' ? (
                <Text style={getHeaderStyle(selectedKey, sharedStyles.contentHeaderCounter)}>
                  {selectedKey === 'completed'
                    ? allCompletedCount
                    : getListCount(data, { key: selectedKey })}
                </Text>
              ) : null}
            </View>
          </>
        )}
        <ReminderList
          sections={remindersSections}
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
          ListFooterComponent={
            !isSearchMode && !PREDEFINED_KEYS.includes(selectedKey) ? (
              <TouchableWithoutFeedback onPress={addNewReminder}>
                <View style={sharedStyles.addReminderRow} />
              </TouchableWithoutFeedback>
            ) : null
          }
          ListEmptyComponent={
            !isSearchMode ? (
              <View style={sharedStyles.noContentWrapper}>
                <Text style={sharedStyles.noContentText}>
                  {data[selectedKey]?.showCompleted || remindersSections?.length === 0
                    ? 'No Reminders'
                    : 'All Reminders Completed'}
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}

export default App;
