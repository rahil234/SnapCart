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
  return axiosInstance.post('/api/user/signup', data,{
    withCredentials: true,
  });
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

const updateUserProfile = async (data: object) => {
  return axiosInstance.patch('/api/user/update-profile', data);
};

const blockUser = async (userId: string) => {
  return axiosInstance.patch(`/api/user/${userId}/block`);
};

const allowUser = async (userId: string) => {
  return axiosInstance.patch(`/api/user/${userId}/allow`);
};

const addAddress = async (address: object) => {
  return axiosInstance.post('/api/user/add-address', address);
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
  updateUserProfile,
  userGoogleLogin,
  userSignUp,
  addAddress,
};
