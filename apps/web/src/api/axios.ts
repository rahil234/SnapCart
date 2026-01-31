import axios from 'axios';

const apiUrl = (import.meta as unknown as ImportMeta).env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
