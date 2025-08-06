import { ReminderItemType, RemindersType } from '~/types';
import { getNewReminderData } from '~/utils/helpers';

export enum DataActionType {
  SET_DATA = 'SET_DATA',
  ADD_REMINDER = 'ADD_REMINDER',
  OVERWRITE_SELECTED_LIST_DATA = 'OVERWRITE_SELECTED_LIST_DATA',
  REMOVE_ALL_REMINDERS_BY_LIST = 'REMOVE_ALL_REMINDERS_BY_LIST',
}

export type DataActions =
  | { type: DataActionType.SET_DATA; payload: RemindersType }
  | {
      type: DataActionType.ADD_REMINDER;
      payload: {
        listKey: string;
      };
    }
  | {
      type: DataActionType.OVERWRITE_SELECTED_LIST_DATA;
      payload: {
        listKey: string;
        fn: (items: ReminderItemType[]) => ReminderItemType[];
      };
    }
  | {
      type: DataActionType.REMOVE_ALL_REMINDERS_BY_LIST;
      payload: {
        listKey: string;
        keys?: string[];
      };
    };

export function dataReducer(state: RemindersType, action: DataActions): RemindersType {
  switch (action.type) {
    case DataActionType.SET_DATA:
      return action.payload;
    case DataActionType.ADD_REMINDER: {
      const { listKey } = action.payload;
      return {
        ...state,
        [listKey]: {
          ...state[listKey],
          reminders: [...state[listKey].reminders, getNewReminderData()],
        },
      };
    }
    case DataActionType.OVERWRITE_SELECTED_LIST_DATA: {
      const { listKey, fn } = action.payload;
      return {
        ...state,
        [listKey]: {
          ...state[listKey],
          reminders: fn(state[listKey].reminders),
        },
      };
    }
    case DataActionType.REMOVE_ALL_REMINDERS_BY_LIST: {
      const { listKey, keys = [] } = action.payload;

      if (keys.length > 0) {
        return {
          ...state,
          [listKey]: {
            ...state[listKey],
            reminders: state[listKey].reminders.filter((entry) => !keys.includes(entry.key)),
          },
        };
      } else {
        const { [listKey]: _, ...rest } = state;
        return rest;
      }
    }
    default:
      return state;
  }
}
