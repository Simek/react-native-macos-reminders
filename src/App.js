import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Popover } from '@rn-macos/popover';

import CONSTANTS from './constants';
import { getStoredData, storeData } from './Storage';

import ReminderItem from './components/ReminderItem';
import RemindersListItem from './components/RemindersListItem';
import Tags from './components/Tags';

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

  const readListDataFromStorage = async () => {
    const item = await getStoredData('remindersLists', []);
    setListData(item);
  };

  const writeListDataToStorage = async (value) => {
    await storeData(
      'remindersLists',
      value.map((item) =>
        Object.assign({}, item, { selected: false, editMode: false }),
      ),
    );
  };

  const readDataFromStorage = async () => {
    const item = await getStoredData('remindersData', []);
    setData(item);
  };

  const writeDataToStorage = async (value) => {
    await storeData('remindersData', value);
  };

  const overwriteListItemsData = (overwriteFunc) => {
    setListData((prevState) => [
      ...(prevState || []).map((listItem) =>
        Object.assign({}, listItem, overwriteFunc(listItem)),
      ),
    ]);
  };

  const overwriteListItemsDataAndStore = (overwriteFunc) => {
    setListData((prevState) => {
      const finalData = overwriteFunc(prevState);
      writeListDataToStorage(finalData);
      return finalData;
    });
  };

  const overwriteSingleListData = (listKey, overwriteFunc) => {
    setData((prevData) =>
      Object.assign({}, prevData, {
        [listKey]: overwriteFunc(prevData[listKey]),
      }),
    );
  };

  const clearListTempData = (
    content = { selected: false, editMode: false },
  ) => {
    overwriteListItemsData(() => content);
  };

  const getTitle = (key) => listData.find((item) => item.key === key)?.title;

  const getCount = (filterFunc = (e) => e) =>
    Object.keys(data)
      .filter((key) => key.startsWith('list-'))
      .map((key) => data[key].filter(filterFunc).length)
      .reduce((acc, value) => acc + value, 0);

  const basicSort = (a, b) => a.done - b.done || a.createdAt > b.createdAt;

  useEffect(() => {
    readListDataFromStorage();
    readDataFromStorage();
  }, []);

  const totalCount = getCount();
  const allCount = getCount((entry) => !entry.done);
  const allCompletedCount = totalCount - allCount;

  const isSearchMode = searchQuery && searchQuery.length > 0;
  const remindersSections =
    selectedKey === 'all' || isSearchMode
      ? Object.keys(data)
          .filter((key) => key.startsWith('list-'))
          .map((key) =>
            getTitle(key)
              ? {
                  key,
                  title: getTitle(key),
                  data: isSearchMode
                    ? data[key]
                        .filter((entry) =>
                          entry.text
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .sort(basicSort)
                    : data[key].sort(basicSort),
                }
              : null,
          )
          .filter((section) => (isSearchMode ? section.data.length > 0 : true))
          .filter(Boolean)
      : [
          (data[selectedKey] || []).length > 0
            ? { data: data[selectedKey].sort(basicSort) }
            : null,
        ].filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.sourceList}>
        <View>
          <Popover style={{ position: 'absolute' }}>{popoverData}</Popover>
          <TextInput
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={{ semantic: 'secondaryLabelColor' }}
            clearButtonMode="while-editing"
            blurOnSubmit={true}
          />
          <Text style={[styles.searchInputIcon, styles.searchInputSearchIcon]}>
            􀊫
          </Text>
          {searchQuery !== '' ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={[styles.searchInputIcon, styles.searchInputClearIcon]}>
              <Text style={styles.searchInputClearIconText}>􀁑</Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
                  overwriteListItemsData((listItem) => ({
                    editMode: listItem.key === item.key,
                  }));
                } else {
                  setSelectedKey(item.key);
                  overwriteListItemsData((listItem) => ({
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
                overwriteListItemsData((listItem) =>
                  listItem.key === item.key ? { title } : {},
                );
              }}
              onRename={() => {
                overwriteListItemsData((listItem) =>
                  listItem.key === item.key
                    ? { editMode: true, selected: true }
                    : {},
                );
              }}
              onEditEnd={() => {
                overwriteListItemsDataAndStore((list) =>
                  list.map((listItem) =>
                    Object.assign({}, listItem, { editMode: false }),
                  ),
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
              ...list.map((listItem) =>
                Object.assign({}, listItem, { selected: false }),
              ),
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
        <TouchableHighlight
          underlayColor={
            isSearchMode
              ? { semantic: 'controlColor' }
              : { semantic: 'selectedContentBackgroundColor' }
          }
          onPress={() => {
            const ts = Date.now();
            setData((prevData) =>
              Object.assign({}, prevData, {
                [selectedKey]: [
                  ...prevData[selectedKey],
                  { text: '', key: `entry-${ts}`, createdAt: ts, done: false },
                ],
              }),
            );
          }}
          pointerEvents={isSearchMode ? 'auto' : 'none'}
          style={[
            styles.createButton,
            isSearchMode ? styles.createButtonDisabled : {},
          ]}>
          <Text style={styles.createButtonText}>+</Text>
        </TouchableHighlight>
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
                <Text
                  style={getHeaderStyle(
                    selectedKey,
                    styles.contentHeaderCounter,
                  )}>
                  {data[selectedKey].length}
                </Text>
              ) : null}
            </View>
            {selectedKey !== 'today' ? (
              <View style={styles.completedHeader}>
                <Text style={styles.completedText}>
                  {selectedKey === 'all'
                    ? allCompletedCount
                    : data[selectedKey].filter((entry) => entry.done)
                        .length}{' '}
                  Completed
                </Text>
              </View>
            ) : null}
          </>
        )}
        <SectionList
          contentContainerStyle={{ flex: 1 }}
          sections={remindersSections}
          keyExtractor={(item) => item.key}
          renderItem={({ item, section }) => (
            <ReminderItem
              setPopoverData={setPopoverData}
              item={item}
              onEdit={(text) => {
                const dataKey = section.key || selectedKey;
                overwriteSingleListData(dataKey, (list) =>
                  list.map((entry) =>
                    entry.key === item.key
                      ? Object.assign({}, entry, { text })
                      : entry,
                  ),
                );
              }}
              onEditEnd={(text) => {
                if (!text) {
                  const dataKey = section.key || selectedKey;
                  overwriteSingleListData(dataKey, (list) =>
                    list.filter((entry) => entry.key !== item.key),
                  );
                }
                writeDataToStorage(data);
              }}
              onStatusChange={() => {
                const dataKey = section.key || selectedKey;
                overwriteSingleListData(dataKey, (list) =>
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
            title ? (
              <Text style={[styles.contentHeader, styles.allListHeader]}>
                {title}
              </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sourceList: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#8c8c8c33',
    maxWidth: 280,
    flexGrow: 1,
    paddingTop: 52,
  },
  searchInput: {
    height: 22,
    lineHeight: 18,
    fontSize: 12,
    backgroundColor: { semantic: 'disabledControlTextColor' },
    marginHorizontal: 16,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8c8c8c80',
    color: { semantic: 'labelColor' },
  },
  searchInputIcon: {
    position: 'absolute',
    fontSize: 14,
    top: 3,
    color: { semantic: 'labelColor' },
  },
  searchInputSearchIcon: {
    left: 20,
  },
  searchInputClearIcon: {
    right: 20,
  },
  searchInputClearIconText: {
    color: { semantic: 'labelColor' },
  },
  listHeader: {
    fontSize: 11,
    marginBottom: 4,
    paddingHorizontal: 16,
    color: { semantic: 'systemGrayColor' },
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItemSelected: {
    backgroundColor: {
      semantic: 'selectedContentBackgroundColor',
    },
  },
  listItemIcon: {
    width: 20,
    height: 20,
    padding: 2,
    marginRight: 8,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 13,
    lineHeight: 20,
    flexGrow: 99,
  },
  listFooter: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
  },
  listFooterText: {
    color: { semantic: 'systemGrayColor' },
    fontSize: 13,
  },
  listFooterTextIcon: {
    fontSize: 16,
    lineHeight: 17,
  },
  content: {
    backgroundColor: { semantic: 'controlBackgroundColor' },
    flex: 1,
    flexGrow: 2,
    padding: 24,
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 42,
  },
  contentHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentHeader: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'secondaryLabelColor' },
  },
  contentHeaderCustom: {
    textTransform: 'capitalize',
  },
  contentHeaderCounter: {
    marginLeft: 36,
    fontWeight: '400',
  },
  completedHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8c8c8c50',
    paddingVertical: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  completedText: {
    color: { semantic: 'labelColor' },
    fontSize: 13,
  },
  noContentWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  noContentText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'secondaryLabelColor' },
  },
  createButton: {
    backgroundColor: { semantic: 'controlColor' },
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8c8c8c70',
    paddingHorizontal: 12,
    height: 18,
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    right: 12,
  },
  createButtonText: {
    color: { semantic: 'labelColor' },
    fontWeight: '100',
    fontSize: 22,
    lineHeight: 20,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  remindersHeader: {
    paddingVertical: 6,
    fontSize: 20,
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'systemBlueColor' },
  },
  allListHeader: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 12,
    color: { semantic: 'systemBlueColor' },
  },
  searchHeader: {
    marginBottom: 19.5,
  },
});

export default App;
