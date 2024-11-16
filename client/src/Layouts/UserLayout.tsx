import React from 'react';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import NavBar from '@/components/user/NavBar';
import Footer from '@/components/user/Footer';
import { UIContext } from '@/context/UIContext';
import LoginMain from '@/components/user/Login/LoginMain';
import CartOverlay from '@/components/user/CartOverlay';
import ProfileOverlay from '@/components/user/ProfileOverlay';

function UserLayout() {
  const { isLoginOverlayOpen, isCartOverlayOpen, isProfileOverlayOpen } = useContext(UIContext);

  return (
    <>
      <NavBar />
      <AnimatePresence >
        {isLoginOverlayOpen && <LoginMain />}
        {isCartOverlayOpen && <CartOverlay />}
        {isProfileOverlayOpen && <ProfileOverlay />}
      </ AnimatePresence >
      <div className="pt-[63px] min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default UserLayout;
