import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/features/auth/authSlice';
import { userLogin } from '@/api/userEndpoints';
import { UIContext } from '@/context/UIContext';
import googleIcon from '@/assets/icons/google.svg';
import appleIcon from '@/assets/icons/apple.svg';

const LoginOverlay = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { hideLoginOverlay, setActiveTab } = useContext(UIContext);

  const handleLogin = async () => {
    try {
      const response = await userLogin({ email, password });
      console.log('data', response.data);
      dispatch(login({ user: 'user', token: response.data.token }));
      hideLoginOverlay();
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 card">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl flex">
        <div className="bg-yellow-400 w-1/2 p-8 relative hidden md:block">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-white">Snap</span>
            <span className="text-green-600">Cart</span>
          </h1>
          <div className="absolute bottom-0 left-0 w-full p-8">
            <ShoppingCart className="w-48 h-48 text-purple-600" />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 relative">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" onClick={hideLoginOverlay} />
          </button>

          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 bg-black text-white rounded-l-full`}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 bg-gray-200 text-black rounded-r-full`}
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </div>

          <form className="space-y-4" method="">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className="text-right">
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              type="button"
              onClick={handleLogin}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 flex justify-center space-x-4">
            <button className="p-2 border rounded-full">
              <img src={googleIcon} alt="" className="w-6" />
            </button>
            <button className="p-2 border rounded-full">
              <img src={appleIcon} className="w-6" />
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            By continuing, you agree to our Terms of service & Privacy policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginOverlay;
