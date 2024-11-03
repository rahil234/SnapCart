// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { ICart } from 'shared/types';

// // Async thunk to update the cart in the backend
// export const updateCart = createAsyncThunk(
//   'cart/update',
//   async (_, { getState }) => {
//     const cartState = (getState() as { cart: ICart }).cart;
//     const response = await fetch('/api/cart', {
//       method: 'PUT', // Assuming the backend uses PUT for updates
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(cartState),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to update cart');
//     }
//     return await response.json();
//   }
// );
// // Initial state setup with local storage
// const initialState: ICart = localStorage.getItem('cart')
//   ? JSON.parse(localStorage.getItem('cart')!)
//   : {
//       _id: '',
//       userId: '',
//       items: [],
//       totalPrice: 0,
//       status: 'idle',
//     };

// export const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     addItemToCart: (
//       state,
//       action: PayloadAction<{ productId: string; quantity: number }>
//     ) => {
//       const { productId, quantity } = action.payload;
//       const existingItem = state.items.find(item => item._id === productId);
//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         state.items.push({
//           _id: productId,
//           product: productId,
//           quantity: quantity,
//         });
//       }
//     },
//     removeItemFromCart: (state, action: PayloadAction<string>) => {
//       state.items = state.items.filter(item => item._id !== action.payload);
//     },
//     updateItemQuantity: (
//       state,
//       action: PayloadAction<{ productId: string; quantity: number }>
//     ) => {
//       const { productId, quantity } = action.payload;
//       const existingItem = state.items.find(item => item._id === productId);
//       if (existingItem) {
//         existingItem.quantity = quantity;
//       }
//     },
//     clearCart: state => {
//       state.items = [];
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(updateCart.fulfilled, (_state, action) => {
//         // Handle the fulfilled state
//         console.log('Cart updated successfully:', action.payload);
//       })
//       .addCase(updateCart.rejected, (_state, action) => {
//         // Handle the rejected state
//         console.error('Failed to update cart:', action.error.message);
//       });
//   },
// });

// export const {
//   addItemToCart,
//   removeItemFromCart,
//   updateItemQuantity,
//   clearCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;
