import styles from '../styles';
import CONSTANTS from './constants';

export const getListColor = (key) =>
  !CONSTANTS.KEYS.includes(key) ? { semantic: 'systemBlueColor' } : CONSTANTS.COLORS[key];

export const getNewListEntry = () => {
  const key = `list-${Date.now()}`;
  return {
    title: 'New list',
    key,
    selected: true,
    editMode: true,
  };
};

export const getSpecialListContent = (data, multiListMapper, filter = () => true) =>
  Object.keys(data)
    .filter((key) => key.startsWith('list-'))
    .map((key) => multiListMapper(key))
    .filter(filter)
    .filter(Boolean);

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

const remindersSort = (a, b) => a.done - b.done || a.createdAt > b.createdAt;

export const processRemindersList = (list, completedVisible) =>
  list.filter((entry) => (completedVisible ? true : !entry.done)).sort(remindersSort);

const searchHit = (searchQuery, text) =>
  text && text.toLowerCase().includes(searchQuery.toLowerCase());

export const filterSearchHits = (searchQuery, { text, textNote }) =>
  searchHit(searchQuery, text) || searchHit(searchQuery, textNote);
