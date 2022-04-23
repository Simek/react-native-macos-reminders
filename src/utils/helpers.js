import styles from '../styles';
import CONSTANTS from './constants';

export const getListColor = (key) =>
  !CONSTANTS.KEYS.includes(key) ? { semantic: 'systemBlueColor' } : CONSTANTS.COLORS[key];

export const getListCount = (data, item) =>
  data && data[item.key] ? data[item.key].filter((entry) => !entry.done).length : 0;

export const getTotalCount = (data, filterFunc = (e) => e) =>
  Object.keys(data)
    .filter((key) => key.startsWith('list-'))
    .map((key) => data[key].filter(filterFunc).length)
    .reduce((acc, value) => acc + value, 0);

export const getTitle = (list = [], key) => list.find((item) => item.key === key)?.title;

export const getHeaderStyle = (key, customStyles = undefined) => {
  return [
    styles.contentHeader,
    customStyles ? customStyles : styles.contentHeaderCustom,
    { color: getListColor(key) },
  ];
};

export const remindersSort = (a, b) => a.done - b.done || a.createdAt > b.createdAt;
