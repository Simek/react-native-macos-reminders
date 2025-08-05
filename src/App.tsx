import { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native-macos';

import ReminderList from '~/components/ReminderList';
import ReminderListTitle from '~/components/ReminderListTitle.tsx';
import RemindersList from '~/components/RemindersList';
import RemindersListFooter from '~/components/RemindersListFooter';
import { SearchInput } from '~/components/SearchInput';
import Sections from '~/components/Sections';
import { useAppContext } from '~/context/AppContext.tsx';
import { useDataContext } from '~/context/DataContext.tsx';
import sharedStyles from '~/sharedStyles.ts';
import { ReminderListItemType } from '~/types.ts';
import { getListCount, getNewListEntry } from '~/utils/helpers';

function App() {
  const { setSelectedKey } = useAppContext();
  const { data, setData, listData, setListData, overwriteListData, removeAllRemindersByList } =
    useDataContext();
  const [windowSize, setWindowSize] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      if (window.width > 0) {
        setWindowSize(window);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const overwriteListItemsData = (
    overwriteFunc: (lists: ReminderListItemType[]) => ReminderListItemType[],
  ) => {
    setListData(overwriteFunc(listData));
  };

  function clearListTempData(
    content: Partial<ReminderListItemType> = { selected: false, editMode: false },
  ) {
    overwriteListData(() => content);
  }

  return (
    <View style={sharedStyles.container}>
      <View style={[sharedStyles.sourceList, windowSize.width <= 566 && { display: 'none' }]}>
        <SearchInput />
        <Sections onPress={clearListTempData} />
        <RemindersList
          data={listData}
          getItemCount={(item) => getListCount(data, item)}
          itemOnPress={(item) => {
            setSelectedKey(item.key);
            overwriteListData((listItem) => ({
              selected: listItem.key === item.key,
              editMode: false,
            }));
          }}
          itemOnTextInputPress={(item) => {
            overwriteListData((listItem) => ({
              editMode: listItem.key === item.key,
            }));
          }}
          itemOnDelete={(item) => {
            clearListTempData();
            if (listData.length) {
              const firstUserListKey = listData[0].key;
              setSelectedKey(firstUserListKey);
              overwriteListData((listItem) => ({
                selected: listItem.key === firstUserListKey,
              }));
            } else {
              setSelectedKey('all');
            }
            overwriteListItemsData((list) => list.filter((listItem) => listItem.key !== item.key));
            removeAllRemindersByList(item.key);
          }}
          itemOnRename={(item) => {
            overwriteListData((listItem) =>
              listItem.key === item.key ? { editMode: true, selected: true } : {},
            );
          }}
          itemOnEdit={(item, title) => {
            overwriteListData((listItem) => (listItem.key === item.key ? { title } : {}));
          }}
          itemOnEditEnd={() => {
            overwriteListItemsData((list) =>
              list.map((listItem) => Object.assign({}, listItem, { editMode: false })),
            );
          }}
        />
        <RemindersListFooter
          onPress={() => {
            const entry = getNewListEntry();
            overwriteListItemsData((list) => [
              ...list.map((listItem) =>
                Object.assign({}, listItem, { selected: false, editMode: false }),
              ),
              entry,
            ]);
            setSelectedKey(entry.key);
            setData(
              Object.assign({}, data, { [entry.key]: { showCompleted: true, reminders: [] } }),
            );
          }}
        />
      </View>
      <View style={sharedStyles.content}>
        <ReminderListTitle />
        <ReminderList />
      </View>
    </View>
  );
}

export default App;
