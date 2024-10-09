import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginMain from '@/components/user/Login/LoginMain';
import { UIContext } from '@/context/UIContext';
import { logout } from '@/features/auth/authSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const isAuthenticated = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) =>
      state.auth.isAuthenticated
  );
  const { isLoginOverlayOpen, showLoginOverlay } = useContext(UIContext);

  return (
    <>
      <header className="bg-white fixed w-screen shadow-sm py-3 px-6 flex justify-between items-center gap-4 ">
        <h1 className="text-2xl font-bold text-green-600">SnapCart</h1>
        <Input id="username" placeholder='Search for "Milk" ' />
        <div className="flex gap-2">
          {isAuthenticated ? (
            <Button onClick={handleLogout}>User</Button>
          ) : (
            <Button onClick={showLoginOverlay}>Login</Button>
          )}
          <Button variant="outline" size="sm" className="bg-[#0F831F]">
            Cart
          </Button>
        </div>
      </header>
      {isLoginOverlayOpen && <LoginMain />}
    </>
  );
};

export default NavBar;
