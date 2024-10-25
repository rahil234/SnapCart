import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { UIContext } from '@/context/UIContext';

const ProfileOverlay = () => {
  const { hideProfileOverlay } = useContext(UIContext);

  const handleBackgroundClick = () => {
    hideProfileOverlay();
  };

  return (
    <div className='fixed w-screen h-screen bg-black bg-opacity-50' onClick={handleBackgroundClick}>
      <div className="absolute top-16 right-10 w-[300px] bg-white shadow-lg z-50 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center">
          <img
            className="w-24 h-24 rounded-full mb-4"
            src="/path/to/profile-picture.jpg"
            alt="Profile"
          />
          <h2 className="text-xl font-bold mb-2">John Doe</h2>
          <p className="text-gray-600 mb-4">john.doe@example.com</p>
          <Button type="button" className="bg-blue-500 text-white w-full mb-2">
            Edit Profile
          </Button>
          <Button type="button" className="bg-red-500 text-white w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay;
