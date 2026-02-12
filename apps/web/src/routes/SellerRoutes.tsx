import React from 'react';
import { Navigate } from 'react-router';

import ComingSoon from '@/pages/admin/ComingSoon';
import SellerLayout from '@/Layouts/SellerLayout';
import SellerLogin from '@/pages/seller/SellerLogin';
import ProtectedRoute from '@/routes/ProtectedRoute';
import SellerOrders from '@/pages/seller/SellerOrders';
import SellerProducts from '@/pages/seller/SellerProducts';
import SellerDashboard from '@/pages/seller/SellerDashboard';
import SellerSalesReport from '@/pages/seller/SellerSalesReport';

const SellerRoutes = [
  {
    path: '/seller',
    children: [
      { path: 'login', element: <SellerLogin /> },
      {
        path: '',
        element: (
          <ProtectedRoute requiredRoles={['SELLER']}>
            <SellerLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <Navigate to="/seller/dashboard" /> },
          { path: 'dashboard', element: <SellerDashboard /> },
          { path: 'dashboard', element: <Navigate to="/seller/products" /> },
          { path: 'inbox', element: <ComingSoon /> },
          { path: 'products', element: <SellerProducts /> },
          { path: 'orders', element: <SellerOrders /> },
          { path: 'sales-report', element: <SellerSalesReport /> },
          { path: 'settings', element: <ComingSoon /> },
        ],
      },
    ],
  },
];

export default SellerRoutes;
