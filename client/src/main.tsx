import React from 'react';
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from './app/store';
import './index.css';
import { ImportMeta } from 'shared/types';

const googleOAuthClientId = (import.meta as unknown as ImportMeta).env.VITE_googleOAuthClientId;

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={googleOAuthClientId}>
      < Provider store={store} >
        <TooltipProvider>
          <Toaster />
          <App />
        </TooltipProvider>
      </Provider >
    </GoogleOAuthProvider>
  //     <React.StrictMode>
  // </React.StrictMode>
);
