import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (key, value, fallback = undefined) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    if (fallback) {
      await storeData(key, fallback);
    } else {
      return fallback;
    }
  }
};

export const getStoredData = async (key, fallback = undefined) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return fallback;
  }
};

export const getAllStoredKeys = async (fallback = []) => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (e) {
    return fallback;
  }
};

export const removeEntry = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
