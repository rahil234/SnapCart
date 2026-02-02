import React from 'react';
import { Navigate } from 'react-router';

import AdminLayout from '@/Layouts/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import ComingSoon from '@/pages/admin/ComingSoon';
import AdminUsers from '@/pages/admin/AdminUsers';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';
// import AdminCategory from '@/pages/admin/AdminCategory';
// import AdminSellers from '@/pages/admin/AdminSellers';
// import AdminBanners from '@/pages/admin/AdminBanners';
// import AdminCoupons from '@/pages/admin/AdminCoupons';
// import AdminProducts from '@/pages/admin/AdminProducts';
// import AdminOrders from '@/pages/admin/AdminOrders';
// import AdminOffers from '@/pages/admin/AdminOffers';
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
          // { path: 'banners', element: <AdminBanners /> },
          { path: 'user-management', element: <AdminUsers /> },
          // { path: 'seller-management', element: <AdminSellers /> },
          // { path: 'coupons', element: <AdminCoupons /> },
          // { path: 'categories', element: <AdminCategory /> },
          // { path: 'products', element: <AdminProducts /> },
          // { path: 'offers', element: <AdminOffers /> },
          // { path: 'orders', element: <AdminOrders /> },
          // { path: 'sales', element: <SalesReport /> },
          { path: 'deals', element: <ComingSoon /> },
          { path: 'inbox', element: <ComingSoon /> },
          { path: 'settings', element: <ComingSoon /> },
        ],
      },
    ],
  },
];

export default AdminRoutes;
