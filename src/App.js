import { Popover } from '@rn-macos/popover';
import React, { useEffect, useState } from 'react';
import { SectionList, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import {
  getStoredData,
  storeData,
  overwriteListData,
  overwriteSelectedListData,
  findAndReplaceEntry,
} from './Storage';
import Button from './components/Button';
import ReminderItem from './components/ReminderItem';
import RemindersListItem from './components/RemindersListItem';
import SearchInput from './components/SearchInput';
import Tags from './components/Tags';
import CONSTANTS from './constants';
import styles from './styles';

const getListColor = (key) =>
  !CONSTANTS.KEYS.includes(key) ? { semantic: 'systemBlueColor' } : CONSTANTS.COLORS[key];

const getHeaderStyle = (key, customStyles = undefined) => {
  return [
    styles.contentHeader,
    customStyles ? customStyles : styles.contentHeaderCustom,
    { color: getListColor(key) },
  ];
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(CONSTANTS.KEYS[0]);
  const [data, setData] = useState(CONSTANTS.STORE);
  const [listData, setListData] = useState([]);
  const [popoverData, setPopoverData] = useState(null);
  const [lastSelectedTarget, setLastSelectedTarget] = useState(null);
  const [completedVisible, setCompletedVisible] = useState(true);

  const readListDataFromStorage = () => {
    const item = getStoredData('remindersLists', []);
    setListData(item);
  };

  const writeListDataToStorage = (value) => {
    storeData(
      'remindersLists',
      value.map((item) => Object.assign({}, item, { selected: false, editMode: false })),
    );
  };

  const readDataFromStorage = () => {
    const item = getStoredData('remindersData', CONSTANTS.STORE);
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

  const getTitle = (key) => listData.find((item) => item.key === key)?.title;

  const getTotalCount = (filterFunc = (e) => e) =>
    Object.keys(data)
      .filter((key) => key.startsWith('list-'))
      .map((key) => data[key].filter(filterFunc).length)
      .reduce((acc, value) => acc + value, 0);

  const remindersSort = (a, b) => a.done - b.done || a.createdAt > b.createdAt;

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

  const multiListMapper = (key) =>
    getTitle(key)
      ? {
          key,
          title: getTitle(key),
          data: processListData(
            isSearchMode
              ? data[key].filter((entry) => searchMatch(entry.text) || searchMatch(entry.textNote))
              : data[key],
          ),
        }
      : null;

  useEffect(() => {
    readListDataFromStorage();
    readDataFromStorage();
  }, []);

  const totalCount = getTotalCount();
  const allCount = getTotalCount((entry) => !entry.done);
  const allCompletedCount = totalCount - allCount;

  const isSearchMode = searchQuery && searchQuery.length > 0;
  const searchMatch = (text) => text && text.toLowerCase().includes(searchQuery.toLowerCase());

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
      <View style={styles.sourceList}>
        <Popover style={{ position: 'absolute' }}>{popoverData}</Popover>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Tags
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          onPress={() => clearListTempData()}
          allCount={allCount}
        />
        <SectionList
          sections={[
            {
              title: 'My Lists',
              data: listData || [],
            },
          ]}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <RemindersListItem
              item={item}
              count={
                data && data[item.key] ? data[item.key].filter((entry) => !entry.done).length : 0
              }
              onPress={() => {
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
              onLongPress={() => {
                clearListTempData();
                setSelectedKey('all');
                overwriteListItemsDataAndStore((list) =>
                  list.filter((listItem) => listItem.key !== item.key),
                );
                setData((prevState) => {
                  delete prevState[item.key];
                  writeDataToStorage(Object.assign({}, prevState));
                  return Object.assign({}, prevState);
                });
              }}
              onEdit={(title) => {
                overwriteListData(setListData, (listItem) =>
                  listItem.key === item.key ? { title } : {},
                );
              }}
              onRename={() => {
                overwriteListData(setListData, (listItem) =>
                  listItem.key === item.key ? { editMode: true, selected: true } : {},
                );
              }}
              onEditEnd={() => {
                overwriteListItemsDataAndStore((list) =>
                  list.map((listItem) => Object.assign({}, listItem, { editMode: false })),
                );
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) =>
            title ? <Text style={styles.listHeader}>{title}</Text> : null
          }
        />
        <TouchableOpacity
          style={styles.listFooter}
          onPress={() => {
            const key = `list-${Date.now()}`;
            overwriteListItemsDataAndStore((list) => [
              ...list.map((listItem) => Object.assign({}, listItem, { selected: false })),
              {
                title: 'New list',
                key,
                selected: true,
                editMode: true,
              },
            ]);
            setSelectedKey(key);
            setData((prevState) => {
              const finalData = Object.assign({}, prevState, { [key]: [] });
              writeDataToStorage(finalData);
              return finalData;
            });
          }}>
          <Text style={styles.listFooterText}>
            <Text style={styles.listFooterTextIcon}>􀁌 </Text> Add List
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {isSearchMode ? (
          <Text
            style={[styles.contentHeader, styles.searchHeader]}
            numberOfLines={1}
            ellipsizeMode="tail">
            Results for “{searchQuery}”
          </Text>
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
