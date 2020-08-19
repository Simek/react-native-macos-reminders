import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { SectionList, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Popover } from '@rn-macos/popover';

import CONSTANTS from './constants';
import styles from './styles';
import { getStoredData, storeData, overwriteListData, overwriteSelectedListData } from './Storage';

import ReminderItem from './components/ReminderItem';
import RemindersListItem from './components/RemindersListItem';
import Tags from './components/Tags';
import Button from './components/Button';
import SearchInput from './components/SearchInput';

const getHeaderStyle = (key, customStyles = undefined) => {
  return [
    styles.contentHeader,
    customStyles ? customStyles : styles.contentHeaderCustom,
    {
      color: !CONSTANTS.KEYS.includes(key)
        ? { semantic: 'systemBlueColor' }
        : CONSTANTS.COLORS[key],
    },
  ];
};

const App: () => Node = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(CONSTANTS.KEYS[0]);
  const [data, setData] = useState({
    today: [],
    scheduled: [],
    flagged: [],
    all: [],
  });
  const [listData, setListData] = useState([]);
  const [popoverData, setPopoverData] = useState(null);
  const [lastSelectedTarget, setLastSelectedTarget] = useState(null);

  const readListDataFromStorage = async () => {
    const item = await getStoredData('remindersLists', []);
    setListData(item);
  };

  const writeListDataToStorage = async (value) => {
    await storeData(
      'remindersLists',
      value.map((item) => Object.assign({}, item, { selected: false, editMode: false })),
    );
  };

  const readDataFromStorage = async () => {
    const item = await getStoredData('remindersData', []);
    setData(item);
  };

  const writeDataToStorage = async (value) => {
    await storeData('remindersData', value);
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

  const getCount = (filterFunc = (e) => e) =>
    Object.keys(data)
      .filter((key) => key.startsWith('list-'))
      .map((key) => data[key].filter(filterFunc).length)
      .reduce((acc, value) => acc + value, 0);

  const basicSort = (a, b) => a.done - b.done || a.createdAt > b.createdAt;

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

  const multiListMapper = (key) =>
    getTitle(key)
      ? {
          key,
          title: getTitle(key),
          data: isSearchMode
            ? data[key]
                .filter((entry) => searchMatch(entry.text) || searchMatch(entry.textNote))
                .sort(basicSort)
            : data[key].sort(basicSort),
        }
      : null;

  useEffect(() => {
    readListDataFromStorage();
    readDataFromStorage();
  }, []);

  const totalCount = getCount();
  const allCount = getCount((entry) => !entry.done);
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
          (data[selectedKey] || []).length > 0 ? { data: data[selectedKey].sort(basicSort) } : null,
        ].filter(Boolean);

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
              count={data && data[item.key] ? data[item.key].length : 0}
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
            <Text style={styles.listFooterTextIcon}>􀁍 </Text> Add List
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Button text="+" disabled={isSearchMode} onPress={addNewReminder} />
        {isSearchMode ? (
          <Text
            style={[styles.contentHeader, styles.searchHeader]}
            numberOfLines={1}
            ellipsizeMode="tail">
            Results for "{searchQuery}"
          </Text>
        ) : (
          <>
            <View style={styles.contentHeaderWrapper}>
              <Text
                style={getHeaderStyle(
                  selectedKey,
                  selectedKey.startsWith('list-') ? {} : undefined,
                )}
                numberOfLines={1}
                ellipsizeMode="tail">
                {selectedKey.startsWith('list-')
                  ? listData.find((item) => item.key === selectedKey)?.title
                  : selectedKey}
              </Text>
              {!CONSTANTS.KEYS.includes(selectedKey) ? (
                <Text style={getHeaderStyle(selectedKey, styles.contentHeaderCounter)}>
                  {data[selectedKey].length}
                </Text>
              ) : null}
            </View>
            {selectedKey !== 'today' ? (
              <View style={styles.completedHeader}>
                <Text style={styles.completedText}>
                  {selectedKey === 'all'
                    ? allCompletedCount
                    : data[selectedKey].filter((entry) => entry.done).length}{' '}
                  Completed
                </Text>
              </View>
            ) : null}
          </>
        )}
        <SectionList
          contentContainerStyle={remindersSections.length === 0 ? { flex: 1 } : null}
          sections={remindersSections}
          keyExtractor={(item) => item.key}
          renderItem={({ item, section }) => (
            <ReminderItem
              setPopoverData={setPopoverData}
              lastSelectedTarget={lastSelectedTarget}
              setLastSelectedTarget={setLastSelectedTarget}
              item={item}
              onEdit={(text, fieldName = 'text') => {
                const dataKey = section.key || selectedKey;
                overwriteSelectedListData(setData, dataKey, (list) =>
                  list.map((entry) =>
                    entry.key === item.key
                      ? Object.assign({}, entry, { [fieldName]: text })
                      : entry,
                  ),
                );
              }}
              onEditEnd={(e) => {
                if (!e.nativeEvent.text) {
                  const dataKey = section.key || selectedKey;
                  overwriteSelectedListData(setData, dataKey, (list) =>
                    list.filter((entry) => entry.key !== item.key),
                  );
                }
                writeDataToStorage(data);
              }}
              onStatusChange={() => {
                const dataKey = section.key || selectedKey;
                overwriteSelectedListData(setData, dataKey, (list) =>
                  list.map((entry) =>
                    entry.key === item.key
                      ? Object.assign({}, entry, { done: !entry.done })
                      : entry,
                  ),
                );
                writeDataToStorage(data);
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) =>
            title ? <Text style={[styles.contentHeader, styles.allListHeader]}>{title}</Text> : null
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
                <Text style={styles.noContentText}>No Reminders</Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default App;
