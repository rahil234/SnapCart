import React, { useContext } from 'react';
import giftBoxTopOpenBackgroundRemoved1 from '@/assets/gift-box-top-open-background-removed-1.png';
import giftBoxTopOpen2BackgroundRemoved1 from '@/assets/gift-box-top-open2-background-removed-1.png';
// import { Card, CardContent, CardActions } from '@mui/material';
// import React, { useState, useContext } from 'react';
// // import SignUpOverlay from './SignUp';
import { UIContext } from '@/context/UIContext';

import LoginCard from '@/components/user/Login/LoginCard';
import SignUpCard from '@/components/user/Login/SignUpCard';
import VerifyOTPCard from '@/components/user/Login/VerifyOTPCard';

// // import Login from './Login';
// // import VerifyOtp from './anima';
// import {LoginBg} from './LoginBg';
// // import LoginOverlay from './LoginOverlay';

const LoginMain = (): JSX.Element => {
  return (
    <div className="bg-black fixed w-screen p-7 bg-opacity-55 h-screen overflow-hidden">
      <div className="relative top-1/2 flex left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[900px] h-[522px] rounded-3xl overflow-hidden">
        <div className="bg-[#FFDB00] flex-1">
          <div className="absolute left-1/4 -translate-x-1/2 top-11 w-[229px] h-[53px] mx-auto text-center">
            <p className="absolute w-[229px] [font-family:'Poppins-Bold',Helvetica] font-bold text-transparent text-[45.5px] tracking-[0.45px] leading-[normal] whitespace-nowrap">
              <span className="text-white tracking-[0.21px]">Snap</span>
              <span className="text-[#188c06] tracking-[0.21px]">Cart</span>
              <span className="text-white tracking-[0.21px]">&nbsp;</span>
            </p>
          </div>
          <div className="w-[328px] h-[158px] top-[20px] left-[22px]">
            <div className="absolute w-[121px] h-[132px] top-[26px] left-0 bg-[url(@/assets/gift-box-top-background-removed-1.png)] bg-cover bg-[50%_50%]" />
          </div>
          <img
            className="absolute w-[153px] h-[94px] -top-[10px] rotate-[-25deg] left-[300px] object-cover"
            alt="Gift box top open"
            src={giftBoxTopOpenBackgroundRemoved1}
          />
        </div>

        <div className="absolute w-[461px] h-[282px] top-[220px] left-0 bg-[url(@/assets/3d-rendering-shopping-concept-23-2149877666-1-background-removed-1.png)] bg-cover bg-[50%_50%]">
          <img
            className="absolute w-[146px] h-[140px] top-[155px] left-[276px] rotate-[15deg] object-cover"
            alt="Gift box top"
            src={giftBoxTopOpen2BackgroundRemoved1}
          />
          <div className="absolute w-[459px] h-7 top-[342px] left-[54px]">
            <div className="w-[447px] h-7 bg-[#4b4b4b] rounded-[223.52px/13.78px] blur-[66.61px]" />
          </div>
        </div>
        <div className="flex-1 w-full h-full">
          <LoginController />
        </div>
      </div>
    </div>
  );
};

function LoginController() {
  const { activeTab, setActiveTab, hideLoginOverlay } = useContext(UIContext);

  switch (activeTab) {
    case 'login':
      return (
        <LoginCard
          setActiveTab={setActiveTab}
          hideLoginOverlay={hideLoginOverlay}
        />
      );
    case 'signup':
      return (
        <SignUpCard
          setActiveTab={setActiveTab}
          hideLoginOverlay={hideLoginOverlay}
        />
      );

    case 'verifyOtp':
      return <VerifyOTPCard />;

    case 'forgotPassword':
      return <>forgotPassword</>;

    default:
      return null;
  }
}

export default LoginMain;

{
  /* <Card className="w-[400px]">
               <CardContent className="flex flex-col items-center">
                 <h1 className="text-3xl font-bold text-green-600">SnapCart</h1>
                 <p className="text-center text-gray-600 mt-2">Verify OTP</p>
                 <p className="text-center text-gray-500 text-sm mt-1">
                   A message with a verification code of 4 digits has been sent
                   to your email.
                 </p>
                 <div className="flex space-x-2 mt-4">                 
                 </div>
                 <p className="text-center text-gray-500 text-sm mt-2">
                   Didn’t get the OTP? Wait for 1 minute.
                 </p>
               <CardActions className="flex justify-center">
                 <Button
                  label="Verify"
                  className="bg-green-600 text-white rounded px-4 py-2"
                />
              </CardActions>
              <p className="text-center text-gray-500 text-xs mt-2">
                By continuing, you agree to our
                <a href="https://blinkit.com/terms" className="underline">
                  Terms of service
                </a>
                &
                <a href="https://blinkit.com/privacy" className="underline">
                  Privacy policy
                </a>
              </p>
</CardContent>
            </Card>  */
}
