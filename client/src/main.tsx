import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from './app/store';
import './index.css';
import { ImportMeta } from '@/types';
import { Toaster as HotToaster } from 'react-hot-toast';

const GOOGLE_OAUTH_CLIENT_ID = (import.meta as unknown as ImportMeta).env
  .VITE_GOOGLE_OAUTHCLIENTID;

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <Provider store={store}>
        <TooltipProvider>
          <Toaster />
          <HotToaster
            position="top-right"
            reverseOrder={false}
          />
          <App />
        </TooltipProvider>
      </Provider>
    </GoogleOAuthProvider>
  // </React.StrictMode>
);
