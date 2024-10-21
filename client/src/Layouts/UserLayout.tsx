import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '@/components/user/NavBar';
import Footer from '@/components/user/Footer';

function AdminLayout() {
  return (
    <>
      <NavBar />
      <div className="pt-[63px] min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default AdminLayout;
