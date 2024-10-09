import axiosInstance from './axiosInstance';

export const userLogin = (data: object) => {
  return axiosInstance.post('/api/user/login', data);
};

export const userSignup = (data: object) => {
  return axiosInstance.post('/api/user/signup', data);
};

export const fetchProducts = () => {
  return axiosInstance.get('/api/user/products');
};

export const fetchProductById = (productId: string) => {
  return axiosInstance.get(`/api/user/products/${productId}`);
};

