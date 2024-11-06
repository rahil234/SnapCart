import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Home from '@/pages/user/HomePage';
import ProductPage from '@/pages/user/ProductPage';
import CartPage from '@/pages/user/CartPage';
import ProfilePage from '@/pages/user/MyAccount/MyAccount';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';
import CheckoutPage from '@/pages/user/CheckoutPage';
import CategoryPage from '@/pages/user/CategoryPage';
import { UIProvider } from '@/context/UIContext';
import ChangePasswordPage from '@/pages/user/ChangePassword';
import OrderSuccessPage from '@/pages/user/OrderSuccessPage';



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
                        path: '/category/:category',
                        element: <CategoryPage />,
                    },
                    {
                        path: 'cart',
                        element: <CartPage />,
                    }
                ],
            },
            { path: 'my-account', element: <ProfilePage /> },
            { path: 'change-password', element: <ChangePasswordPage /> },
            { path: 'forgot-password', element: <ForgotPasswordPage /> },
            { path: 'checkout', element: <CheckoutPage /> },
            { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
        ]
    },
];

export default UserRoutes;
