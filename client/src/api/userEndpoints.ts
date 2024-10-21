import axiosInstance from './axiosInstance';

const userLogin = (data: object) => {
  return axiosInstance.post('/api/user/login', data);
};

const userGoogleLogin = (access_token: string) => {
  return axiosInstance.post('/api/user/google-login', {
    accessToken: access_token,
  });
};

const userSignUp = (data: object) => {
  return axiosInstance.post('/api/user/signup', data);
};

const sendOtp = (email: string) => {
  return axiosInstance.post('/api/user/send-otp', { email });
};

const resendOtp = (email: string) => {
  return axiosInstance.post('/api/user/send-otp', { email });
};

const verifyOtp = (email: string, otp: string) => {
  return axiosInstance.post('/api/user/verify-otp', { email, otp });
};

const fetchProducts = () => {
  return axiosInstance.get('/api/user/products');
};

const fetchProductById = (productId: string) => {
  return axiosInstance.get(`/api/user/product/${productId}`);
};

const blockUser = async (userId: string) => {
  return await axiosInstance.patch(`/api/user/${userId}/block`);
};

const allowUser = async (userId: string) => {
  return await axiosInstance.patch(`/api/user/${userId}/allow`);
};

export default {
  sendOtp,
  resendOtp,
  verifyOtp,
  fetchProducts,
  fetchProductById,
  blockUser,
  allowUser,
  userLogin,
  userGoogleLogin,
  userSignUp,
};
