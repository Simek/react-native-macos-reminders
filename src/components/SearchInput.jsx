import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SearchInput = ({ searchQuery, setSearchQuery }) => (
  <View>
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
    {searchQuery.length ? (
      <ClearButton
        onPress={(e) => {
          e.stopPropagation();
          setSearchQuery('');
        }}
      />
    ) : null}
  </View>
);

const ClearButton = ({ onPress }) => (
  <TouchableOpacity
    onPressIn={onPress}
    style={[styles.searchInputIcon, styles.searchInputClearIcon]}>
    <Text style={styles.searchInputClearIconText}>􀁑</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  searchInput: {
    height: 28,
    fontSize: 13,
    backgroundColor: { semantic: 'disabledControlTextColor' },
    marginHorizontal: 12,
    paddingTop: 5,
    paddingLeft: 24,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8c8c8c80',
    color: { semantic: 'textColor' },
  },
  searchInputIcon: {
    position: 'absolute',
    fontSize: 14,
    top: 2,
    color: { semantic: 'labelColor' },
    padding: 4,
  },
  searchInputSearchIcon: {
    left: 14,
  },
  searchInputClearIcon: {
    right: 14,
  },
  searchInputClearIconText: {
    color: { semantic: 'labelColor' },
  },
});

export default SearchInput;
