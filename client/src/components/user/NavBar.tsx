import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CircleUserRound } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { UIContext } from '@/context/UIContext';
import { AuthState } from '@/features/auth/authSlice';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { ImportMeta } from '@types';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/profiles/';

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { isAuthenticated, user } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );
  const { showLoginOverlay, toggleCartOverlay, toggleProfileOverlay } =
    useContext(UIContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim() ? e.target.value : '';
    setSearchQuery(query);
    if (query === '') {
      navigate('/');
    } else {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <>
      <header className="bg-white fixed w-screen shadow-sm py-3 px-6 flex justify-between items-center gap-4 z-50">
        <div className="lg:text-2xl flex" onClick={() => navigate('/')}>
          <h1 className="font-bold text-yellow-400">Snap</h1>
          <h1 className="font-bold text-green-600">Cart</h1>
        </div>
        <Input
          id="searchField"
          placeholder='Search for "Milk" '
          value={searchQuery}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          {isAuthenticated ? (
            <div
              className="flex items-center gap-2 px-2"
              onClick={toggleProfileOverlay}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={imageUrl + user?.profilePicture}
                  alt="Profile picture"
                />
                <AvatarFallback>
                  <CircleUserRound className="w-8 h-8 m-auto" />
                </AvatarFallback>
              </Avatar>
              <span className="w-full text-nowrap text-md font-medium">
                {user?.firstName}
              </span>
            </div>
          ) : (
            <Button variant={'ghost'} onClick={showLoginOverlay}>
              Login
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="bg-[#0F831F] text-white"
            onClick={toggleCartOverlay}
          >
            Cart
          </Button>
        </div>
      </header>
    </>
  );
};

export default NavBar;
