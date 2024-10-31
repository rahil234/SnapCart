import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartEndpoints from '@/api/cartEndpoints';
import { ICart } from 'shared/types';

interface ICartItem extends ICart {
  status: string;
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await cartEndpoints.getCart();
  return response.data;
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    _id: '',
    userId: '',
    items: [],
    totalPrice: 0,
    status: 'idle',
  } as ICartItem,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(
        i => i.productId === item.productId
      ); // Corrected to productId
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push({
          productId: item.productId, // Ensure the object structure matches ICart
          quantity: item.quantity,
        });
      }
    },
    removeItemFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
    },
    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(
        item => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCart.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
