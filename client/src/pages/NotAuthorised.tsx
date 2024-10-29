import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/features/auth/authSlice';
import { AppDispatch } from '@/app/store';

const NotAuthorised: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Not Authorized</h1>
      <p className="text-lg mb-8">You do not have permission to access this page.</p>
      <div className="flex flex-col items-center gap-2">
        <Button onClick={handleGoBack} className="bg-red-500 text-white px-4 py-2 rounded text-sm">
          Go Back
        </Button>
        <button onClick={handleLogout} className="text-blue-500 underline bg-transparent border-none p-0 text-sm">
          Logout
        </button>
      </div>
    </div>
  );
};

export default NotAuthorised;