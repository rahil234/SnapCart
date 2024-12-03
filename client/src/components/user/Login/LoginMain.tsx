import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import giftBoxTopOpenBackgroundRemoved1 from '@/assets/gift-box-top-open-background-removed-1.png';
import giftBoxTopOpen2BackgroundRemoved1 from '@/assets/gift-box-top-open2-background-removed-1.png';
import { UIContext } from '@/context/UIContext';
import LoginCard from '@/components/user/Login/LoginCard';
import SignUpCard from '@/components/user/Login/SignUpCard';
import VerifyOTPCard from '@/components/user/Login/VerifyOTPCard';
import ForgotPasswordCard from './ForgetPasswordCard';
import ForgetPasswordVerifyOTPCard from '@/components/user/Login/ForgetPasswordVerifyOTPCard';
import NewPassword from '@/components/user/Login/NewPassword';
import { SignUpFormInputs } from 'shared/types';
import userEndpoints from '@/api/userEndpoints';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store';

const LoginMain = () => {
  return (
    <motion.div
      className="bg-black fixed w-screen p-7 bg-opacity-55 h-screen overflow-hidden z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
    >
      <motion.div className="relative top-1/2 flex left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[900px] h-[522px] rounded-3xl overflow-hidden max-w-[96vw]">
        <div className="bg-[#FFDB00] flex-1 hidden lg:block">
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
          <div className="absolute w-[461px] h-[282px] top-[220px] left-0 bg-[url(@/assets/3d-rendering-shopping-concept-23-2149877666-1-background-removed-1.png)] bg-cover bg-[50%_50%]"></div>
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
      </motion.div>
    </motion.div>
  );
};

function LoginController() {
  const { hideLoginOverlay } = useContext(UIContext);
  const [signupData, setSignupData] = useState<SignUpFormInputs>();
  const [email, setEmail] = useState<string>();

  const { activeTab, setActiveTab } = useContext(UIContext);

  const dispatch = useAppDispatch();

  const onOtpSubmit = async (otp: string) => {
    try {
      if (!signupData) {
        throw new Error('no data found');
      }
      const response = await userEndpoints.verifyOtp(signupData.email, otp);
      if (response.data.success) {
        console.log('OTP verified successfully');
        setActiveTab('login');
        const signupResponse = await userEndpoints.userSignUp(signupData);
        dispatch(setCredentials(signupResponse.data));
        setSignupData(undefined);
        hideLoginOverlay();
      } else {
        console.error('Failed to verify OTP');
        setSignupData(undefined);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setSignupData(undefined);
    }
  };

  const onOtpSubmitForget = async (otp: string) => {
    try {
      if (!email) {
        throw new Error('No email provided');
      }
      const response = await userEndpoints.verifyOtp(email, otp);
      if (response.data.success) {
        console.log('OTP verified successfully');
        setActiveTab('new-password');
      } else {
        console.error('Failed to verify OTP');
        setSignupData(undefined);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setSignupData(undefined);
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
          signupData={signupData}
          setUserData={setSignupData}
        />
      );

    case 'verifyOtp':
      return (
        <VerifyOTPCard
          email={signupData?.email || email!}
          setActiveTab={setActiveTab}
          onOTPSubmit={onOtpSubmit}
        />
      );
    case 'forgotPassword':
      return (
        <ForgotPasswordCard setActiveTab={setActiveTab} setEmail={setEmail} />
      );

    case 'forgot-verify':
      return (
        <ForgetPasswordVerifyOTPCard
          email={email!}
          setActiveTab={setActiveTab}
          onOTPSubmit={onOtpSubmitForget}
        />
      );

    case 'new-password':
      return <NewPassword email={email} setActiveTab={setActiveTab} />;
    default:
      return <></>;
  }
}

export default LoginMain;
