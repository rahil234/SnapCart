import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/app/store';
import { CartItem, ICartP, Product, catchError } from 'shared/types';
import cartEndpoints from '@/api/cartEndpoints';
import validateAndCalculateOfferPrice from '@/utils/validateAndCalculateOfferPrice';

export interface CartState {
  cartData: ICartP;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: CartState = {
  cartData: { items: [], totalItems: 0, totalAmount: 0 },
  status: 'idle',
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartEndpoints.getCart();
      const cartData = response.data.cart as ICartP;
      dispatch(setCartData(cartData));
    } catch (error) {
      return rejectWithValue((error as catchError).message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (
    payload: { _id: string; product: Product },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await cartEndpoints.addToCart(payload._id);
      dispatch(setCartData(response.data.cart as ICartP));
      return response.data.cart as ICartP;
    } catch (error) {
      return rejectWithValue((error as catchError).message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    payload: { _id: string; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    if (payload.quantity === 0) {
      dispatch(removeItem({ _id: payload._id }));
      return rejectWithValue('Item removed from cart');
    } else if (payload.quantity > 10) {
      return rejectWithValue('Quantity cannot exceed 10');
    }
    try {
      const response = await cartEndpoints.updateCart(
        payload._id,
        payload.quantity
      );
      dispatch(setCartData(response.data.cart as ICartP));
      return response.data.cart as ICartP;
    } catch (error) {
      return rejectWithValue((error as catchError).message);
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (payload: { _id: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartEndpoints.removeItem(payload._id);
      dispatch(setCartData(response.data.cart as ICartP));
      return response.data.cart as ICartP;
    } catch (error) {
      return rejectWithValue((error as catchError).message);
    }
  }
);

export const syncCartOnLogin = createAsyncThunk(
  'cart/syncCartOnLogin',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { items } = state.cart.cartData;
    try {
      const response = await axios.put('/api/cart/sync', { items });
      dispatch(setCartData(response.data.cart as ICartP));
      return response.data.cart as ICartP;
    } catch (error) {
      return rejectWithValue((error as catchError).message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
      state.cartData.totalItems = action.payload.items
        .map(validateAndCalculateOfferPrice)
        .reduce((total: number, item: CartItem) => total + item.quantity, 0);
      state.cartData.totalAmount = action.payload.items
        .map(validateAndCalculateOfferPrice)
        .reduce(
          (total: number, item: CartItem) =>
            total + item.quantity * (item.offerPrice || item.product.price),
          0
        );
    },
    clearCart: state => {
      state.cartData = { items: [], totalItems: 0, totalAmount: 0 };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(fetchCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(syncCartOnLogin.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setCartData, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
