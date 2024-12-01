import React from 'react';
import { Navigate, useLocation } from 'react-router';

const ReferPage = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const referCode = queryParams.get('code');

  console.log(referCode);
  if (referCode) localStorage.setItem('referralCode', referCode);

  return <Navigate to="/" />;
};

export default ReferPage;
