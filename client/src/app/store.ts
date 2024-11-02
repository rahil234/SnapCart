import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { thunk } from 'redux-thunk';
import authReducer from '@/features/auth/authSlice';
// import cartReducer from '@/features/cart/cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// store.subscribe(() => {
//   localStorage.setItem('cart', JSON.stringify(store.getState().cart));
// });

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
