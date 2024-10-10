import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { UIProvider } from '@/context/UIContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from './app/store';
import './index.css';

const googleOAuthClientId = (import.meta as any).env.VITE_googleOAuthClientId;
// const googleOAuthClientId = '834717821423-ctb8oim33m226fq8ucmghq9jrhr75ev2.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleOAuthClientId}>
      <Provider store={store}>
        <UIProvider>
          <App />
        </UIProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
