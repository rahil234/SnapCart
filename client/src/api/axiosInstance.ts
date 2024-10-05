import axios from 'axios';

const apiUrl = (import.meta as any).env.VITE_API_URL as string;
const token = "YOUR_API_TOKEN"

console.log(apiUrl);

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Add Authorization if needed
    'X-Requested-With': 'XMLHttpRequest', // Custom header example
    'Access-Control-Allow-Origin': '*', // Example for CORS (use specific origin if needed)
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;