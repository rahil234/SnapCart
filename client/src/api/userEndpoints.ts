import axiosInstance from './axiosInstance';

const userLogin = (data: object) => {
  return axiosInstance.post('/api/user/login', data, {
    withCredentials: true,
  });
};

const userGoogleLogin = async (access_token: string) => {
  return await axiosInstance.post(
    '/api/user/google-login',
    {
      googleAccessToken: access_token,
      referralCode: localStorage.getItem('referralCode'),
    },
    {
      withCredentials: true,
    }
  );
};

const userSignUp = (data: object) => {
  return axiosInstance.post(
    '/api/user/signup',
    { ...data, referralCode: localStorage.getItem('referralCode') },
    {
      withCredentials: true,
    }
  );
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

const changePassword = (password: string, newPassword: string) => {
  return axiosInstance.post('/api/user/change-password', {
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
  return axiosInstance.post('/api/user/address', address);
};

const editAddress = async (addressId: string, address: object) => {
  return axiosInstance.put('/api/user/address/' + addressId, address);
};

const deleteAddress = async (addressId: string) => {
  return axiosInstance.delete(`/api/user/address/${addressId}`);
};

const getReferralCode = async () => {
  return axiosInstance.get('/api/user/referral-code');
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
  editAddress,
  deleteAddress,
  getReferralCode,
};
