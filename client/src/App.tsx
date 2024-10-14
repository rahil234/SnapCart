import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import ProtectedRoute from './components/user/ProtectedRoute/ProtectedRoute';
import Home from '@/pages/user/HomePage';
import ProductPage from '@/pages/user/ProductPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCategory from '@/pages/admin/AdminCategory';
import AdminUsers from '@/pages/admin/AdminUsers';
import ComingSoon from '@/pages/admin/ComingSoon';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import UserLayout from '@/Layouts/UserLayout';


const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/product/:productId',
        element: <ProductPage />,
      },
    ],
  },
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLogin /> },
      {
        path: '',
        element:
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>,
        children: [
          { path: '', element: <Navigate to="/admin/dashboard" /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'deals', element: <ComingSoon /> },
          { path: 'coupons', element: <ComingSoon /> },
          { path: 'categories', element: <AdminCategory /> },
          { path: 'offers', element: <ComingSoon /> },
          { path: 'order-lists', element: <ComingSoon /> },
          { path: 'user-management', element: <AdminUsers /> },
          { path: 'inbox', element: <ComingSoon /> },
          { path: 'settings', element: <ComingSoon /> },
        ],
      },
    ],
  },
  {
    path: '/not-authorized', element: <>403</>
  },
  {
    path: '*', element: <>404</>
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
