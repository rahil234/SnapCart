import { Outlet } from 'react-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import store from '@/app/store';
import Home from '@/pages/user/HomePage';
import UserLayout from '@/Layouts/UserLayout';
import { UIProvider } from '@/context/UIContext';
import ProductPage from '@/pages/user/ProductPage';
import { AuthState } from '@/features/auth/authSlice';
// import { fetchCart } from '@/features/cart/cartSlice';
import ChangePasswordPage from '@/pages/user/ChangePasswordPage';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';
import MyAccount from '@/pages/user/MyAccount/MyAccount';
import CategoryPage from '@/pages/user/CategoryPage';
import ReferPage from '@/pages/user/ReferPage';

function Root() {
  const { user } = useSelector((state: { auth: AuthState }) => state.auth);
  // useEffect(() => {
  // if (user && user?.role === 'customer') store.dispatch(fetchCart());
  // else store.dispatch({ type: 'cart/clearCart' });
  // }, [user]);
  return <Outlet />;
}

const UserRoutes = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: (
          <UIProvider>
            <UserLayout />
          </UIProvider>
        ),
        children: [
          {
            path: '',
            element: <Home />,
          },
          // {
          //   path: 'search',
          //   element: <SearchPage />,
          // },
          {
            path: 'product/:productId',
            element: <ProductPage />,
          },
          {
            path: 'category/:category',
            element: <CategoryPage />,
          },
          // {
          //   path: 'cart',
          //   element: <CartPage />,
          // },
          { path: 'refer', element: <ReferPage /> },
        ],
      },
      { path: 'my-account', element: <MyAccount /> },
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      // { path: 'checkout', element: <CheckoutPage /> },
      // { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
      // { path: 'payment-failure', element: <PaymentFailurePage /> },
      // { path: 'order-failure', element: <OrderFailurePage /> },
    ],
  },
];

export default UserRoutes;
