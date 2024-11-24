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

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshAuthToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/refresh-token`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch {
      // store.dispatch(clearUser());
      localStorage.removeItem('sessionActive');
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
      localStorage.setItem('sessionActive', 'true');
    },
    changeProfilePicture: (state, action) => {
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
    },
    clearUser: state => {
      console.log('clearing user');
      localStorage.removeItem('sessionActive');
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: builder => {
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

export const { setCredentials, changeProfilePicture, clearUser } =
  authSlice.actions;
export default authSlice.reducer;
