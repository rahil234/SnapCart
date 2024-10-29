import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { UIContext } from '@/context/UIContext';
import { AuthState, logoutUser } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';


const ProfileOverlay = () => {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  const dispatch = useDispatch<AppDispatch>();

  const { hideProfileOverlay } = useContext(UIContext);

  const handleBackgroundClick = () => {
    hideProfileOverlay();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
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
          <h2 className="text-xl font-bold mb-2">{user?.firstName}</h2>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          <Button type="button" className="bg-blue-500 text-white w-full mb-2">
            Edit Profile
          </Button>
          <Button type="button" className="bg-red-500 text-white w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay;
