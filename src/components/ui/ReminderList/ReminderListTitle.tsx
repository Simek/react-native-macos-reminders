import { PlatformColor, StyleSheet, Text, View } from 'react-native-macos';

import { useAppContext } from '~/context/AppContext';
import { useDataContext } from '~/context/DataContext';
import { PREDEFINED_KEYS } from '~/utils/constants';
import { getHeaderStyle, getListCount, getRemindersCounts } from '~/utils/helpers';

import { Button } from '@ui/Button';
import { SearchResultsHeader } from '@ui/SearchResultsHeader';

export function ReminderListTitle() {
  const { searchQuery, selectedKey, isSearchMode } = useAppContext();
  const { data, listData, addReminder } = useDataContext();

  const { allCompletedCount } = getRemindersCounts(data);

  return isSearchMode ? (
    <SearchResultsHeader searchQuery={searchQuery} />
  ) : (
    <>
      {selectedKey !== 'completed' && (
        <Button
          icon="􀅼"
          onPress={() => addReminder(selectedKey)}
          style={styles.addItemButton}
        />
      )}
      <View style={styles.contentHeaderWrapper}>
        <Text style={getHeaderStyle(selectedKey)} numberOfLines={1} ellipsizeMode="tail">
          {selectedKey.startsWith('list-')
            ? listData.find((item) => item.key === selectedKey)?.title
            : selectedKey}
        </Text>
        {!PREDEFINED_KEYS.includes(selectedKey) || selectedKey === 'completed' ? (
          <Text style={getHeaderStyle(selectedKey, styles.contentHeaderCounter)}>
            {selectedKey === 'completed'
              ? allCompletedCount
              : getListCount(data, { key: selectedKey })}
          </Text>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contentHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentHeader: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: 'SF Pro Rounded',
    lineHeight: 38,
    color: PlatformColor('secondaryLabel'),
  },
  contentHeaderCustom: {
    textTransform: 'capitalize',
  },
  contentHeaderCounter: {
    marginLeft: 36,
    marginRight: 16,
    fontWeight: '400',
  },
  addItemButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 9999,
  },
});
