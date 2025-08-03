import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, View, PlatformColor } from 'react-native-macos';

import { ClearButton } from './ClearButton';

type Props = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export function SearchInput({ searchQuery, setSearchQuery }: Props) {
  return (
    <View>
      <TextInput
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor={PlatformColor('secondaryLabelColor')}
        clearButtonMode="while-editing"
        submitBehavior="blurAndSubmit"
      />
      <Text style={[styles.searchInputIcon, styles.searchInputSearchIcon]}>􀊫</Text>
      {searchQuery.length ? (
        <ClearButton
          onPress={(event) => {
            event.stopPropagation();
            setSearchQuery('');
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 28,
    fontSize: 13,
    backgroundColor: 'rgba(140,140,140,.2)',
    marginHorizontal: 12,
    paddingTop: 5,
    paddingLeft: 24,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8c8c8c20',
    borderBottomColor: '#8c8c8c50',
    color: PlatformColor('text'),
  },
  searchInputIcon: {
    position: 'absolute',
    fontSize: 14,
    top: 2,
    color: PlatformColor('label'),
    cursor: 'pointer',
    padding: 4,
  },
  searchInputSearchIcon: {
    left: 14,
  },
});
