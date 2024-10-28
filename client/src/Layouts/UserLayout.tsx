import React from 'react';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '@/components/user/NavBar';
import Footer from '@/components/user/Footer';
import { UIContext } from '@/context/UIContext';
import LoginMain from '@/components/user/Login/LoginMain';

function UserLayout() {
  const { isLoginOverlayOpen } = useContext(UIContext);

  return (
    <>
      <NavBar />
      {isLoginOverlayOpen && <LoginMain />}
      <div className="pt-[63px] min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default UserLayout;
