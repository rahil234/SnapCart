import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import userEndpoints from '@/api/userEndpoints';
import { catchError } from 'shared/types';

interface ForgotPasswordInputs {
  email: string;
}

interface ForgotPasswordCardProps {
  setEmail: (email: string) => void
  setActiveTab: (tab: 'login' | 'signup' | 'forgotPassword' | 'verifyOtp' | 'forgot-verify' | 'new-password') => void;
}

export default function ForgotPasswordCard({ setEmail, setActiveTab }: ForgotPasswordCardProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    try {
      setError(null);
      await userEndpoints.forgotPassword(data.email);
      setEmail(data.email);
      setActiveTab('forgot-verify');
    } catch (error) {
      console.error('error', error);
      setError((error as catchError).response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <header className="p-4">
        <button
          onClick={() => setActiveTab('login')}
          className="text-sm text-gray-600 hover:underline"
        >
          <ArrowLeft className="inline text-black" size={30} />
        </button>
      </header>
      <div className="flex flex-col justify-center items-center px-8 pb-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <p className="text-red-500 text-sm h-[5px] text-center">
              {error && error}
            </p>
            <div>
              <InputField
                placeholder="Email"
                className="border border-gray-300 rounded-lg p-2 w-full"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              <p className="text-red-500 h-1 text-sm mt-1">
                {errors.email && errors.email.message}
              </p>
            </div>
            <button
              type="submit"
              className="mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
      <footer className="p-4">
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
}