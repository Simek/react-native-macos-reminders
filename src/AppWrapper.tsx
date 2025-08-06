import App from './App';

import { AppProvider } from '~/context/AppContext';
import { DataProvider } from '~/context/DataContext';

export default function AppWrapper() {
  return (
    <AppProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AppProvider>
  );
}
