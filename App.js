import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PREDEFINED_KEYS = ['all', 'scheduled', 'today', 'flagged'];
const PREDEFINED_COLORS = {
  all: { semantic: 'secondaryLabelColor' },
  scheduled: { semantic: 'systemOrangeColor' },
  today: { semantic: 'systemBlueColor' },
  flagged: { semantic: 'systemRedColor' },
};

const storeData = async (key, value, fallback = undefined) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    if (fallback) {
      await storeData(key, fallback);
    } else {
      return undefined;
    }
  }
};

const getStoredData = async (key, fallback = undefined) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return fallback;
  }
};

const RoundIcon: () => Node = ({
  icon,
  color = { semantic: 'systemBlueColor' },
  textColor = '#fff',
  isActive = false,
  stylesKey = 'tagIcon',
}) => (
  <View
    style={[styles[stylesKey], { backgroundColor: isActive ? '#fff' : color }]}>
    <Text style={{ fontSize: 11, color: textColor }}>{icon}</Text>
  </View>
);

const Tag: () => Node = ({
  title,
  icon,
  onPress,
  count = 0,
  isActive = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.tag,
      isActive
        ? { backgroundColor: PREDEFINED_COLORS[title.toLowerCase()] }
        : {},
    ]}>
    <RoundIcon
      icon={icon}
      isActive={isActive}
      color={PREDEFINED_COLORS[title.toLowerCase()]}
    />
    <Text style={[styles.tagCount, isActive ? { color: '#fff' } : {}]}>
      {count}
    </Text>
    <Text style={[styles.tagText, isActive ? { color: '#fff' } : {}]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const App: () => Node = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState('all');
  const [data] = useState({
    today: [],
    scheduled: [],
    flagged: [],
    all: <Text>hi 👋</Text>,
  });
  const [listData, setListData] = useState([]);

  const readListDataFromStorage = async () => {
    const item = await getStoredData('list', []);
    setListData(item);
  };

  const writeListDataToStorage = async (newValue) => {
    await storeData('list', newValue);
  };

  const clearUserListSelection = () => {
    setListData((prevState) =>
      prevState.map((item) => Object.assign({}, item, { selected: false })),
    );
  };

  useEffect(() => {
    readListDataFromStorage();
  }, []);

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
            icon="🗓"
            isActive={selectedKey === 'today'}
            onPress={() => {
              clearUserListSelection();
              setSelectedKey('today');
            }}
          />
          <Tag
            title="Scheduled"
            icon="🕘"
            isActive={selectedKey === 'scheduled'}
            onPress={() => {
              clearUserListSelection();
              setSelectedKey('scheduled');
            }}
          />
          <Tag
            title="All"
            icon="📥"
            isActive={selectedKey === 'all'}
            onPress={() => {
              clearUserListSelection();
              setSelectedKey('all');
            }}
          />
          <Tag
            title="Flagged"
            icon="🏳"
            isActive={selectedKey === 'flagged'}
            onPress={() => {
              clearUserListSelection();
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
            <TouchableOpacity
              onPress={() => {
                setSelectedKey(item.title);
                setListData((prevState) => [
                  ...prevState.map((listItem) =>
                    Object.assign({}, listItem, {
                      selected: listItem.title === item.title,
                    }),
                  ),
                ]);
              }}
              onLongPress={() => {
                clearUserListSelection();
                setSelectedKey('all');
                setListData((prevState) => {
                  const finalData = [
                    ...prevState.filter(
                      (listItem) => listItem.title !== item.title,
                    ),
                  ];
                  writeListDataToStorage(finalData);
                  return finalData;
                });
              }}
              style={[
                styles.listItem,
                item.selected
                  ? {
                      backgroundColor: {
                        semantic: 'selectedContentBackgroundColor',
                      },
                    }
                  : {},
              ]}>
              <RoundIcon icon="☰" color={item.color} stylesKey="listItemIcon" />
              <Text
                style={[
                  styles.listItemText,
                  {
                    color: item.selected ? '#fff' : { semantic: 'labelColor' },
                  },
                ]}>
                {item.title}
              </Text>
              <Text
                style={{
                  color: item.selected
                    ? '#fff'
                    : { semantic: 'secondaryLabelColor' },
                }}>
                {item.count || 0}
              </Text>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.listHeader}>{title}</Text>
          )}
        />
        <View style={styles.listFooter}>
          <TouchableOpacity
            onPress={() => {
              setListData((prevState) => {
                const finalData = [...prevState, { title: 'New list' }];
                writeListDataToStorage(finalData);
                return finalData;
              });
            }}>
            <Text style={styles.listFooterText}>+ Add List</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        {searchQuery ? (
          <>
            <Text style={styles.contentHeader}>
              Results for "{searchQuery}"
            </Text>
            <View />
          </>
        ) : (
          <>
            <Text
              style={[
                styles.contentHeader,
                {
                  textTransform: 'capitalize',
                  color: !PREDEFINED_KEYS.includes(selectedKey)
                    ? { semantic: 'systemBlueColor' }
                    : PREDEFINED_COLORS[selectedKey],
                },
              ]}>
              {selectedKey}
            </Text>
            {selectedKey !== 'today' ? (
              <View style={styles.completedHeader}>
                <Text style={styles.completedText}>0 Completed</Text>
              </View>
            ) : null}
            {data[selectedKey] && data[selectedKey].length ? (
              data[selectedKey]
            ) : (
              <View style={styles.noContentWrapper}>
                <Text style={styles.noContentText}>No Reminders</Text>
              </View>
            )}
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
    height: 20,
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
  tag: {
    backgroundColor: 'rgba(140,140,140,.2)',
    width: '48.25%',
    paddingHorizontal: 10,
    padding: 8,
    marginBottom: 8,
    borderRadius: 10,
  },
  tagText: {
    fontWeight: '600',
    fontSize: 13,
    color: { semantic: 'systemGrayColor' },
  },
  tagIcon: {
    width: 24,
    height: 24,
    padding: 2,
    borderRadius: 14,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagCount: {
    position: 'absolute',
    top: 8,
    right: 10,
    fontWeight: '700',
    fontSize: 18,
    color: { semantic: 'systemGrayColor' },
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
    flexGrow: 2,
    padding: 24,
    paddingLeft: 20,
    paddingTop: 42,
  },
  contentHeader: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'secondaryLabelColor' },
  },
  completedHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: { semantic: 'gridColor' },
    paddingVertical: 8,
    marginTop: 12,
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
});

export default App;
