import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

const SearchInput = ({ searchQuery, setSearchQuery }) => (
  <>
    <TextInput
      onChangeText={setSearchQuery}
      value={searchQuery}
      style={styles.searchInput}
      placeholder="Search"
      placeholderTextColor={{ semantic: 'secondaryLabelColor' }}
      clearButtonMode="while-editing"
      blurOnSubmit
    />
    <Text style={[styles.searchInputIcon, styles.searchInputSearchIcon]}>􀊫</Text>
    {searchQuery !== '' ? <ClearButton onPress={() => setSearchQuery('')} /> : null}
  </>
);

const ClearButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.searchInputIcon, styles.searchInputClearIcon]}>
    <Text style={styles.searchInputClearIconText}>􀁑</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  searchInput: {
    height: 28,
    lineHeight: 21,
    fontSize: 13,
    backgroundColor: { semantic: 'disabledControlTextColor' },
    marginHorizontal: 12,
    paddingLeft: 24,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8c8c8c80',
    color: { semantic: 'labelColor' },
  },
  searchInputIcon: {
    position: 'absolute',
    fontSize: 14,
    top: 6,
    color: { semantic: 'labelColor' },
  },
  searchInputSearchIcon: {
    left: 18,
  },
  searchInputClearIcon: {
    right: 20,
  },
  searchInputClearIconText: {
    color: { semantic: 'labelColor' },
  },
});

export default SearchInput;
