import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import store from '@/app/store';
import { fetchCart } from '@/features/cart/cartSlice';
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
import PaymentFailurePage from '@/pages/user/PaymentFailurePage';
import OrderFailurePage from '@/pages/user/OrderFailurePage';
import { AuthState } from '@/features/auth/authSlice';
import SearchPage from '@/pages/user/SearchPage';
import ReferPage from '@/pages/user/ReferPage';

function Root() {
  const { user } = useSelector((state: { auth: AuthState }) => state.auth);
  useEffect(() => {
    if (user && user?.role === 'customer') store.dispatch(fetchCart());
    else store.dispatch({ type: 'cart/clearCart' });
  }, [user]);
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
          {
            path: 'search',
            element: <SearchPage />,
          },
          {
            path: 'product/:productId',
            element: <ProductPage />,
          },
          {
            path: 'category/:category',
            element: <CategoryPage />,
          },
          {
            path: 'cart',
            element: <CartPage />,
          },
          { path: 'refer', element: <ReferPage /> },
        ],
      },
      { path: 'my-account', element: <ProfilePage /> },
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
      { path: 'payment-failure', element: <PaymentFailurePage /> },
      { path: 'order-failure', element: <OrderFailurePage /> },
    ],
  },
];

export default UserRoutes;
