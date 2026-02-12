import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CartItem } from '@/types';
import { RootState } from '@/store/store';
import { CartService } from '@/services/cart.service';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

type CartData = Pick<CartState, 'items' | 'totalItems' | 'totalAmount'>;

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  status: 'idle',
  error: null,
};

export const fetchCart = createAsyncThunk<
  CartData,
  void,
  { rejectValue: string }
>('cart/fetchCart', async (_, { rejectWithValue }) => {
  const { data, error } = await CartService.getCart();

  if (error) {
    return rejectWithValue(error.message || 'Failed to fetch cart');
  }

  return data;
});

export const addItemToCart = createAsyncThunk<
  void,
  { productId: string; variantId: string; quantity: number },
  { rejectValue: string }
>('cart/addItemToCart', async (payload, { dispatch, rejectWithValue }) => {
  const { error } = await CartService.addToCart({
    productId: payload.productId,
    productVariantId: payload.variantId,
    quantity: payload.quantity,
  });

  if (error) {
    return rejectWithValue(error.message || 'Failed to add item');
  }

  dispatch(fetchCart());
});

export const updateQuantity = createAsyncThunk<
  void,
  { id: string; quantity: number },
  { rejectValue: string }
>('cart/updateQuantity', async (payload, { dispatch, rejectWithValue }) => {
  const { id, quantity } = payload;

  if (quantity <= 0) {
    return rejectWithValue('Item removed from cart');
  }

  if (quantity > 10) {
    return rejectWithValue('Quantity cannot exceed 10');
  }

  const { error } = await CartService.updateCart(id, {
    quantity,
  });

  if (error) {
    return rejectWithValue(error.message || 'Failed to update quantity');
  }

  dispatch(fetchCart());
});

export const removeItem = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string }
>('cart/removeItem', async ({ id }, { dispatch, rejectWithValue }) => {
  const { error } = await CartService.removeItem(id);

  if (error) {
    console.log('Error removing item:', error);
    return rejectWithValue(error.message || 'Failed to remove item');
  }

  dispatch(fetchCart());
});

export const syncCartOnLogin = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState; rejectValue: string }
>('cart/syncCartOnLogin', async (_, { getState }) => {
  const { items } = getState().cart;

  const { data } = await axios.put('/api/cart/sync', { items });

  return data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.status = 'succeeded';
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(syncCartOnLogin.rejected, (state, action) => {
        state.error = action.payload ?? null;
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
