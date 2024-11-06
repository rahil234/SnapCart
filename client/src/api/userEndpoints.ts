import axiosInstance from './axiosInstance';

const userLogin = (data: object) => {
  return axiosInstance.post('/api/user/login', data, {
    withCredentials: true,
  });
};

const userGoogleLogin = async (access_token: string) => {
  const response = await axiosInstance.post(
    '/api/user/google-login',
    {
      googleAccessToken: access_token,
    },
    {
      withCredentials: true,
    }
  );
  console.log('Google login', response);
  return response;
};

const userSignUp = (data: object) => {
  return axiosInstance.post('/api/user/signup', data, {
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

const changePassword = ({
  password,
  newPassword,
}: {
  password: string;
  newPassword: string;
}) => {
  return axiosInstance.post('/api/user/reset-password', {
    password,
    newPassword,
  });
};

const resetPassword = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return axiosInstance.post('/api/user/reset-password', { email, password });
};

const uploadProfilePicture = async (file: File) => {
  return axiosInstance.post(
    '/api/user/upload-profile-picture',
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
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
  changePassword,
  resetPassword,
  blockUser,
  allowUser,
  uploadProfilePicture,
  updateUserProfile,
  userGoogleLogin,
  userSignUp,
  addAddress,
};
