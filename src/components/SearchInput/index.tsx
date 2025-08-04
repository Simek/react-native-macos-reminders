import { StyleSheet, Text, TextInput, View, PlatformColor } from 'react-native-macos';

import { ClearButton } from './ClearButton';

import { useAppContext } from '~/context/AppContext.tsx';

export function SearchInput() {
  const { searchQuery, setSearchQuery, setSearchMode } = useAppContext();

  return (
    <View>
      <TextInput
        onChangeText={(text) => {
          setSearchQuery(text);
          setSearchMode(text.length > 0);
        }}
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
            setSearchMode(false);
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
