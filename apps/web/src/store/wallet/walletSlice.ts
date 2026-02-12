import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Wallet, WalletTransaction } from '@/types';
import { WalletService } from '@/services/wallet.service';

interface WalletState {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  totalTransactions: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  transactionsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WalletState = {
  wallet: null,
  transactions: [],
  totalTransactions: 0,
  status: 'idle',
  transactionsStatus: 'idle',
  error: null,
};

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    const { data, error } = await WalletService.getWallet();
    if (error) {
      return rejectWithValue(error.message || 'Failed to fetch wallet');
    }
    return data;
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (
    { limit = 20, offset = 0 }: { limit?: number; offset?: number },
    { rejectWithValue }
  ) => {
    const { data, error } = await WalletService.getTransactions(limit, offset);
    if (error) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
    return data;
  }
);

export const addMoneyToWallet = createAsyncThunk(
  'wallet/addMoney',
  async (
    {
      amount,
      description,
      reference,
    }: { amount: number; description?: string; reference?: string },
    { rejectWithValue, dispatch }
  ) => {
    const { data, error } = await WalletService.addMoney(
      amount,
      description,
      reference
    );
    if (error) {
      return rejectWithValue(error.message || 'Failed to add money');
    }
    // Refresh wallet after adding money
    dispatch(fetchWallet());
    return data;
  }
);

export const validateWalletBalance = createAsyncThunk(
  'wallet/validateBalance',
  async (amount: number, { rejectWithValue }) => {
    const { data, error } = await WalletService.validateBalance(amount);
    if (error) {
      return rejectWithValue(error.message || 'Failed to validate balance');
    }
    return data;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWallet: state => {
      state.wallet = null;
      state.transactions = [];
      state.totalTransactions = 0;
      state.status = 'idle';
      state.transactionsStatus = 'idle';
      state.error = null;
    },
    updateWalletBalance: (state, action) => {
      if (state.wallet) {
        state.wallet.balance = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      // Fetch wallet
      .addCase(fetchWallet.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wallet = action.payload;
        state.error = null;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Fetch transactions
      .addCase(fetchTransactions.pending, state => {
        state.transactionsStatus = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionsStatus = 'succeeded';
        state.transactions = action.payload.transactions;
        state.totalTransactions = action.payload.total;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsStatus = 'failed';
        state.error = action.payload as string;
      })
      // Add money
      .addCase(addMoneyToWallet.fulfilled, (state, action) => {
        if (state.wallet) {
          state.wallet.balance = action.payload.newBalance;
        }
      });
  },
});

export const { clearWallet, updateWalletBalance } = walletSlice.actions;
export default walletSlice.reducer;
