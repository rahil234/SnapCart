import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCategory from '@/pages/admin/AdminCategory';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminSellers from '@/pages/admin/AdminSellers';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminBanners from '@/pages/admin/AdminBanners';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ComingSoon from '@/pages/admin/ComingSoon';


const AdminRoutes = [
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
];

export default AdminRoutes;