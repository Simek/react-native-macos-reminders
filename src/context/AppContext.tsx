import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NativeMethods } from 'react-native-macos';

import { PREDEFINED_KEYS } from '~/utils/constants';

type AppContextType = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedKey: string;
  setSelectedKey: Dispatch<SetStateAction<string>>;
  previousSelectedKey: string;
  setPreviousSelectedKey: Dispatch<SetStateAction<string>>;
  isSearchMode: boolean;
  setSearchMode: Dispatch<SetStateAction<boolean>>;
  lastSelectedTarget: NativeMethods | null;
  setLastSelectedTarget: Dispatch<SetStateAction<NativeMethods | null>>;
};

export const AppContext = createContext({
  searchQuery: '',
  setSearchQuery: (_: string) => notInitialized,
  selectedKey: PREDEFINED_KEYS[0],
  setSelectedKey: (_: string) => notInitialized,
  previousSelectedKey: PREDEFINED_KEYS[0],
  setPreviousSelectedKey: (_: string) => notInitialized,
  isSearchMode: false,
  setSearchMode: (_: boolean) => notInitialized,
  lastSelectedTarget: null,
  setLastSelectedTarget: (_: NativeMethods | null) => notInitialized,
} as AppContextType);

export function AppProvider({ children }: PropsWithChildren) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(PREDEFINED_KEYS[0]);
  const [previousSelectedKey, setPreviousSelectedKey] = useState(PREDEFINED_KEYS[0]);
  const [isSearchMode, setSearchMode] = useState<boolean>(false);
  const [lastSelectedTarget, setLastSelectedTarget] = useState<NativeMethods | null>(null);

  useEffect(() => {
    if (isSearchMode) {
      setPreviousSelectedKey(selectedKey);
      setSelectedKey('all');
    } else {
      setSelectedKey(previousSelectedKey);
    }
  }, [isSearchMode]);

  const contextValue = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      selectedKey,
      setSelectedKey,
      previousSelectedKey,
      setPreviousSelectedKey,
      isSearchMode,
      setSearchMode,
      lastSelectedTarget,
      setLastSelectedTarget,
    }),
    [searchQuery, selectedKey, previousSelectedKey, isSearchMode, lastSelectedTarget],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

function notInitialized() {
  throw new Error('AppContext not initialized');
}
