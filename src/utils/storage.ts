import { MMKV } from 'react-native-mmkv';

import { ReminderItemType, ReminderListItemType, RemindersType } from '~/types.ts';

enum Stores {
  Data = 'remindersData',
  Lists = 'remindersLists',
}

const storage = new MMKV({
  id: 'rnmacos-reminders',
});

export function storeData<T>(key: string, value: T, fallback?: T) {
  try {
    const jsonValue = JSON.stringify(value);
    storage.set(key, jsonValue);
  } catch {
    if (fallback !== undefined) {
      return storeData(key, fallback);
    } else {
      return fallback;
    }
  }
}

export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const jsonValue = storage.getString(key);
    const data = jsonValue != null ? JSON.parse(jsonValue) : fallback;

    if (key === Stores.Data && isArray(data['all'])) {
      return migrateLegacyDataStructure(data) as T;
    }
    return data;
  } catch {
    return fallback as T;
  }
}

export function writeListDataToStorage(value: ReminderListItemType[]) {
  storeData<ReminderListItemType[]>(
    Stores.Lists,
    value.map((item) => Object.assign({}, item, { selected: false, editMode: false })),
  );
}

export function writeDataToStorage(value: RemindersType) {
  storeData(Stores.Data, value);
}

export function findAndReplaceEntry(
  list: ReminderItemType[],
  itemKey: string,
  replaceTask: (item: Partial<ReminderItemType>) => Partial<ReminderItemType>,
) {
  return list.map((entry) =>
    entry.key === itemKey ? Object.assign({}, entry, replaceTask(entry)) : entry,
  );
}

export function migrateLegacyDataStructure(data: any) {
  return Object.fromEntries(
    Object.entries(data).map(([key, values]) => {
      if (key === 'today' || key === 'completed') {
        return [key, { reminders: values }];
      }
      return [key, { showCompleted: true, reminders: values }];
    }),
  );
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
