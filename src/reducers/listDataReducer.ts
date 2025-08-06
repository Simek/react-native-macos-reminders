import { ReminderListItemType } from '~/types';

export enum ListActionType {
  SET_DATA = 'SET_DATA',
  OVERWRITE_LIST = 'OVERWRITE_LIST',
}

export type ListActions =
  | { type: ListActionType.SET_DATA; payload: ReminderListItemType[] }
  | {
      type: ListActionType.OVERWRITE_LIST;
      payload: (item: ReminderListItemType) => Partial<ReminderListItemType>;
    };

export function listReducer(
  state: ReminderListItemType[],
  action: ListActions,
): ReminderListItemType[] {
  switch (action.type) {
    case ListActionType.SET_DATA:
      return action.payload;
    case ListActionType.OVERWRITE_LIST:
      return state.map((item) => ({
        ...item,
        ...action.payload(item),
      }));
    default:
      return state;
  }
}
