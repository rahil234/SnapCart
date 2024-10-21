import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import userEndpoints from '@/api/userEndpoints';
import { login } from '@/features/auth/authSlice';
import { SignUpFormInputs } from 'shared/types';

interface VerifyOTPFormInputs {
  otp: string[];
}

interface VerifyOTPCardProps {
  hideLoginOverlay:() => void;
  setActiveTab: (tab: "login" | "signup" | "forgotPassword" | "verifyOtp") => void;
  userData: SignUpFormInputs; // Ensure userData is required
}

const VerifyOTPCard: React.FC<VerifyOTPCardProps> = ({ hideLoginOverlay,setActiveTab, userData }) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const { handleSubmit } = useForm<VerifyOTPFormInputs>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const onSubmit: SubmitHandler<VerifyOTPFormInputs> = async (data) => {
    try {
      const otp = data.otp.join('');
      console.log('OTP submitted:',userData.email, otp);
      const isValidOtp = await userEndpoints.verifyOtp(userData.email, otp);
      if (!isValidOtp) {
        throw new Error('Invalid OTP');
      }
      // Complete signup process
      const response = await userEndpoints.userSignUp(userData);
      console.log('response', response.data);
      dispatch(login({ user: response.data.user, token: response.data.token }));
      hideLoginOverlay();
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Move focus to the next input
      if (value !== '' && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Check if all inputs are filled
      if (newOtpValues.every((val) => val !== '')) {
        onSubmit({ otp: newOtpValues });
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && otpValues[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOtp = () => {
    setTimer(60);
    try {
      userEndpoints.resendOtp(userData.email);
      setIsResendEnabled(false);
      console.log('OTP resent');
    }catch(err: any) {
      console.error('Error:', err);
      setError(err.response.data.message);
    }
    setIsResendEnabled(false);
  };

  return (
    <div className="flex w-full h-full flex-col items-center p-8">
      <header className="w-full flex justify-start mb-8">
        <ArrowLeft className="cursor-pointer" onClick={() => setActiveTab('signup')} />
      </header>
      <h1 className="text-3xl font-bold mb-4">Verify OTP</h1>
      <p className="text-gray-600 text-center mb-8">
        A message with a verification code of 4 digits has been sent to your email.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-6">
        <div className="flex justify-center gap-4">
          {otpValues.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          ))}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <p className="text-gray-600 text-sm">
          {isResendEnabled ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-green-600 hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            `Didn't get the otp? Wait ${timer} seconds`
          )}
        </p>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition duration-300"
        >
          Verify
        </button>
      </form>
      <footer className="mt-auto">
        <p className="text-gray-500 text-xs text-center">
          By continuing, you agree to our{' '}
          <a href="#terms-of-service" className="underline">
            Terms of service
          </a>{' '}
          &{' '}
          <a href="#privacy-policy" className="underline">
            Privacy policy
          </a>
        </p>
      </footer>
    </div>
  );
};

export default VerifyOTPCard;
