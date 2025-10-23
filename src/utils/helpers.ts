import { OpaqueColorValue, PlatformColor, TextStyle } from 'react-native-macos';

import sharedStyles from '~/sharedStyles';
import {
  ReminderItemSection,
  ReminderItemType,
  ReminderListItemType,
  RemindersType,
} from '~/types';

import { COLORS, PREDEFINED_KEYS } from './constants';

export function getListColor(key: string): OpaqueColorValue {
  if (!PREDEFINED_KEYS.includes(key)) {
    return PlatformColor('systemBlue');
  }
  return COLORS[key];
}

export function getNewListEntry(): ReminderListItemType {
  const key = `list-${Date.now()}`;
  return {
    title: 'New list',
    key,
    selected: true,
    editMode: true,
    showCompleted: true,
  };
}

export function getSpecialListContent(
  data: RemindersType,
  multiListMapper: (key: string) => ReminderItemSection,
  filter?: (item: ReminderItemSection) => boolean,
) {
  return Object.keys(data)
    .filter((entry) => entry.startsWith('list-'))
    .map(multiListMapper)
    .filter((item) => Boolean(item) && (filter && item ? filter(item) : true));
}

export function getListCount(data: RemindersType, item: Pick<ReminderItemType, 'key'>): number {
  if (!data || !data[item.key]) {
    return 0;
  }
  return data[item.key].reminders.filter((entry) => !entry.done).length;
}

export function getTotalCount(
  data?: RemindersType,
  filterFunc: (entry: any) => boolean = () => true,
) {
  if (!data) {
    return 0;
  }
  return Object.keys(data)
    .filter((entry) => entry.startsWith('list-'))
    .map((entry) => data[entry].reminders.filter(filterFunc).length)
    .reduce((acc, value) => acc + value, 0);
}

export function getRemindersCounts(data: RemindersType) {
  const totalCount = getTotalCount(data);
  const allCount = getTotalCount(data, (entry) => !entry.done);
  const allCompletedCount = totalCount - allCount;
  const flaggedCount = getTotalCount(data, (entry) => entry.flagged && !entry.done);
  const flaggedCompletedCount = getTotalCount(data, (entry) => entry.flagged && entry.done);

  return { totalCount, allCount, allCompletedCount, flaggedCount, flaggedCompletedCount };
}

export function getTitle(list: ReminderListItemType[], key: string) {
  return list.find((item) => item.key === key)?.title;
}

export function getHeaderStyle(key: string, customStyles?: TextStyle): TextStyle[] {
  return [
    sharedStyles.contentHeader,
    customStyles ? customStyles : sharedStyles.contentHeaderCustom,
    { color: getListColor(key) },
  ];
}

export function remindersSort(a: ReminderItemType, b: ReminderItemType) {
  const diff = Number(a.done) - Number(b.done);
  if (diff !== 0) {
    return diff;
  }
  return a.createdAt > b.createdAt ? 1 : -1;
}

export function processRemindersList(
  list: ReminderItemType[],
  completedVisible: boolean,
): typeof list {
  return list.filter((entry) => (completedVisible ? true : !entry.done)).sort(remindersSort);
}

function searchHit(searchQuery: string, text?: string | null) {
  if (!text) {
    return false;
  }
  return text.toLowerCase().includes(searchQuery.toLowerCase());
}

export function filterSearchHits(searchQuery: string, item: ReminderItemType): boolean {
  return searchHit(searchQuery, item.text) || searchHit(searchQuery, item.textNote);
}

export function getNewReminderData() {
  const ts = Date.now();
  return {
    text: '',
    key: `entry-${ts}`,
    createdAt: ts,
    completedAt: null,
    flagged: false,
    done: false,
  };
}
