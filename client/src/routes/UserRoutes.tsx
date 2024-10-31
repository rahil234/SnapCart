import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Home from '@/pages/user/HomePage';
import ProductPage from '@/pages/user/ProductPage';
import CartPage from '@/pages/user/CartPage';
import ProfilePage from '@/pages/user/ProfilePage';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';
import { UIProvider } from '@/context/UIContext';
import ChangePasswordPage from '@/pages/user/ChangePassword';

const UserRoutes = [
    {
        path: '/',
        children: [
            {
                path: '',
                element:
                    <UIProvider>
                        <UserLayout />
                    </UIProvider>,
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
            },
            { path: 'profile', element: <ProfilePage /> },
            { path: 'change-password', element: <ChangePasswordPage /> },
            { path: 'forgot-password', element: <ForgotPasswordPage /> },
        ]
    },
];

export default UserRoutes;