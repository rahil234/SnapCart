import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CircleUserRound } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { UIContext } from '@/context/UIContext';
import { AuthState } from '@/features/auth/authSlice';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { ImportMeta } from 'shared/types';

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl;

const NavBar = () => {

  const { isAuthenticated, user } = useSelector((state: { auth: AuthState }) => state.auth);
  const { showLoginOverlay, toggleCartOverlay, toggleProfileOverlay } = useContext(UIContext);

  return (
    <>
      <header className="bg-white fixed w-screen shadow-sm py-3 px-6 flex justify-between items-center gap-4 z-50">
        <div className='flex'>
          <h1 className="text-2xl font-bold text-yellow-400">Snap</h1>
          <h1 className="text-2xl font-bold text-green-600">Cart</h1>
        </div>
        <Input id="username" placeholder='Search for "Milk" ' />
        <div className="flex gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 px-2" onClick={toggleProfileOverlay}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={imageUrl + user?.profilePicture} alt="Profile picture" />
                <AvatarFallback><CircleUserRound className="w-8 h-8 m-auto" /></AvatarFallback>
              </Avatar>
              <span className="w-full text-nowrap text-md font-medium">{user?.firstName}</span>
            </div>
          ) : (
            <Button variant={'ghost'} onClick={showLoginOverlay}>Login</Button>
          )}
          <Button variant="outline" size="sm" className="bg-[#0F831F] text-white" onClick={toggleCartOverlay}>
            Cart
          </Button>
        </div>
      </header>
    </>
  );
};

export default NavBar;
