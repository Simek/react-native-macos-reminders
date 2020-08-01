import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CONSTANTS from './constants';
import { getStoredData, storeData } from './Storage';

import RemindersListItem from './components/RemindersListItem';
import Tag from './components/Tag';

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
  const [selectedKey, setSelectedKey] = useState('all');
  const [data, setData] = useState({
    today: [],
    scheduled: [],
    flagged: [],
    all: [],
  });
  const [listData, setListData] = useState([]);

  const isSearchMode = searchQuery && searchQuery.length > 0;

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

  const clearListTempData = () => {
    overwriteListItemsData(() => ({ selected: false, editMode: false }));
  };

  const getTitle = (key) => listData.find((item) => item.key === key)?.title;

  useEffect(() => {
    readListDataFromStorage();
    readDataFromStorage();
  }, []);

  const allCount = Object.keys(data).filter((key) => key.startsWith('list-'))
    .length;

  const remindersSections =
    selectedKey === 'all'
      ? Object.keys(data)
          .filter((key) => key.startsWith('list-'))
          .map((key) =>
            getTitle(key) ? { title: getTitle(key), data: data[key] } : null,
          )
          .filter(Boolean)
      : [
          (data[selectedKey] || []).length > 0
            ? { data: data[selectedKey] }
            : null,
        ].filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.sourceList}>
        <TextInput
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchInput}
          placeholder="Search"
          clearButtonMode="while-editing"
          blurOnSubmit={true}
        />
        <View style={styles.tags}>
          <Tag
            title="Today"
            icon="􀉉"
            isActive={selectedKey === 'today'}
            onPress={() => {
              clearListTempData();
              setSelectedKey('today');
            }}
          />
          <Tag
            title="Scheduled"
            icon="􀐬"
            isActive={selectedKey === 'scheduled'}
            onPress={() => {
              clearListTempData();
              setSelectedKey('scheduled');
            }}
          />
          <Tag
            title="All"
            icon="􀈤"
            isActive={selectedKey === 'all'}
            onPress={() => {
              clearListTempData();
              setSelectedKey('all');
            }}
            count={allCount}
          />
          <Tag
            title="Flagged"
            icon="􀋊"
            isActive={selectedKey === 'flagged'}
            onPress={() => {
              clearListTempData();
              setSelectedKey('flagged');
            }}
          />
        </View>
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
                overwriteListItemsDataAndStore((list) => [
                  ...list.filter((listItem) => listItem.key !== item.key),
                ]);
                setData((prevState) => {
                  delete prevState[item.key];
                  writeDataToStorage(Object.assign({}, prevState));
                  return Object.assign({}, prevState);
                });
              }}
              onEdit={(title) => {
                overwriteListItemsData((listItem) =>
                  listItem.editMode ? { title } : listItem,
                );
              }}
              onEditEnd={() => {
                overwriteListItemsDataAndStore((list) => [
                  ...list.map((listItem) =>
                    Object.assign({}, listItem, { editMode: false }),
                  ),
                ]);
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.listHeader}>{title}</Text>
          )}
        />
        <View style={styles.listFooter}>
          <TouchableOpacity
            onPress={() => {
              const key = `list-${Date.now()}`;
              overwriteListItemsDataAndStore((list) => [
                ...list,
                {
                  title: 'New list',
                  key,
                  editMode: true,
                },
              ]);
              setData((prevState) => {
                const finalData = Object.assign({}, prevState, { [key]: [] });
                writeDataToStorage(finalData);
                return finalData;
              });
            }}>
            <Text style={styles.listFooterText}>+ Add List</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={isSearchMode ? 1.0 : 0.2}
          style={[
            styles.createButton,
            isSearchMode ? styles.createButtonDisabled : {},
          ]}>
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
        {isSearchMode ? (
          <Text
            style={styles.contentHeader}
            numberOfLines={1}
            ellipsizeMode="tail">
            Results for "{searchQuery}"
          </Text>
        ) : (
          <>
            <View style={styles.contentHeaderWrapper}>
              <Text
                style={getHeaderStyle(selectedKey)}
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
                  0
                </Text>
              ) : null}
            </View>
            {selectedKey !== 'today' ? (
              <View style={styles.completedHeader}>
                <Text style={styles.completedText}>0 Completed</Text>
              </View>
            ) : null}
            <SectionList
              contentContainerStyle={{ flex: 1 }}
              sections={remindersSections}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => <Text>{item.text}</Text>}
              renderSectionHeader={({ section }) => (
                <Text style={styles.remindersHeader}>{section.title}</Text>
              )}
              ListEmptyComponent={
                <View style={styles.noContentWrapper}>
                  <Text style={styles.noContentText}>No Reminders</Text>
                </View>
              }
            />
          </>
        )}
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
    borderRightColor: { semantic: 'separatorColor' },
    maxWidth: 280,
    flexGrow: 1,
    paddingTop: 52,
  },
  searchInput: {
    height: 22,
    lineHeight: 18,
    backgroundColor: { semantic: 'gridColor' },
    marginHorizontal: 16,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: { semantic: 'tertiaryLabelColor' },
    color: { semantic: 'secondaryLabelColor' },
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 16,
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
  },
  listFooterText: {
    color: { semantic: 'systemGrayColor' },
    fontSize: 13,
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
    borderBottomColor: { semantic: 'separatorColor' },
    paddingVertical: 8,
    marginTop: 16,
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
    backgroundColor: { semantic: 'tertiaryLabelColor' },
    paddingHorizontal: 14,
    height: 20,
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    right: 12,
  },
  createButtonText: {
    color: { semantic: 'labelColor' },
    fontWeight: '100',
    fontSize: 24,
    lineHeight: 22,
  },
  createButtonDisabled: {
    color: { semantic: 'tertiaryLabelColor' },
    backgroundColor: { semantic: 'controlBackgroundColor' },
  },
  remindersHeader: {
    paddingVertical: 6,
    fontSize: 20,
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'systemBlueColor' },
  },
});

export default App;
