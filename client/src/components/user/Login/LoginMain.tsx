import React, { useContext, useState } from 'react';
import giftBoxTopOpenBackgroundRemoved1 from '@/assets/gift-box-top-open-background-removed-1.png';
import giftBoxTopOpen2BackgroundRemoved1 from '@/assets/gift-box-top-open2-background-removed-1.png';
import { UIContext } from '@/context/UIContext';
import LoginCard from '@/components/user/Login/LoginCard';
import SignUpCard from '@/components/user/Login/SignUpCard';
import VerifyOTPCard from '@/components/user/Login/VerifyOTPCard';
import { SignUpFormInputs } from 'shared/types';
import ForgotPasswordCard from './ForgetPasswordCard';
import userEndpoints from '@/api/userEndpoints';


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
  const { hideLoginOverlay } = useContext(UIContext);
  const [activeTab, setActiveTab] = useState<
    'login' | 'signup' | 'forgotPassword' | 'verifyOtp'>('login');
  const [signupData, setSignupData] = useState<SignUpFormInputs>();

  // Updated onOtpSubmit function to use verifyOtp from userEndpoints
  const onOtpSubmit = async (otp: string) => {
    console.log('OTP submitted:', otp);
    try {
      if (!signupData) {
        console.error('User data not found');
        return;
      }
      const response = await userEndpoints.verifyOtp(signupData?.email, otp);
      if (response.data.success) {
        console.log('OTP verified successfully');
        setActiveTab('login'); // Change tab or take any action on success
      } else {
        console.error('Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

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
          setUserData={setSignupData}
        />
      );

    case 'verifyOtp':
      return (
        <VerifyOTPCard
          setActiveTab={setActiveTab}
          onOTPSubmit={onOtpSubmit}
        />
      );

    case 'forgotPassword':
      return <ForgotPasswordCard setActiveTab={setActiveTab} />;

    default:
      return null;
  }
}

export default LoginMain;
