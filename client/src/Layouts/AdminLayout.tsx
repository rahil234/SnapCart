import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { Outlet, NavLink } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { logoutUser } from '@/features/auth/authSlice';

interface SidebarProps {
  adminLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ adminLogout }) => (

  <div className="w-84 bg-white h-screen p-4 px-8 flex flex-col">
    <h1 className="text-2xl font-bold mb-8">
      <span className="text-yellow-400">Snap</span>
      <span className="text-green-600">Cart</span>
    </h1>
    <nav className="flex-1 flex flex-col space-y-1">
      {[
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Inbox', path: '/admin/inbox' },
        { name: 'Users', path: '/admin/user-management' },
        { name: 'Sellers', path: '/admin/seller-management' },
        { name: 'Banners', path: '/admin/banners' },
        { name: 'Categories', path: '/admin/categories' },
        { name: 'Products', path: '/admin/products' },
        { name: 'Coupons', path: '/admin/coupons' },
        { name: 'Offers', path: '/admin/offers' },
        { name: 'Deals', path: '/admin/deals' },
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Settings', path: '/admin/settings' },
      ].map(item => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `py-2 px-4 rounded-lg ${isActive
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
    <div className="mt-auto text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg"
      onClick={adminLogout}>
      Logout
    </div>
  </div>
);

const Header = () => (
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
      {/* Lamguage disabled */}
      {/* <div className="flex items-center space-x-2">
        <img
          src="/placeholder.svg?height=24&width=24"
          alt="UK flag"
          className="w-6 h-6 rounded-full"
        />
        <span className="text-gray-600">English</span>
        <ChevronDown size={16} className="text-gray-400" />
      </div> */}
      <div className="flex items-center space-x-2">
        <img
          src="/placeholder.svg?height=32&width=32"
          alt="User avatar"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <div className="text-sm font-semibold">Moni Roy</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </div>
  </header>
);

function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const adminLogout = () => {
    console.log('Admin logout');
    navigate('/admin/login');
    dispatch(logoutUser());
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <Sidebar adminLogout={adminLogout} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
