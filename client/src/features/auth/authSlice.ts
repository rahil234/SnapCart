import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;

    try {
      const response = await axiosInstance.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const token = localStorage.getItem('token');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

const initialState = {
  isAuthenticated: token ? true : false,
  user: user,
  token: token || null,
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
      .addCase(fetchUserDetails.pending, (state: any) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state: any, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
