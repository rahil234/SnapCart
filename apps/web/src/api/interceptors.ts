import axios from 'axios';

import store from '@/app/store';
import { apiClient } from '@/api/axios';
import { AuthService } from '@/api/auth/auth.service';

apiClient.interceptors.request.use(
  config => {
    const token = store.getState().auth.accessToken;
    if (!config.headers.Authorization) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 403 &&
      error.response.data.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await AuthService.refresh();
        if (!res.data.success) {
          store.dispatch({ type: 'auth/logout' });
        }
        return axios(originalRequest);
      } catch (refreshError) {
        console.log('Error refreshing token:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
