import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import userEndpoints from '@/api/userEndpoints';
import { setCredentials } from '@/features/auth/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { catchError } from 'shared/types';
import { useAppDispatch } from '@/app/store';

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
    try {
      console.log('data', data);

      setError(null);
      const response = await userEndpoints.userLogin(data);
      dispatch(setCredentials(response.data));
      hideLoginOverlay();
    } catch (error) {
      const newError = error as catchError;
      setError(newError.response.data.message);
    }
  };

  const handleGoogleLoginSuccess = async (codeResponse: {
    access_token: string;
  }) => {
    try {
      const response = await userEndpoints.userGoogleLogin(
        codeResponse.access_token
      );
      dispatch(setCredentials(response.data));
      hideLoginOverlay();
    } catch (error) {
      const newError = error as catchError;
      setError(newError.response.data.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: codeResponse => handleGoogleLoginSuccess(codeResponse),
    onError: error => console.log('Login Failed:', error),
  });

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
            <button
              onClick={() => googleLogin()}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition duration-300"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#FFC107"
                />
                <path
                  d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
                  fill="#FF3D00"
                />
                <path
                  d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
                  fill="#4CAF50"
                />
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#1976D2"
                />
              </svg>
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition duration-300">
              <svg
                fill="#000000"
                height="24px"
                width="24px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.773 22.773"
              >
                <g>
                  <g>
                    <path
                      d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573
			c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"
                    />
                    <path
                      d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334
			c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0
			c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019
			c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464
			c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648
			c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"
                    />
                  </g>
                </g>
              </svg>
            </button>
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
