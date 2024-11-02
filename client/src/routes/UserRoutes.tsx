import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Home from '@/pages/user/HomePage';
import ProductPage from '@/pages/user/ProductPage';
import CartPage from '@/pages/user/CartPage';
import ProfilePage from '@/pages/user/ProfilePage';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';
import CheckoutPage from '@/pages/user/CheckoutPage';
import { UIProvider } from '@/context/UIContext';
import ChangePasswordPage from '@/pages/user/ChangePassword';
import { CartProvider } from '@/context/CartContext';

const UserRoutes = [
    {
        path: '/',
        children: [
            {
                path: '',
                element:
                    <UIProvider>
                        <CartProvider>
                            <UserLayout />
                        </CartProvider>
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
            { path: 'checkout', element: <CheckoutPage /> },
        ]
    },
];

export default UserRoutes;
