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
import AdminCoupons from '@/pages/admin/AdminCoupons';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminOffers from '@/pages/admin/AdminOffers';
import SalesReport from '@/pages/admin/AdminSalesReport';


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
                    { path: 'coupons', element: <AdminCoupons /> },
                    { path: 'categories', element: <AdminCategory /> },
                    { path: 'products', element: <AdminProducts /> },
                    { path: 'offers', element: <AdminOffers /> },
                    { path: 'orders', element: <AdminOrders /> },
                    { path: 'deals', element: <ComingSoon /> },
                    { path: 'sales-report', element: <SalesReport /> },
                    { path: 'settings', element: <ComingSoon /> },
                ],
            },
        ],
    },
];

export default AdminRoutes;