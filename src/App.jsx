import { Popover } from '@rn-macos/popover';
import React, { useEffect, useState } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

import AccentButton from './components/AccentButton';
import Button from './components/Button';
import ReminderItem from './components/ReminderItem';
import ReminderList from './components/ReminderList';
import RemindersList from './components/RemindersList';
import RemindersListFooter from './components/RemindersListFooter';
import SearchInput from './components/SearchInput';
import SearchResultsHeader from './components/SearchResultsHeader';
import Tags from './components/Tags';
import ClearMenu from './menus/ClearMenu';
import styles from './styles';
import CONSTANTS from './utils/constants';
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

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(CONSTANTS.KEYS[0]);
  const [data, setData] = useState(CONSTANTS.STORE);
  const [listData, setListData] = useState([]);
  const [popoverData, setPopoverData] = useState(null);
  const [lastSelectedTarget, setLastSelectedTarget] = useState(null);
  const [completedVisible, setCompletedVisible] = useState(true);

  const readListDataFromStorage = () => {
    const item = getStoredData('remindersLists', listData);
    setListData(item);
  };

  const writeListDataToStorage = (value) => {
    storeData(
      'remindersLists',
      value.map((item) => Object.assign({}, item, { selected: false, editMode: false })),
    );
  };

  const readDataFromStorage = () => {
    const item = getStoredData('remindersData', data);
    setData(item);
  };

  const writeDataToStorage = (value) => {
    storeData('remindersData', value);
  };

  const overwriteListItemsDataAndStore = (overwriteFunc) => {
    setListData((prevState) => {
      const finalData = overwriteFunc(prevState);
      writeListDataToStorage(finalData);
      return finalData;
    });
  };

  const clearListTempData = (content = { selected: false, editMode: false }) => {
    overwriteListData(setListData, () => content);
  };

  const addNewReminder = () => {
    const ts = Date.now();
    setData((prevData) =>
      Object.assign({}, prevData, {
        [selectedKey]: [
          ...prevData[selectedKey],
          { text: '', key: `entry-${ts}`, createdAt: ts, done: false },
        ],
      }),
    );
  };

  const removeAllRemindersByList = (listKey, keys = []) => {
    setData((prevState) => {
      if (keys.length) {
        prevState[listKey] = prevState[listKey].filter((entry) => !keys.includes(entry.key));
      } else {
        delete prevState[listKey];
      }
      const finalData = Object.assign({}, prevState);
      writeDataToStorage(finalData);
      return finalData;
    });
  };

  const processListData = (list) => processRemindersList(list, completedVisible);

  const multiListMapper = (key, itemFilter = () => true) => {
    const title = getTitle(listData, key);

    if (!title) return null;

    return {
      key,
      title,
      data: processListData(data[key].filter(itemFilter)),
    };
  };

  const getRemindersSections = () => {
    if (isSearchMode) {
      return getSpecialListContent(
        data,
        (key) => multiListMapper(key, (entry) => filterSearchHits(searchQuery, entry)),
        (section) => section.data.length > 0,
      );
    } else if (selectedKey === 'all') {
      return getSpecialListContent(data, (key) => multiListMapper(key));
    } else if (selectedKey === 'flagged') {
      return getSpecialListContent(
        data,
        (key) => multiListMapper(key, (entry) => entry.flagged),
        (section) => section.data.filter((entry) => entry.flagged).length || 0,
      );
    } else {
      return [
        data[selectedKey]?.length > 0 ? { data: processListData(data[selectedKey]) } : null,
      ].filter(Boolean);
    }
  };

  useEffect(() => {
    readListDataFromStorage();
    readDataFromStorage();
  }, []);

  const totalCount = getTotalCount(data);
  const allCount = getTotalCount(data, (entry) => !entry.done);
  const allCompletedCount = totalCount - allCount;
  const flaggedCount = getTotalCount(data, (entry) => entry.flagged);

  const isSearchMode = searchQuery && searchQuery.length > 0;
  const remindersSections = getRemindersSections();

  const calculateCompleted = () =>
    isSearchMode
      ? remindersSections[0]?.data?.filter((entry) => entry.done).length || 0
      : selectedKey === 'all'
      ? allCompletedCount
      : data[selectedKey].filter((entry) => entry.done).length;

  return (
    <View style={styles.container}>
      <Popover style={{ position: 'absolute' }}>{popoverData}</Popover>
      <View style={styles.sourceList}>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Tags
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          onPress={clearListTempData}
          allCount={allCount}
          flaggedCount={flaggedCount}
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
            <Button icon="􀅼" onPress={addNewReminder} style={styles.addItemButton} />
            <View style={styles.contentHeaderWrapper}>
              <Text
                style={getHeaderStyle(selectedKey, selectedKey.startsWith('list-'))}
                numberOfLines={1}
                ellipsizeMode="tail">
                {selectedKey.startsWith('list-')
                  ? listData.find((item) => item.key === selectedKey)?.title
                  : selectedKey}
              </Text>
              {!CONSTANTS.KEYS.includes(selectedKey) ? (
                <Text style={getHeaderStyle(selectedKey, styles.contentHeaderCounter)}>
                  {getListCount(data, { key: selectedKey })}
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
                color={getListColor(selectedKey === 'all' ? null : selectedKey)}
                onEdit={(text, fieldName = 'text') => {
                  overwriteSelectedListData(setData, dataKey, (list) =>
                    findAndReplaceEntry(list, item.key, () => ({ [fieldName]: text })),
                  );
                }}
                onEditEnd={(e) => {
                  if (!e.nativeEvent.text) {
                    overwriteSelectedListData(setData, dataKey, (list) =>
                      list.filter((entry) => entry.key !== item.key),
                    );
                    writeDataToStorage(data);
                  }
                }}
                onStatusChange={(fieldName) => {
                  overwriteSelectedListData(setData, dataKey, (list) =>
                    findAndReplaceEntry(list, item.key, (entry) => ({
                      [fieldName]: !entry[fieldName],
                    })),
                  );
                  writeDataToStorage(data);
                }}
              />
            );
          }}
          ListHeaderComponent={() => {
            if (selectedKey === 'today') return null;

            const completedCount = calculateCompleted();
            const color =
              selectedKey !== 'all' && !isSearchMode ? getListColor(selectedKey) : undefined;

            return (
              <View style={styles.completedHeader}>
                <View style={styles.completedTextWrapper}>
                  <Text style={styles.completedText}>{completedCount} Completed • </Text>
                  <AccentButton
                    onPress={() =>
                      ClearMenu(completedCount, () => {
                        const keys = data[selectedKey]
                          .filter((entry) => entry.done)
                          .map((entry) => entry.key);
                        removeAllRemindersByList(selectedKey, keys);
                      })
                    }
                    color={color}
                    disabled={completedCount === 0}>
                    Clear
                  </AccentButton>
                </View>
                <AccentButton
                  onPress={() => setCompletedVisible((prevState) => !prevState)}
                  color={color}>
                  {completedVisible ? 'Hide' : 'Show'}
                </AccentButton>
              </View>
            );
          }}
          ListFooterComponent={
            !isSearchMode && !CONSTANTS.KEYS.includes(selectedKey) ? (
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
                    : 'All Items Completed'}
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default App;
