import { Text, View } from 'react-native-macos';

import Button from '~/components/Button.tsx';
import SearchResultsHeader from '~/components/SearchResultsHeader.tsx';
import { useAppContext } from '~/context/AppContext.tsx';
import { useDataContext } from '~/context/DataContext.tsx';
import sharedStyles from '~/sharedStyles.ts';
import { PREDEFINED_KEYS } from '~/utils/constants.ts';
import { getHeaderStyle, getListCount, getRemindersCounts } from '~/utils/helpers.ts';

export default function ReminderListTitle() {
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
          style={sharedStyles.addItemButton}
        />
      )}
      <View style={sharedStyles.contentHeaderWrapper}>
        <Text style={getHeaderStyle(selectedKey)} numberOfLines={1} ellipsizeMode="tail">
          {selectedKey.startsWith('list-')
            ? listData.find((item) => item.key === selectedKey)?.title
            : selectedKey}
        </Text>
        {!PREDEFINED_KEYS.includes(selectedKey) || selectedKey === 'completed' ? (
          <Text style={getHeaderStyle(selectedKey, sharedStyles.contentHeaderCounter)}>
            {selectedKey === 'completed'
              ? allCompletedCount
              : getListCount(data, { key: selectedKey })}
          </Text>
        ) : null}
      </View>
    </>
  );
}
