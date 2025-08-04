import { MMKV } from 'react-native-mmkv';

import { ReminderItemType, ReminderListItemType } from '~/types.ts';

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
    return jsonValue != null ? JSON.parse(jsonValue) : fallback;
  } catch {
    return fallback as T;
  }
}

export function writeListDataToStorage(value: ReminderListItemType[]) {
  storeData<ReminderListItemType[]>(
    'remindersLists',
    value.map((item) => Object.assign({}, item, { selected: false, editMode: false })),
  );
}

export function writeDataToStorage(value: Record<string, ReminderItemType[]>) {
  storeData('remindersData', value);
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
