import { Outlet } from 'react-router';

import Home from '@/pages/user/HomePage';
import CartPage from '@/pages/user/CartPage';
import UserLayout from '@/Layouts/UserLayout';
import ReferPage from '@/pages/user/ReferPage';
import SearchPage from '@/pages/user/SearchPage';
import { UIProvider } from '@/context/UIContext';
import ProductPage from '@/pages/user/ProductPage';
import CategoryPage from '@/pages/user/CategoryPage';
import MyAccount from '@/pages/user/MyAccount/MyAccount';
import ChangePasswordPage from '@/pages/user/ChangePasswordPage';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';

function Root() {
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
