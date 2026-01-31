import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import NotAuthorised from './pages/NotAuthorised';
import Page404 from './pages/Page404';
import store from './app/store';
import { refreshAuthToken } from './features/auth/authSlice';
import UserRoutes from '@/routes/UserRoutes';
// import AdminRoutes from '@/routes/AdminRoutes';
// import SellerRoutes from '@/routes/SellerRoutes';

const routes = createBrowserRouter([
  ...UserRoutes,
  // ...SellerRoutes,
  // ...AdminRoutes,
  { path: '/not-authorized', element: <NotAuthorised /> },
  { path: '*', element: <Page404 /> },
]);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const queryClient = new QueryClient();

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('sessionActive'))
        await store.dispatch(refreshAuthToken());
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
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <RouterProvider router={routes} />
    </QueryClientProvider>
  );
};

export default App;
