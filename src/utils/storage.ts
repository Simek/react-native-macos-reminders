import { Dispatch, SetStateAction } from 'react';
import { MMKV } from 'react-native-mmkv';

import { ReminderItemType, ReminderListItemType, RemindersType } from '../types.ts';

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

export function getAllStoredKeys(fallback = []) {
  try {
    return storage.getAllKeys();
  } catch {
    return fallback;
  }
}

export function removeEntry(key: string) {
  try {
    storage.delete(key);
  } catch (error) {
    console.warn(error);
  }
}

export function overwriteListData(
  setter: Dispatch<SetStateAction<ReminderListItemType[]>>,
  overwriteFunc: (item: ReminderListItemType) => Partial<ReminderListItemType>,
) {
  setter((prevState) => [
    ...(prevState || []).map((listItem) => Object.assign({}, listItem, overwriteFunc(listItem))),
  ]);
}

export function overwriteSelectedListData(
  setter: Dispatch<SetStateAction<RemindersType>>,
  listKey: string,
  overwriteFunc: (item: ReminderItemType[]) => ReminderItemType[],
) {
  setter((prevData) =>
    Object.assign({}, prevData, {
      [listKey]: overwriteFunc(prevData[listKey]),
    }),
  );
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
