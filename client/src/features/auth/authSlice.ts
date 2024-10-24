import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { User } from 'shared/types';
import { AxiosError } from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  token: string | null;
}

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;

    try {
      const response = await axiosInstance.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data.message || error.response.data;
      }
      return rejectWithValue(errorMessage);
    }
  }
);


const token = localStorage.getItem('token');
const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null;

const initialState: AuthState = {
  isAuthenticated: !!token,
  user: user,
  token: token || null,
  error: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: state => {
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserDetails.pending, (state: AuthState) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state: AuthState, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state: AuthState, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
