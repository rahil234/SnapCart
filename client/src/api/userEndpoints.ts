import axiosInstance from './axiosInstance';

export const userLogin = (data: object) => {
  return axiosInstance.post('/api/user/login', data);
};

export const userGoogleLogin = (access_token: string) => {
  return axiosInstance.post('/api/user/google-login', { accessToken: access_token });
}

export const userSignUp = (data: object) => {
  return axiosInstance.post('/api/user/signup', data);
};

export const sendOtp = (email: string) => {
  return axiosInstance.post('/api/user/send-otp', { email });
};

export const resendOtp = (email: string) => {
  return axiosInstance.post('/api/user/send-otp', { email });
};

export const verifyOtp = (email:string, otp: string) => {
  return axiosInstance.post('/api/user/verify-otp', {email, otp });
};

export const fetchProducts = () => {
  return axiosInstance.get('/api/user/products');
};

export const fetchProductById = (productId: string) => {
  return axiosInstance.get(`/api/user/product/${productId}`);
};
