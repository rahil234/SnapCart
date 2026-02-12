import axios from 'axios';

import store from '@/store/store';
import { apiClient } from '@/api/axios';

const API_URL = import.meta.env.VITE_API_URL;

apiClient.interceptors.request.use(
  config => config,
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return apiClient(originalRequest);
      } catch {
        store.dispatch({ type: 'auth/logout' });
      }
    }
    return Promise.reject(error);
  }
);
