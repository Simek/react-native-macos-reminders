import App from './App.tsx';

import { AppProvider } from '~/context/AppContext.tsx';
import { DataProvider } from '~/context/DataContext.tsx';

export default function AppWrapper() {
  return (
    <AppProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AppProvider>
  );
}
