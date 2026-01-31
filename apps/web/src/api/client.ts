import { apiClient } from '@/api/axios';
import { Configuration } from '@/api/generated';

const API_URL = import.meta.env.VITE_API_URL;

export const apiConfig = new Configuration({
  basePath: API_URL,
  baseOptions: {
    axios: apiClient,
    withCredentials: true,
  },
});
