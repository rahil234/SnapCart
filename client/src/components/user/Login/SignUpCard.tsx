import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import LoginButton from '@/components/ui/LoginButton';
import InputField from '@/components/ui/InputField';
import { userSignUp } from '@/api/userEndpoints';
import { login } from '@/features/auth/authSlice';

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpCardProps {
  hideLoginOverlay: () => void;
  setActiveTab: (
    tab: 'login' | 'signup' | 'forgotPassword' | 'verifyOtp'
  ) => void;
}

const SignUpCard: React.FC<SignUpCardProps> = ({
  hideLoginOverlay,
  setActiveTab,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async data => {
    try {
      console.log('data', data);
      const response = await userSignUp(data);
      console.log('response', response.data);
      dispatch(login({ user: response.data.user, token: response.data.token }));
      hideLoginOverlay();
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <div className="flex w-full h-full flex-col justify-between items-center gap-8 p-8">
      <header className="w-full flex justify-end">
        <X className="absolute h-50" onClick={hideLoginOverlay} />
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-1"
      >
        <div className="flex gap-1 bg-white rounded-3xl border overflow-hidden mb-3">
          <h1
            className="text-xl font-bold p-2 px-6 "
            onClick={() => setActiveTab('login')}
          >
            Login
          </h1>
          <h1 className="text-xl font-bold p-2 px-6 bg-black text-white">
            Sign Up
          </h1>
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
        <InputField
          placeholder="name"
          className="w-10/12 border-2 border-gray-300 rounded-lg p-2"
          type="name"
          {...register('name', {
            required: 'name is required',
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters',
            },
          })}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
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

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
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

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
        <InputField
          placeholder="Confirm Password"
          className="w-10/12 border-2 border-gray-300 rounded-lg p-2"
          type="password"
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: value =>
              value === watch('password') || 'Passwords do not match',
          })}
        />

        <LoginButton
          label="Sign Up"
          className="bg-[#198C05] hover:bg-[#194C05] p-2 px-8 rounded-lg mt-5"
        />
      </form>
      <footer>
        <p className="text-gray-500 text-xs mt-2 text-center">
          By continuing, you agree to our{' '}
          <a href="#terms-and-service" className="underline">
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
