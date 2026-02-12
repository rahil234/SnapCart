import React from 'react';
import { useSelector } from 'react-redux';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router';

import { logoutUser } from '@/store/auth/authSlice';
import { RootState, useAppDispatch } from '@/store/store';

interface SidebarProps {
  sellerLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sellerLogout }) => (
  <div className="w-84 bg-white h-screen p-4 px-8 flex flex-col">
    <h1 className="text-2xl font-bold mb-8">
      <span className="text-yellow-400">Snap</span>
      <span className="text-green-600">Cart</span>
    </h1>
    <nav className="flex-1 flex flex-col space-y-1">
      {[
        { name: 'Dashboard', path: '/seller/dashboard' },
        { name: 'Inbox', path: '/seller/inbox' },
        { name: 'Products', path: '/seller/products' },
        { name: 'Orders', path: '/seller/orders' },
        { name: 'Sales Report', path: '/seller/sales-report' },
        { name: 'Settings', path: '/seller/settings' },
      ].map(item => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `py-2 px-4 rounded-lg ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
    <div
      className="mt-auto text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg"
      onClick={sellerLogout}
    >
      Logout
    </div>
  </div>
);

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="bg-white p-4 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="text-gray-600" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src="https://avatar.iran.liara.run/public/38"
            alt="User avatar"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="text-sm font-semibold">
              {user?.sellerProfile?.storeName || user?.email || 'Seller'}
            </div>
            <div className="text-xs text-gray-500">Seller</div>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

function SellerLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const sellerLogout = () => {
    console.log('Seller logout');
    dispatch(logoutUser());
    navigate('/seller/login');
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <Sidebar sellerLogout={sellerLogout} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SellerLayout;
