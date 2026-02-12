import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { AuthService } from '@/services/auth.service';

interface VerifyOTPFormInputs {
  otp: string;
}

interface VerifyOTPCardProps {
  email: string;
  setActiveTab: (
    tab: 'login' | 'signup' | 'forgotPassword' | 'verifyOtp'
  ) => void;
  onOTPSubmit: (otp: string) => Promise<void>;
}

const VerifyOTPCard: React.FC<VerifyOTPCardProps> = ({
  email,
  setActiveTab,
  onOTPSubmit,
}) => {
  const { handleSubmit } = useForm<VerifyOTPFormInputs>();

  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);

  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  // ⏳ Countdown logic
  useEffect(() => {
    if (timer <= 0) {
      setIsResendEnabled(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    try {
      await AuthService.requestOTP({ identifier: email });
      setTimer(60);
      setIsResendEnabled(false);
      setError(null);
    } catch (err) {
      console.log('Failed to resend OTP:', err);
      setError('Failed to resend OTP');
    }
  };

  // ✅ Submit
  const onSubmit: SubmitHandler<VerifyOTPFormInputs> = async () => {
    const otp = otpValues.join('');

    if (otp.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    try {
      await onOTPSubmit(otp);
    } catch (err) {
      console.log('OTP verification failed:', err);
      setError('Invalid OTP');
    }
  };

  // 🔢 Handle OTP Input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // ⌫ Backspace Navigation
  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="flex w-full h-full flex-col items-center p-8">
      <header className="w-full flex justify-start mb-8">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => setActiveTab('signup')}
        />
      </header>

      <h1 className="text-3xl font-bold mb-4">Verify OTP</h1>

      <p className="text-gray-600 text-center mb-8">
        A 4-digit verification code has been sent to your email.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-6"
      >
        <div className="flex justify-center gap-4">
          {otpValues.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={e => handleOtpChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
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
            `Didn't get the OTP? Wait ${timer}s`
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
          <a href="/terms-of-service" className="underline">
            Terms of service
          </a>{' '}
          &{' '}
          <a href="/privacy-policy" className="underline">
            Privacy policy
          </a>
        </p>
      </footer>
    </div>
  );
};

export default VerifyOTPCard;
