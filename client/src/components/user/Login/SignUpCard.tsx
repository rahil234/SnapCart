import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import { sendOtp } from '@/api/userEndpoints';
import { motion } from 'framer-motion';
import { SignUpFormInputs } from 'shared/types';

interface SignUpCardProps {
  hideLoginOverlay: () => void;
  setActiveTab: (
    tab: 'login' | 'signup' | 'forgotPassword' | 'verifyOtp'
  ) => void;
  setUserData: (data: SignUpFormInputs) => void;
}

const SignUpCard: React.FC<SignUpCardProps> = ({
  hideLoginOverlay,
  setActiveTab,
  setUserData,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async data => {
    try {
      setError(null);
      console.log('data', data);
      const response = await sendOtp(data.email);
      setActiveTab('verifyOtp');
      console.log('response', response.data);
      setUserData(data);
    } catch (error: any) {
      console.error('error', error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-end p-4">
        <X className="cursor-pointer" onClick={hideLoginOverlay} />
      </header>
      <div className="flex flex-col justify-center items-center px-8 pb-4">
        <div className="w-full">
          <div className="flex max-w-72 mx-auto bg-gray-100 rounded-full mb-4">
            <motion.button
              className={`flex-1 py-2 rounded-full text-sm font-medium ${!isSignUp ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              onClick={() => setActiveTab('login')}
              animate={{ x: isSignUp ? 0 : '100%' }}
            >
              Login
            </motion.button>
            <motion.button
              className={`flex-1 py-2 rounded-full text-sm font-medium ${isSignUp ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              onClick={() => setIsSignUp(true)}
              animate={{ x: isSignUp ? 0 : '-100%' }}
            >
              Signup
            </motion.button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <p className="text-red-500 text-sm h-[5px] text-center">
              {error && error}
            </p>
            <div>
              <InputField
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg p-2"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters',
                  },
                })}
              />
              <p className="text-red-500 text-sm h-1 mb-1">
                {errors.name && errors.name.message}
              </p>
            </div>
            <div>
              <InputField
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg p-2"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              <p className="text-red-500 h-1 text-sm mb-1">
                {errors.email &&
                  errors.email.message
                }
              </p>
            </div>
            <div>
              <InputField
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg p-2"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <p className="text-red-500 text-sm h-1 mb-1">
                {errors.password &&
                  errors.password.message
                }
              </p>
            </div>
            <div>
              <InputField
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded-lg p-2"
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: value =>
                    value === watch('password') || 'Passwords do not match',
                })}
              />
              <p className="text-red-500 text-sm h-1 mb-1">
                {errors.confirmPassword && errors.confirmPassword.message
                }
              </p>
            </div>
            <button
              type="submit"
              className="mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg"
            >
              Sign Up
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
};

export default SignUpCard;
