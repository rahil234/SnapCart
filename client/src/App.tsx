import React, { useLayoutEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import NotAuthorised from './pages/NotAuthorised';
import Page404 from './pages/Page404';
import store from './app/store';
import { refreshAuthToken } from './features/auth/authSlice';
import UserRoutes from '@/routes/UserRoutes';
import AdminRoutes from '@/routes/AdminRoutes';
import SellerRoutes from '@/routes/SellerRoutes';

const routes = createBrowserRouter([
  ...UserRoutes,
  ...AdminRoutes,
  ...SellerRoutes,
  { path: '/not-authorized', element: <NotAuthorised /> },
  { path: '*', element: <Page404 /> }
]);


const App: React.FC = () => {

  useLayoutEffect(() => {
    store.dispatch(refreshAuthToken());
  }, []);

  return <RouterProvider router={routes} />;
};

export default App;
