import axiosInstance from './axiosInstance';

const userLogin = (data: object) => {
  return axiosInstance.post('/api/user/login', data, {
    withCredentials: true,
  });
};

const userGoogleLogin = (access_token: string) => {
  return axiosInstance.post(
    '/api/user/google-login',
    {
      googleAccessToken: access_token,
    },
    {
      withCredentials: true,
    }
  );
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

const forgotPassword = (email: string) => {
  return axiosInstance.post('/api/user/forgot-password', { email });
};

const fetchProducts = () => {
  return axiosInstance.get('/api/user/products');
};

const fetchProductById = (productId: string) => {
  return axiosInstance.get(`/api/user/product/${productId}`);
};

const uploadProfilePicture = async (file: File) => {
  axiosInstance.post('/api/user/upload-profile-picture', {file}, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const blockUser = async (userId: string) => {
  return await axiosInstance.patch(`/api/user/${userId}/block`);
};

const allowUser = async (userId: string) => {
  return await axiosInstance.patch(`/api/user/${userId}/allow`);
};

const fetchCartData = async () => {
  return await axiosInstance.get('/api/user/shopping-cart');
};

const addToCart = async (productId: string) => {
  return await axiosInstance.post('/api/user/shopping-cart', { productId });
};

const editCart = async (productId: string, quantity: number) => {
  return await axiosInstance.patch('/api/user/shopping-cart', {
    productId,
    quantity,
  });
};

export default {
  userLogin,
  sendOtp,
  resendOtp,
  verifyOtp,
  forgotPassword,
  fetchProducts,
  fetchProductById,
  blockUser,
  allowUser,
  uploadProfilePicture,
  userGoogleLogin,
  userSignUp,
  fetchCartData,
  addToCart,
  editCart,
};
