import React, { useContext } from 'react';
// import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { UIContext } from '@/context/UIContext';
import ProfileOverlay from './ProfileOverlay';
import { AuthState } from '@/features/auth/authSlice';
// import { logout } from '@/features/auth/authSlice';

const NavBar = () => {
  // const dispatch = useDispatch();
  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  const { isAuthenticated, user } = useSelector(
    (state: { auth: AuthState }) =>
      state.auth
  );
  const { showLoginOverlay, toggleCartOverlay, isProfileOverlayOpen, toggleProfileOverlay } = useContext(UIContext);

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
            <div className="flex items-center gap-2 px-2" onClick={() => toggleProfileOverlay()}>
              <Avatar className='w-8 h-8'>
                <AvatarImage src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAACUCAMAAAAEVFNMAAAAMFBMVEXk5ueutLfo6uu/xMersbWor7LJzc/f4eK1ur26v8LS1dfP0tSxt7rW2drb3t/Cx8mNRmv9AAAEIUlEQVR4nO2c2a7qOgxAG2dum/T///YkLXChF0om7Gwp6wVt8bCXLGe2mabBYDAYDAaDwWAwGAxeAQBqhVSCqnbzsizO6z9g7RduZEAIET/MNvupV20AryyTgj0jJOPKd6kM3q7i1fbmLFau+zP29p3sI862L2XQSl747mFWHSmDM9e6u7JxvRjD9tV2N2ZLH8aayyRhxuRG7RrRV6PtbGwn+iAnpO9TWtAbZ/lGY02qm5MPN2NOKrzl+gZjRZcUMOf7hpFHOB+nzmcnyNLYlvlSpTEsJQmx40iEtSn1ZYZEWBVmcECS7CqKE4ImxFAR4AB+iKFGlzGL7ls+RRxgrx7A63wF9ta4Yk47QN61VWcEkx5VuGSbdhLG3bTl74P/h8UVrvZlElXYVa0ahzDqqKtb5g7hGTHEUD3mkI9KUD/mGOOYwrXLRgRzmqjc+RwYTOEGGTGEh/CZ9a/NEqgR/nPTGm+w0m2YwqqBMOrBeW6w+UE9cvgGwpi+k16rhRnuOb961AnMzVqLUSdnTN8JXG1OrNjX8IW373fQb+ET35c/C2NfX0LlQd8gX/zEY12VMOa6fKNq7RDoAa47OQvce6obriLANE+LxaudVCS+4EsXD0P0dlv8kIR5q/ZqXDTu0J83ntBrgTHmafkMlMwUpDU0BSUeNC/5/7HkDTxBXh6Y9wCGeu3+iTnddyWPbySMvLQgC9uF717qnJLIEv0F/zOwfJ2QBd369g7Q/DIvBNs6qneOADj+sUhbCO56rNv375Wl2GgLRD8TwmzNGgIq9rDGz9X0Gdw7wc3NauM2wje1uG7bTh7ELiS9M/UvG4DLP3vhiKo7ssGYI38FM8ZyHtLCed1R+9fe3bVEUSGkODf37E1UIgy9Tbke2qiCrVN2vc8MFytH+DpoL5TO4T97ZeWXnp6Tt1w3R5PZYf6KthmyD2ezOfSGNdDKsi9ZcOHMzDYjKscFrVD1iRVLGfRs6h+9ApIp//tsBr200Y2IVfnfGgOozFaer8q/3SfPJTc935x/1soYhlqzZHgxXudfpDJMKvFwXKDM26cy+LbJe6b5K1iDYstLZNNL7nAm/ml4IyGTmwX51+lwp9XbHTQoP0lCNLoaalDfk2zcYEpuUSqcbmyqjVF9o3HtGoLrGyeLuhjj5e/DuGZCru+HKTEufziHBs0PmMbgKXRZef+BbnBwK2MtestrURBaiChqGfVkvmWlutCgurIcmb2jJ0yIndx9ELQoX60htxAPeQvxhswFr7icpxl53fDUGRzJK1yhtmV5BcZoh6JLMhpTKgtBW5Fen6mpVQ+S90CwUKvupB+iWzTutMCkrs/VPxTQisS7oPIi0MaIxCJYkpPcO1I7EXpY5g5SRx35xudO4gZIWyn6IPX3BhTvBJu41kE3pPn2zT/LOjniO2nUxgAAAABJRU5ErkJggg==' />
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
      {isProfileOverlayOpen && <ProfileOverlay />}
    </>
  );
};

export default NavBar;
