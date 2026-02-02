import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAppDispatch } from '@/app/store';
import InputField from '@/components/ui/InputField';
import { fetchUser } from '@/features/auth/authSlice';
import { AuthService } from '@/services/auth.service';

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginCardProps {
  hideLoginOverlay: () => void;
  setActiveTab: (
    tab: 'login' | 'signup' | 'forgotPassword' | 'verifyOtp'
  ) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  setActiveTab,
  hideLoginOverlay,
}) => {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async data => {
    setError(null);
    const { error } = await AuthService.userLogin(data);

    if (error) {
      setError(error?.message || 'Login failed');
      return;
    }

    dispatch(fetchUser());

    hideLoginOverlay();
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-end p-4">
        <X className="cursor-pointer" onClick={() => hideLoginOverlay()} />
      </header>
      <div className="flex flex-col justify-center items-center px-8 pb-4">
        <div className="w-full">
          <div className="flex max-w-72 mx-auto bg-gray-100 rounded-full p mb-4">
            <motion.button
              className={`flex-1 py-2 rounded-full text-sm font-medium ${isLogin ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              onClick={() => setIsLogin(true)}
              animate={{ x: isLogin ? 0 : '100%' }}
              transition={{ duration: 0.3 }}
            >
              Login
            </motion.button>
            <motion.button
              className={`flex-1 py-2 rounded-full text-sm font-medium ${!isLogin ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              onClick={() => setActiveTab('signup')}
              animate={{ x: isLogin ? 0 : '-100%' }}
              transition={{ duration: 0.3 }}
            >
              Signup
            </motion.button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-3"
          >
            <p className="text-red-500 text-sm h-[5px] text-center">
              {error && error}
            </p>
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
            >
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
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
            >
              <InputField
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-2 w-full"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <p className="text-red-500 h-1 text-sm mt-1">
                {errors.password && errors.password.message}
              </p>
            </motion.div>
            <div className="flex justify-end">
              <button
                className="text-sm text-gray-600 hover:underline mb-2"
                type="button"
                onClick={() => setActiveTab('forgotPassword')}
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg "
            >
              Login
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex justify-center space-x-4">
            <GoogleLogin
              type="standard"
              shape="pill"
              text="continue_with"
              onSuccess={async credentialResponse => {
                if (!credentialResponse.credential) {
                  setError('Google login failed');
                  return;
                }

                const { error } = await AuthService.userGoogleLogin(
                  credentialResponse.credential
                );

                if (error) {
                  setError(error?.message || 'Google login failed');
                  return;
                }

                dispatch(fetchUser());
                hideLoginOverlay();
              }}
              onError={() => {
                setError('Google login failed');
              }}
              theme="filled_black"
              ux_mode="popup"
              useOneTap={true}
            />
          </div>
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
};

export default LoginCard;
