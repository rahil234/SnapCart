import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';
import { UpdateUserDto, UsersApi } from '@/api/generated';

const userApi = new UsersApi(apiConfig, undefined, apiClient);

export const UserService = {
  getUsers: () => handleRequest(() => userApi.userControllerFindAll()),
  getMe: () => handleRequest(() => userApi.userControllerGetMe()),
  updateMe: (dto: UpdateUserDto) =>
    handleRequest(() => userApi.userControllerUpdate(dto)),
  allowUser: (userId: string) =>
    userApi.userControllerUpdateStatus(userId, { status: 'active' }),
  blockUser: (userId: string) =>
    userApi.userControllerUpdateStatus(userId, { status: 'suspended' }),
  changePassword: (password: string, newPassword: string) =>
    userApi.userControllerChangePassword({ password, newPassword }),
  uploadProfilePicture: (file: File) =>
    handleRequest(() => userApi.userControllerUploadProfilePicture(file)),
  getReferralCode: () => userApi.userControllerGetReferralCode(),
  verifyOtp: (email: string, otp: string) =>
    userApi.userControllerVerifyOtp({ email, otp }),
  userSignUp: (data: any) => userApi.userControllerSignUp(data),
  sendOtp: (email: string) => userApi.userControllerSendOtp({ email }),
  resendOtp: (email: string) => userApi.userControllerResendOtp({ email }),
  forgotPassword: (email: string) =>
    userApi.userControllerForgotPassword({ email }),
  resetPassword: (data: any) => userApi.userControllerResetPassword(data),
};
