import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { User } from '@/types';
import { fetchCart } from '@/store/cart/cartSlice';
import { UserService } from '@/services/user.service';
import { fetchWallet } from '@/store/wallet/walletSlice';
import { fetchMyAddresses } from '@/store/address/address.slice';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const apiUrl = import.meta.env.VITE_API_URL;

export const initialAuthSync = createAsyncThunk(
  'auth/initialSync',
  async (_, { dispatch }) => {
    const sessionActive = localStorage.getItem('sessionActive');

    if (sessionActive) {
      await dispatch(fetchUser());
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/me',
  async (_, { dispatch, rejectWithValue }) => {
    const { data, error } = await UserService.getMe();

    if (error) {
      console.log('error fetching user:', error);
      return rejectWithValue('Failed to fetch user');
    }

    if (data.role === 'CUSTOMER') {
      dispatch(fetchCart());
      dispatch(fetchMyAddresses());
      dispatch(fetchWallet());
    }

    return data;
  }
);

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshAuthToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/refresh`, null, {
        withCredentials: true,
      });
      return response.data;
    } catch {
      return rejectWithValue('Failed to refresh token');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${apiUrl}/api/auth/logout`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Failed to log out:', error);
      return rejectWithValue('Failed to log out');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('sessionActive', 'true');
    },
    clearUser: state => {
      localStorage.removeItem('sessionActive');
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      })
      .addCase(fetchUser.rejected, state => {
        authSlice.caseReducers.clearUser(state);
        state.status = 'failed';
      });
    builder
      .addCase(refreshAuthToken.pending, state => {
        state.status = 'loading';
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
    builder
      .addCase(logoutUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, state => {
        authSlice.caseReducers.clearUser(state);
        state.status = 'succeeded';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
