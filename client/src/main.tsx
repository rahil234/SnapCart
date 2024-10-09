import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { UIProvider } from '@/context/UIContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from './app/store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId='834717821423-q5q8p6u26fne4ip0dgq453saf6om0qut.apps.googleusercontent.com'>
      <Provider store={store}>
        <UIProvider>
          <App />
        </UIProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
