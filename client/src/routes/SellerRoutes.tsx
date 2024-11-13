import React from 'react';
import { Navigate } from 'react-router-dom';
import SellerLayout from '@/Layouts/SellerLayout';
import SellerDashboard from '@/pages/seller/SellerDashboard';
import SellerLogin from '@/pages/seller/SellerLogin';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ComingSoon from '@/pages/admin/ComingSoon';
import SellerOrders from '@/pages/seller/SellerOrders';
import SellerProducts from '@/pages/seller/SellerProducts';

const SellerRoutes = [
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
                    { path: 'orders', element: <SellerOrders /> },
                    { path: 'settings', element: <ComingSoon /> },
                ],
            },
        ],
    },
];

export default SellerRoutes;