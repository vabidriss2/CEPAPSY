import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminProvider } from './lib/AdminContext';
import { DataProvider } from './lib/DataContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AdminProvider>
  </StrictMode>,
);
