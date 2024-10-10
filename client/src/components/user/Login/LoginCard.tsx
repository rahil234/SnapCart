//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import LoginButton from '@/components/ui/LoginButton';
import InputField from '@/components/ui/InputField';
import { userLogin } from '@/api/userEndpoints';
import { login } from '@/features/auth/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
  hideLoginOverlay,
  setActiveTab,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  // const [profile, setProfile] = useState([]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async data => {
    try {
      const response = await userLogin(data);
      console.log('data', response.data);
      dispatch(login({ user: response.data.user, token: response.data.token }));
      hideLoginOverlay();
    } catch (error) {
      console.error('error', error);
    }
  };


  const handleGoogleLoginSuccess = async (tokenResponse: object) => {
    console.log('Google login success:', tokenResponse);
    setUser(tokenResponse.data);

    useEffect(
      () => {
        if (user) {
          axios
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json'
              }
            })
            .then((res) => {
              console.log(`Google login success:`, res.data);

              // dispatch(login({ user: res.data, token: user.access_token }));
            })
            .catch((err) => console.log(err));
        }
      },
      [user]
    );

    dispatch(login({ user: response.data.user, token: response.data.token }));
    hideLoginOverlay();
  };

  const handleGoogleLoginError = () => {
    console.error('Google login failed');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
  });

  return (
    <div className="flex w-full h-full flex-col justify-between items-center gap-8 p-8">
      <header className="w-full flex justify-end">
        <X className="absolute h-50" onClick={hideLoginOverlay} />
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-3"
      >
        <div className="flex gap-1 bg-white rounded-3xl border overflow-hidden mb-3">
          <h1 className="text-xl font-bold p-2 px-6 bg-black text-white">
            Login
          </h1>
          <h1
            className="text-xl font-bold p-2 px-6 "
            onClick={() => setActiveTab('signup')}
          >
            Signup
          </h1>
        </div>
        <InputField
          placeholder="Email"
          className="w-10/12 border-2 border-gray-300 rounded-lg p-2"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        <InputField
          placeholder="Password"
          className="w-10/12 border-2 border-gray-300 rounded-lg p-2"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        <LoginButton
          label="Login"
          className="bg-[#198C05] hover:bg-[#194C05] p-2 px-8 rounded-lg mt-5"
        />
      </form>
      <div className="flex gap-5">
        <span className="border rounded-full p-1" onClick={() => googleLogin()}>
          <svg
            width="35px"
            height="35px"
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              fill="#4285F4"
            />
            <path
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              fill="#34A853"
            />
            <path
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              fill="#FBBC05"
            />
            <path
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              fill="#EB4335"
            />
          </svg>
        </span>
        <span className="border rounded-full p-1 -translate-y-1">
          <svg
            fill="#000000"
            width="35px"
            height="35px"
            viewBox="0 0 24 24"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
          >
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
          </svg>
        </span>
      </div>
      <footer>
        <p className="text-gray-500 text-xs mt-2 text-center">
          By continuing, you agree to our{' '}
          <a href="#terms-and-service" className="underline">
            Terms of service
          </a>{' '}
          &{' '}
          <a href="#privcy-policy" className="underline">
            Privacy policy
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LoginCard;
