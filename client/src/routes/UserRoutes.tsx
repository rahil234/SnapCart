import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Home from '@/pages/user/HomePage';
import ProductPage from '@/pages/user/ProductPage';
import CartPage from '@/pages/user/CartPage';
import { UIProvider } from '@/context/UIContext';

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
            }
        ]
    },
];

export default UserRoutes;