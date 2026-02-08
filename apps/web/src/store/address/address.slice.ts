import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Address } from '@/types/address';
import { AddressService } from '@/services/address.service';

/**
 * Async thunk – fetch addresses for logged-in user
 * Auth context are resolved on the backend via token
 */
export const fetchMyAddresses = createAsyncThunk(
  'address/fetchMyAddresses',
  async (_, { rejectWithValue }) => {
    const { data, error } = await AddressService.fetchMyAddresses();

    if (error) {
      return rejectWithValue('Failed to fetch addresses');
    }

    return data;
  }
);

interface AddressState {
  items: Address[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AddressState = {
  items: [],
  status: 'idle',
  error: null,
};

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddresses: state => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyAddresses.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMyAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { clearAddresses } = addressSlice.actions;

export default addressSlice.reducer;
