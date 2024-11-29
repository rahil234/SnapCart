import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UIContext } from '@/context/UIContext';
import { AuthState, logoutUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store';
import { Link } from 'react-router';
import { ImportMeta } from '@types';

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL+'/profiles/';

const ProfileOverlay = () => {
  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  const dispatch = useAppDispatch();

  const { hideProfileOverlay } = useContext(UIContext);

  const handleLogout = () => {
    dispatch(logoutUser());
    hideProfileOverlay();
  };

  return (
    <motion.div className={`fixed w-screen h-screen bg-black backdrop-blur-sm bg-opacity-20 transition-all duration-300 ease-in-out`}
      onClick={() => hideProfileOverlay()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className={`absolute right-2 w-[300px] bg-white shadow-lg z-50 p-4 rounded-lg top-16 transition-all duration-300 ease-in-out`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ opacity: 0.5, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }}
          className="flex flex-col items-center">
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
        </motion.div>
      </motion.div >
    </motion.div >
  );
};

export default ProfileOverlay;
