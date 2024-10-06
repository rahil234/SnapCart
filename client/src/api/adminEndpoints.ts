import axiosInstance from './axiosInstance';

export const adminLogin = (data: object) => {
  return axiosInstance.post('/api/login', data);
};

export const adminSignup = (data: object) => {
  return axiosInstance.post('/api/signup', data);
};

export const fetchProducts = () => {
  return axiosInstance.get('/');
};