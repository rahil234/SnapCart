import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UIContext } from '@/context/UIContext';
import { AuthState, logoutUser } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { Link } from 'react-router-dom';
import { ImportMeta } from 'shared/types';

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl;


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
      <div className="absolute top-16 right-2 w-[300px] bg-white shadow-lg z-50 p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={imageUrl + user?.profilePicture} alt="Profile picture" />
            <AvatarFallback><User className="w-12 h-12" /></AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold my-2">{user?.firstName}</h2>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          <Link to={'/my-account#profile'} className='w-full'>
            <Button className="text-white w-full mb-2 bg-[#0E8320] hover:bg-[#0E8320e6]">
              My Account
            </Button>
          </Link>
          <Button className="border border-[#0E8320] bg-white hover:bg-white text-[#0E8320] w-full hover:border-[#0E8320a6] hover:text-[#0E8320a6]" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay;
