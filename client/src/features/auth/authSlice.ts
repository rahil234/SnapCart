import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from 'shared/types';
import { ImportMeta } from 'shared/types';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  accessToken: string | null;
}

const apiUrl = (import.meta as unknown as ImportMeta).env
  .VITE_API_URL as string;

// Define the thunk to refresh the token
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshAuthToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}api/auth/refresh-token`,
        null,
        {
          withCredentials: true,
        }
      );

      // Dispatch action to update Redux state with new token and user data
      dispatch(setCredentials(response.data));
      return response.data;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      dispatch(clearCredentials());
      return rejectWithValue('Failed to refresh token');
    }
  }
);

// Define the thunk to log out the user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${apiUrl}api/auth/logout`, null, {
        withCredentials: true,
      });

      // Dispatch action to clear Redux state
      dispatch(clearCredentials());
    } catch (error) {
      console.error('Failed to log out:', error);
      return rejectWithValue('Failed to log out');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
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
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      console.log('Setting credentials:', action.payload);
    },
    clearCredentials: state => {
      // axios.post(`${apiUrl}api/auth/logout`, null, {
      //   withCredentials: true,
      // });
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(refreshAuthToken.pending, (state: AuthState) => {
        state.status = 'loading';
      })
      .addCase(refreshAuthToken.fulfilled, (state: AuthState, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        setCredentials(action.payload);
      })
      .addCase(refreshAuthToken.rejected, (state: AuthState, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
    builder
      .addCase(logoutUser.pending, (state: AuthState) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state: AuthState) => {
        state.status = 'succeeded';
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logoutUser.rejected, (state: AuthState, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
