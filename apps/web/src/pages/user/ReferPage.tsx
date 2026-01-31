import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { UIContext } from '@/context/UIContext';

const ReferPage = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const referCode = queryParams.get('code');

  console.log(referCode);
  if (referCode) localStorage.setItem('referralCode', referCode);

  const { showLoginOverlay,setActiveTab } = useContext(UIContext);
  useEffect(() => {
    showLoginOverlay();
    setActiveTab('signup');
  }, []);

  return <Navigate to="/" />;
};

export default ReferPage;
