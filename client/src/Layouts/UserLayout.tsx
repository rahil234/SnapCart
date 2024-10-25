import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import NavBar from '@/components/user/NavBar';
import Footer from '@/components/user/Footer';
import { AppDispatch } from '@/app/store';
import { fetchUserDetails } from '@/features/auth/authSlice';
import { UIProvider } from '@/context/UIContext';
import { UIContext } from '@/context/UIContext';
import LoginMain from '@/components/user/Login/LoginMain';

function AdminLayout() {
  const { isLoginOverlayOpen } = useContext(UIContext);
  const dispatch = useDispatch() as AppDispatch;
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <UIProvider>
      <NavBar />
      {isLoginOverlayOpen && <LoginMain />}
      <div className="pt-[63px] min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </UIProvider>
  );
}

export default AdminLayout;
