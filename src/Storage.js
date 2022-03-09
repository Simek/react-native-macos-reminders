import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'rnmacos-reminders',
});

export const storeData = (key, value, fallback = undefined) => {
  try {
    const jsonValue = JSON.stringify(value);
    storage.set(key, jsonValue);
  } catch (e) {
    if (fallback) {
      storeData(key, fallback);
    } else {
      return fallback;
    }
  }
};

export const getStoredData = (key, fallback = undefined) => {
  try {
    const jsonValue = storage.getString(key);
    return jsonValue != null ? JSON.parse(jsonValue) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const getAllStoredKeys = (fallback = []) => {
  try {
    return storage.getAllKeys();
  } catch (e) {
    return fallback;
  }
};

export const removeEntry = (key) => {
  try {
    storage.delete(key);
  } catch (e) {
    console.warn(e);
  }
};

export const overwriteListData = (setter, overwriteFunc) => {
  setter((prevState) => [
    ...(prevState || []).map((listItem) => Object.assign({}, listItem, overwriteFunc(listItem))),
  ]);
};

export const overwriteSelectedListData = (setter, listKey, overwriteFunc) => {
  setter((prevData) =>
    Object.assign({}, prevData, {
      [listKey]: overwriteFunc(prevData[listKey]),
    }),
  );
};

export const findAndReplaceEntry = (list, itemKey, replaceTask) =>
  list.map((entry) =>
    entry.key === itemKey ? Object.assign({}, entry, replaceTask(entry)) : entry,
  );
