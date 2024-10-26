import axios from 'axios';

interface ImportMetaEnv {
  VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const apiUrl = (import.meta as unknown as ImportMeta).env.VITE_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.get('/api/refreshToken');
        const newToken = response.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
