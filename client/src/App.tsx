import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import ProtectedRoute from './components/user/ProtectedRoute';
import UserLayout from '@/Layouts/UserLayout';
import Home from '@/pages/user/HomePage';
import ProductPage from '@/pages/user/ProductPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCategory from '@/pages/admin/AdminCategory';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminSellers from '@/pages/admin/AdminSellers';
import ComingSoon from '@/pages/admin/ComingSoon';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminBanners from '@/pages/admin/AdminBanners';
import SellerDashboard from '@/pages/seller/SellerDashboard';
import SellerProducts from '@/pages/seller/SellerProducts';
import SellerLogin from '@/pages/seller/SellerLogin';
import SellerLayout from '@/Layouts/SellerLayout';
import NotAuthorised from './pages/NotAuthorised';
import Page404 from './pages/Page404';
import CartPage from './pages/user/CartPage';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '',
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
          {
            path: 'cart',
            element: <CartPage />,
          }
        ],
      }
    ]
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
          { path: 'inbox', element: <ComingSoon /> },
          { path: 'banners', element: <AdminBanners /> },
          { path: 'user-management', element: <AdminUsers /> },
          { path: 'seller-management', element: <AdminSellers /> },
          { path: 'coupons', element: <ComingSoon /> },
          { path: 'categories', element: <AdminCategory /> },
          { path: 'offers', element: <ComingSoon /> },
          { path: 'order-lists', element: <ComingSoon /> },
          { path: 'deals', element: <ComingSoon /> },
          { path: 'settings', element: <ComingSoon /> },
        ],
      },
    ],
  },
  {
    path: '/seller',
    children: [
      { path: 'login', element: <SellerLogin /> },
      {
        path: '',
        element:
          <ProtectedRoute requiredRoles={['seller']}>
            <SellerLayout />
          </ProtectedRoute>,
        children: [
          { path: '', element: <Navigate to="/seller/dashboard" /> },
          { path: 'dashboard', element: <SellerDashboard /> },
          { path: 'inbox', element: <ComingSoon /> },
          { path: 'products', element: <SellerProducts /> },
          { path: 'order-lists', element: <ComingSoon /> },
          { path: 'settings', element: <ComingSoon /> },
        ],
      },
    ],
  },
  {
    path: '/not-authorized', element: <NotAuthorised />
  },
  {
    path: '*', element: <Page404 />
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
