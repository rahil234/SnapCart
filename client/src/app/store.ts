import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '@/features/auth/authSlice';
import cartReducer from '@/features/cart/cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;
