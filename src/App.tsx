// @ts-expect-error FIXME
import { Popover } from '@rn-macos/popover';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  NativeMethods,
  PlatformColor,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native-macos';

import AccentButton from './components/AccentButton';
import Button from './components/Button';
import ReminderItem from './components/ReminderItem';
import ReminderList from './components/ReminderList';
import RemindersList from './components/RemindersList';
import RemindersListFooter from './components/RemindersListFooter';
import { SearchInput } from './components/SearchInput';
import SearchResultsHeader from './components/SearchResultsHeader';
import Sections from './components/Sections';
import clearMenu from './menus/ClearMenu';
import styles from './styles';
import {
  ReminderItemSection,
  ReminderItemType,
  ReminderListItemType,
  RemindersType,
} from './types.ts';
import { INIT_STORE, PREDEFINED_KEYS } from './utils/constants';
import {
  filterSearchHits,
  getHeaderStyle,
  getListColor,
  getListCount,
  getNewListEntry,
  getSpecialListContent,
  getTitle,
  getTotalCount,
  processRemindersList,
} from './utils/helpers';
import {
  getStoredData,
  storeData,
  overwriteListData,
  overwriteSelectedListData,
  findAndReplaceEntry,
} from './utils/storage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(PREDEFINED_KEYS[0]);
  const [data, setData] = useState<RemindersType>(INIT_STORE);
  const [listData, setListData] = useState<ReminderListItemType[]>([]);
  const [popoverData, setPopoverData] = useState<ReactNode>(null);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<NativeMethods | null>(null);
  const [completedVisible, setCompletedVisible] = useState<boolean>(true);
  const [isSearchMode, setSearchMode] = useState<boolean>(false);

  useEffect(() => {
    readListDataFromStorage();
    readDataFromStorage();
  }, []);

  function readListDataFromStorage() {
    const item = getStoredData<ReminderListItemType[]>('remindersLists', listData);
    setListData(item);
  }

  function writeListDataToStorage(value: ReminderListItemType[]) {
    storeData<ReminderListItemType[]>(
      'remindersLists',
      value.map((item) => Object.assign({}, item, { selected: false, editMode: false })),
    );
  }

  function readDataFromStorage() {
    const item = getStoredData('remindersData', data);
    setData(item);
  }

  function writeDataToStorage(value: Record<string, ReminderItemType[]>) {
    storeData('remindersData', value);
  }

  const overwriteListItemsDataAndStore = (
    overwriteFunc: (lists: ReminderListItemType[]) => ReminderListItemType[],
  ) => {
    setListData((prevState) => {
      const finalData = overwriteFunc(prevState);
      writeListDataToStorage(finalData);
      return finalData;
    });
  };

  function clearListTempData(
    content: Partial<ReminderListItemType> = { selected: false, editMode: false },
  ) {
    overwriteListData(setListData, () => content);
  }

  function addNewReminder() {
    const ts = Date.now();
    setData((prevData) =>
      Object.assign({}, prevData, {
        [selectedKey]: [
          ...prevData[selectedKey],
          { text: '', key: `entry-${ts}`, createdAt: ts, done: false },
        ],
      }),
    );
  }

  function removeAllRemindersByList(listKey: string, keys: string[] = []) {
    setData((prevState) => {
      if (keys.length) {
        prevState[listKey] = prevState[listKey].filter(
          (entry: ReminderItemType) => !keys.includes(entry.key),
        );
      } else {
        delete prevState[listKey];
      }
      const finalData = Object.assign({}, prevState);
      writeDataToStorage(finalData);
      return finalData;
    });
  }

  function processListData(list: ReminderItemType[]) {
    return processRemindersList(list, completedVisible);
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
      data: itemFilter ? processListData(data[key].filter(itemFilter)) : processListData(data[key]),
    };
  }

  function getRemindersSections(): ReminderItemSection[] {
    if (isSearchMode || !selectedKey) {
      return getSpecialListContent(
        data,
        (key) => multiListMapper(key, (entry) => filterSearchHits(searchQuery, entry)),
        (section) => (section.data ? section.data.length > 0 : false),
      );
    } else if (selectedKey === 'all') {
      return getSpecialListContent(data, (key) => multiListMapper(key));
    } else if (selectedKey === 'completed') {
      return getSpecialListContent(
        data,
        (key) => multiListMapper(key, (entry) => entry.done),
        (section) => (section.data ? section.data.filter((entry) => entry.done).length > 0 : false),
      );
    } else if (selectedKey === 'flagged') {
      return getSpecialListContent(
        data,
        (key) => multiListMapper(key, (entry) => entry.flagged),
        (section) =>
          section.data ? section.data.filter((entry) => entry.flagged).length > 0 : false,
      );
    } else {
      if (data[selectedKey]?.length > 0) {
        return [{ ...data[selectedKey], data: processListData(data[selectedKey]) }].filter(Boolean);
      }
      return [];
    }
  }

  const totalCount = getTotalCount(data);
  const allCount = getTotalCount(data, (entry) => !entry.done);
  const allCompletedCount = totalCount - allCount;
  const flaggedCount = getTotalCount(data, (entry) => entry.flagged && !entry.done);

  const completedCount = calculateCompleted();
  const remindersSections = getRemindersSections();

  function calculateCompleted() {
    if (isSearchMode || selectedKey === 'search') {
      return (
        [...Object.values(data)]
          .flat()
          .filter((entry) => entry.done)
          .filter((entry) => filterSearchHits(searchQuery, entry)).length || 0
      );
    }
    if (selectedKey === 'all' || selectedKey === 'completed' || selectedKey === 'flagged') {
      return allCompletedCount;
    }
    return data[selectedKey].filter((entry: ReminderItemType) => entry.done).length;
  }

  return (
    <View style={styles.container}>
      <Popover style={{ position: 'absolute' }}>{popoverData}</Popover>
      <View style={styles.sourceList}>
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSearchMode={setSearchMode}
        />
        <Sections
          isSearchMode={isSearchMode}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          onPress={clearListTempData}
          allCount={allCount}
          flaggedCount={flaggedCount}
          setCompletedVisible={setCompletedVisible}
        />
        <RemindersList
          data={listData}
          getItemCount={(item) => getListCount(data, item)}
          itemOnPress={(item) => {
            setSelectedKey(item.key);
            overwriteListData(setListData, (listItem) => ({
              selected: listItem.key === item.key,
              editMode: false,
            }));
          }}
          itemOnTextInputPress={(item) => {
            overwriteListData(setListData, (listItem) => ({
              editMode: listItem.key === item.key,
            }));
          }}
          itemOnDelete={(item) => {
            clearListTempData();
            if (listData.length) {
              const firstUserListKey = listData[0].key;
              setSelectedKey(firstUserListKey);
              overwriteListData(setListData, (listItem) => ({
                selected: listItem.key === firstUserListKey,
              }));
            } else {
              setSelectedKey('all');
            }
            overwriteListItemsDataAndStore((list) =>
              list.filter((listItem) => listItem.key !== item.key),
            );
            removeAllRemindersByList(item.key);
          }}
          itemOnRename={(item) => {
            overwriteListData(setListData, (listItem) =>
              listItem.key === item.key ? { editMode: true, selected: true } : {},
            );
          }}
          itemOnEdit={(item, title) => {
            overwriteListData(setListData, (listItem) =>
              listItem.key === item.key ? { title } : {},
            );
          }}
          itemOnEditEnd={() => {
            overwriteListItemsDataAndStore((list) =>
              list.map((listItem) => Object.assign({}, listItem, { editMode: false })),
            );
          }}
        />
        <RemindersListFooter
          onPress={() => {
            const entry = getNewListEntry();
            overwriteListItemsDataAndStore((list) => [
              ...list.map((listItem) =>
                Object.assign({}, listItem, { selected: false, editMode: false }),
              ),
              entry,
            ]);
            setSelectedKey(entry.key);
            setData((prevState) => {
              const finalData = Object.assign({}, prevState, { [entry.key]: [] });
              writeDataToStorage(finalData);
              return finalData;
            });
          }}
        />
      </View>
      <View style={styles.content}>
        {isSearchMode ? (
          <SearchResultsHeader searchQuery={searchQuery} />
        ) : (
          <>
            {selectedKey !== 'completed' && (
              <Button icon="􀅼" onPress={addNewReminder} style={styles.addItemButton} />
            )}
            <View style={styles.contentHeaderWrapper}>
              <Text style={getHeaderStyle(selectedKey)} numberOfLines={1} ellipsizeMode="tail">
                {selectedKey.startsWith('list-')
                  ? listData.find((item) => item.key === selectedKey)?.title
                  : selectedKey}
              </Text>
              {!PREDEFINED_KEYS.includes(selectedKey) || selectedKey === 'completed' ? (
                <Text style={getHeaderStyle(selectedKey, styles.contentHeaderCounter)}>
                  {selectedKey === 'completed'
                    ? calculateCompleted()
                    : getListCount(data, { key: selectedKey })}
                </Text>
              ) : null}
            </View>
          </>
        )}
        <ReminderList
          selectedKey={selectedKey}
          sections={remindersSections}
          renderItem={({ item, section }) => {
            const dataKey = section.key || selectedKey;
            return (
              <ReminderItem
                setPopoverData={setPopoverData}
                lastSelectedTarget={lastSelectedTarget}
                setLastSelectedTarget={setLastSelectedTarget}
                item={item}
                sectionTitle={section.title}
                selectedKey={selectedKey}
                isSearchMode={isSearchMode}
                onEdit={(text, fieldName = 'text') => {
                  overwriteSelectedListData(setData, dataKey, (list) =>
                    findAndReplaceEntry(list, item.key, () => ({ [fieldName]: text })),
                  );
                  writeDataToStorage(data);
                }}
                onEditEnd={(event) => {
                  if (!event.nativeEvent.text) {
                    overwriteSelectedListData(setData, dataKey, (list) =>
                      list.filter((entry) => entry.key !== item.key),
                    );
                    writeDataToStorage(data);
                  }
                }}
                onStatusChange={(fieldName: keyof ReminderItemType) => {
                  overwriteSelectedListData(setData, dataKey, (list) =>
                    findAndReplaceEntry(list, item.key, (entry) => {
                      return {
                        [fieldName]: !entry[fieldName],
                      };
                    }),
                  );
                  writeDataToStorage(data);
                }}
              />
            );
          }}
          ListHeaderComponent={() => {
            if (!isSearchMode && selectedKey === 'today') return null;

            if (!PREDEFINED_KEYS.includes(selectedKey))
              return <View style={styles.customListStubHeader} />;

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
          ListFooterComponent={
            !isSearchMode && !PREDEFINED_KEYS.includes(selectedKey) ? (
              <TouchableWithoutFeedback onPress={addNewReminder}>
                <View style={styles.addReminderRow} />
              </TouchableWithoutFeedback>
            ) : null
          }
          ListEmptyComponent={
            !isSearchMode ? (
              <View style={styles.noContentWrapper}>
                <Text style={styles.noContentText}>
                  {completedVisible || remindersSections?.length === 0
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
