import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { DataActionType, dataReducer } from '~/reducers/dataReducer';
import { ListActionType, listReducer } from '~/reducers/listDataReducer';
import { ReminderItemType, ReminderListItemType, RemindersType } from '~/types.ts';
import { INIT_STORE } from '~/utils/constants.ts';
import { getStoredData, writeDataToStorage, writeListDataToStorage } from '~/utils/storage.ts';

export type DataContextType = {
  data: RemindersType;
  setData: (data: RemindersType) => void;
  overwriteSelectedListData: (
    listKey: string,
    fn: (items: ReminderItemType[]) => ReminderItemType[],
  ) => void;
  removeAllRemindersByList: (listKey: string, keys?: string[]) => void;
  listData: ReminderListItemType[];
  setListData: (listData: ReminderListItemType[]) => void;
  overwriteListData: (fn: (item: ReminderListItemType) => Partial<ReminderListItemType>) => void;
};

export const DataContext = createContext<DataContextType>({
  data: INIT_STORE,
  setData: notInitialized,
  overwriteSelectedListData: notInitialized,
  removeAllRemindersByList: notInitialized,
  listData: [],
  setListData: notInitialized,
  overwriteListData: notInitialized,
});

export function DataProvider({ children }: PropsWithChildren) {
  const [data, dispatchData] = useReducer(dataReducer, INIT_STORE);
  const [listData, dispatchList] = useReducer(listReducer, []);

  useEffect(() => {
    setData(getStoredData<RemindersType>('remindersData', data));
    setListData(getStoredData<ReminderListItemType[]>('remindersLists', listData));
  }, []);

  useEffect(() => {
    writeDataToStorage(data);
  }, [data]);

  useEffect(() => {
    writeListDataToStorage(listData);
  }, [listData]);

  function setData(payload: RemindersType) {
    dispatchData({ type: DataActionType.SET_DATA, payload });
  }

  function overwriteSelectedListData(
    listKey: string,
    fn: (items: ReminderItemType[]) => ReminderItemType[],
  ) {
    dispatchData({
      type: DataActionType.OVERWRITE_SELECTED_LIST_DATA,
      payload: { listKey, fn },
    });
  }

  function removeAllRemindersByList(listKey: string, keys?: string[]) {
    dispatchData({
      type: DataActionType.REMOVE_ALL_REMINDERS_BY_LIST,
      payload: { listKey, keys },
    });
  }

  function setListData(payload: ReminderListItemType[]) {
    dispatchList({ type: ListActionType.SET_DATA, payload });
  }

  function overwriteListData(fn: (item: ReminderListItemType) => Partial<ReminderListItemType>) {
    dispatchList({ type: ListActionType.OVERWRITE_LIST, payload: fn });
  }

  const contextValue = useMemo(
    () => ({
      data,
      setData,
      overwriteSelectedListData,
      removeAllRemindersByList,
      listData,
      setListData,
      overwriteListData,
    }),
    [data, listData],
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}

export function useDataContext(): DataContextType {
  return useContext(DataContext);
}

function notInitialized(): never {
  throw new Error('DataContext not initialized');
}
