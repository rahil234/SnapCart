import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import { UserService } from '@/services/user.service';
import { catchError } from 'shared/types';

interface ForgotPasswordInputs {
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordCardProps {
  email: string | undefined;
  setActiveTab: (tab: 'login' | 'signup' | 'forgotPassword' | 'verifyOtp' | 'forgot-verify' | 'new-password') => void;
}

export default function ForgotPasswordCard({ email, setActiveTab }: ForgotPasswordCardProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    try {
      if (!email) {
        throw new Error('No email found');
      }
      setError(null);
      await UserService.resetPassword({ email, password: data.password});
      setActiveTab('login');
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
          <h2 className="text-2xl font-bold mb-6 text-center">New Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <p className="text-red-500 text-sm h-[5px] text-center">
              {error && error}
            </p>
            <div>
              <InputField
                placeholder="New password"
                className="border border-gray-300 rounded-lg p-2 w-full"
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <p className="text-red-500 h-1 text-sm mt-1">
                {errors.password && errors.password.message}
              </p>
            </div>
            <div>
              <InputField
                placeholder="Confirm password"
                className="border border-gray-300 rounded-lg p-2 w-full"
                {...register('confirmPassword', {
                  required: 'Password is required',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
              />
              <p className="text-red-500 h-1 text-sm mt-1">
                {errors.confirmPassword && errors.confirmPassword.message}
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
}