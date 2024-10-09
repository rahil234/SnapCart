import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { UIProvider } from '@/context/UIContext';
import App from './App';
import store from './app/store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <UIProvider>
        <App />
      </UIProvider>
    </Provider>
  </React.StrictMode>
);