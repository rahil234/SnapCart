import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster as HotToaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import store from '@/store/store';
import Page404 from '@/pages/Page404';
import UserRoutes from '@/routes/UserRoutes';
import AdminRoutes from '@/routes/AdminRoutes';
import SellerRoutes from '@/routes/SellerRoutes';
import { Toaster } from '@/components/ui/sonner';
import NotAuthorised from '@/pages/NotAuthorised';
import { fetchUser } from '@/store/auth/authSlice';
import { TooltipProvider } from '@/components/ui/tooltip';

const routes = createBrowserRouter([
  ...UserRoutes,
  ...SellerRoutes,
  ...AdminRoutes,
  { path: '/not-authorized', element: <NotAuthorised /> },
  { path: '*', element: <Page404 /> },
]);

const App: React.FC = () => {
  const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const queryClient = new QueryClient();

  useEffect(() => {
    (async () => {
      await store.dispatch(fetchUser());
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div
          className="spinner"
          style={{
            border: '4px solid rgba(0, 0, 0, 0.1)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            borderTopColor: '#3498db',
            animation: 'spin 1s ease-in-out infinite',
          }}
        ></div>
        <style>
          {`
          @keyframes spin {
            to { transform: rotate(360deg); }
            }
            `}
        </style>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <Analytics />
      <Provider store={store}>
        <Toaster />
        <TooltipProvider>
          <HotToaster position="top-right" reverseOrder={false} />
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={routes} />
          </QueryClientProvider>
        </TooltipProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
