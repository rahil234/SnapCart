import React from 'react';
import { Navigate } from 'react-router';

import AdminLayout from '@/Layouts/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import ComingSoon from '@/pages/admin/ComingSoon';
import AdminUsers from '@/pages/admin/AdminUsers';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminCategory from '@/pages/admin/AdminCategory';
import AdminDashboard from '@/pages/admin/AdminDashboard';
// import AdminBanners from '@/pages/admin/AdminBanners';
// import AdminCoupons from '@/pages/admin/AdminCoupons';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCoupons from '@/pages/admin/AdminCoupons';
import AdminBanners from '@/pages/admin/AdminBanners';
import AdminOffers from '@/pages/admin/AdminOffers';
import AdminOrders from '@/pages/admin/AdminOrders';
import SalesReport from '@/pages/admin/AdminSalesReport';
// import SalesReport from '@/pages/admin/AdminSalesReport';

const AdminRoutes = [
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLogin /> },
      {
        path: '',
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <Navigate to="/admin/dashboard" /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'banners', element: <AdminBanners /> },
          { path: 'user-management', element: <AdminUsers /> },
          { path: 'coupons', element: <AdminCoupons /> },
          { path: 'categories', element: <AdminCategory /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'offers', element: <AdminOffers /> },
          { path: 'sales', element: <SalesReport /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'deals', element: <ComingSoon /> },
          { path: 'inbox', element: <ComingSoon /> },
          { path: 'settings', element: <ComingSoon /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
