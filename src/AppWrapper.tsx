import { AppProvider } from '~/context/AppContext';
import { DataProvider } from '~/context/DataContext';

import App from './App';

export default function AppWrapper() {
  return (
    <AppProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AppProvider>
  );
}
