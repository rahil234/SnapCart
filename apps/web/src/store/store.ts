import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/auth/authSlice';
import cartReducer from '@/store/cart/cartSlice';
import addressReducer from '@/store/address/address.slice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    address: addressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
