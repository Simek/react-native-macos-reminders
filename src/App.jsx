import { Popover } from '@rn-macos/popover';
import React, { useEffect, useState } from 'react';
import { SectionList, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Button from './components/Button';
import ReminderItem from './components/ReminderItem';
import RemindersList from './components/RemindersList';
import RemindersListFooter from './components/RemindersListFooter';
import SearchInput from './components/SearchInput';
import Tags from './components/Tags';
import styles from './styles';
import CONSTANTS from './utils/constants';
import {
  filterSearchHits,
  getHeaderStyle,
  getListColor,
  getNewListEntry,
  getTitle,
  getTotalCount,
  remindersSort,
} from './utils/helpers';
import {
  getStoredData,
  storeData,
  overwriteListData,
  overwriteSelectedListData,
  findAndReplaceEntry,
} from './utils/storage';

const SearchResultsTitle = ({ searchQuery }) => (
  <Text style={[styles.contentHeader, styles.searchHeader]} numberOfLines={1} ellipsizeMode="tail">
    Results for “{searchQuery}”
  </Text>
);

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

  const processListData = (list) =>
    list.filter((entry) => (completedVisible ? true : !entry.done)).sort(remindersSort);

  const multiListMapper = (key) => {
    const title = getTitle(listData, key);

    if (!title) return null;

    return {
      key,
      title,
      data: processListData(
        isSearchMode
          ? data[key].filter((entry) => filterSearchHits(searchQuery, entry))
          : data[key],
      ),
    };
  };

  useEffect(() => {
    readListDataFromStorage();
    readDataFromStorage();
  }, []);

  const totalCount = getTotalCount(data);
  const allCount = getTotalCount(data, (entry) => !entry.done);
  const allCompletedCount = totalCount - allCount;

  const isSearchMode = searchQuery && searchQuery.length > 0;

  const remindersSections =
    selectedKey === 'all' || isSearchMode
      ? Object.keys(data)
          .filter((key) => key.startsWith('list-'))
          .map(multiListMapper)
          .filter((section) => (isSearchMode ? section.data.length > 0 : true))
          .filter(Boolean)
      : [
          data[selectedKey]?.length > 0 ? { data: processListData(data[selectedKey]) } : null,
        ].filter(Boolean);

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
        />
        <RemindersList
          data={listData}
          itemOnPress={(item) => {
            if (selectedKey === item.key) {
              overwriteListData(setListData, (listItem) => ({
                editMode: listItem.key === item.key,
              }));
            } else {
              setSelectedKey(item.key);
              overwriteListData(setListData, (listItem) => ({
                selected: listItem.key === item.key,
                editMode: false,
              }));
            }
          }}
          itemOnLongPress={(item) => {
            clearListTempData();
            setSelectedKey('all');
            overwriteListItemsDataAndStore((list) =>
              list.filter((listItem) => listItem.key !== item.key),
            );
            setData((prevState) => {
              delete prevState[item.key];
              const finalData = Object.assign({}, prevState);
              writeDataToStorage(finalData);
              return finalData;
            });
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
              ...list.map((listItem) => Object.assign({}, listItem, { selected: false })),
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
          <SearchResultsTitle searchQuery={searchQuery} />
        ) : (
          <>
            <Button
              icon="􀅼"
              disabled={isSearchMode}
              onPress={addNewReminder}
              style={styles.addItemButton}
            />
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
                  {data[selectedKey].filter((entry) => !entry.done).length}
                </Text>
              ) : null}
            </View>
          </>
        )}
        <SectionList
          contentContainerStyle={remindersSections?.length ? {} : { flexGrow: 2 }}
          sections={remindersSections}
          stickySectionHeadersEnabled
          contentOffset={{ y: 52 }}
          keyExtractor={(item) => item.key}
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
          renderSectionHeader={({ section: { title } }) =>
            title ? (
              <View style={styles.contentStickyHeaderWrapper}>
                <Text style={[styles.contentHeader, styles.allListHeader]}>{title}</Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            selectedKey !== 'today' ? (
              <View style={styles.completedHeader}>
                <Text style={styles.completedText}>{calculateCompleted()} Completed</Text>
                <TouchableOpacity onPress={() => setCompletedVisible((prevState) => !prevState)}>
                  <Text
                    style={[
                      styles.completedVisibleText,
                      selectedKey !== 'all' &&
                        !isSearchMode && { color: getListColor(selectedKey) },
                    ]}>
                    {completedVisible ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
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
