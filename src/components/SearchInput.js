import React from 'react';
import type { Node } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SearchInput: () => Node = ({ searchQuery, setSearchQuery }) => (
  <View>
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
);

const styles = StyleSheet.create({
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
});

export default SearchInput;
