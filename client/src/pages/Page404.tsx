import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Adjust the import based on your project structure

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous route
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">Page Not Found</p>
      <div className="flex flex-col gap-2 items-center space-x-4">
        <Button onClick={handleGoBack} className="bg-blue-500 text-white px-4 py-2 rounded">
          Go Back
        </Button>
        <button onClick={handleGoHome} className="text-blue-500 underline bg-transparent border-none p-0">
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;