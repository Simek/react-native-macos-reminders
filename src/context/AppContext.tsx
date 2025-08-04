import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { NativeMethods } from 'react-native-macos';

import { PREDEFINED_KEYS } from '~/utils/constants.ts';

type AppContextType = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedKey: string;
  setSelectedKey: Dispatch<SetStateAction<string>>;
  isSearchMode: boolean;
  setSearchMode: Dispatch<SetStateAction<boolean>>;
  completedVisible: boolean;
  setCompletedVisible: Dispatch<SetStateAction<boolean>>;
  lastSelectedTarget: NativeMethods | null;
  setLastSelectedTarget: Dispatch<SetStateAction<NativeMethods | null>>;
};

export const AppContext = createContext({
  searchQuery: '',
  setSearchQuery: (_: string) => notInitialized,
  selectedKey: PREDEFINED_KEYS[0],
  setSelectedKey: (_: string) => notInitialized,
  isSearchMode: false,
  setSearchMode: (_: boolean) => notInitialized,
  completedVisible: true,
  setCompletedVisible: (_: boolean) => notInitialized,
  lastSelectedTarget: null,
  setLastSelectedTarget: (_: NativeMethods | null) => notInitialized,
} as AppContextType);

export function AppProvider({ children }: PropsWithChildren) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(PREDEFINED_KEYS[0]);
  const [isSearchMode, setSearchMode] = useState<boolean>(false);
  const [completedVisible, setCompletedVisible] = useState<boolean>(true);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<NativeMethods | null>(null);

  const contextValue = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      selectedKey,
      setSelectedKey,
      isSearchMode,
      setSearchMode,
      completedVisible,
      setCompletedVisible,
      lastSelectedTarget,
      setLastSelectedTarget,
    }),
    [searchQuery, selectedKey, isSearchMode, lastSelectedTarget, completedVisible],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

function notInitialized() {
  throw new Error('AppContext not initialized');
}
