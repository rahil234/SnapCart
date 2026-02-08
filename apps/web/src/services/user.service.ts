import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';
import { UpdateUserDto, UpdateUserStatusDto, UsersApi } from '@/api/generated';

const userApi = new UsersApi(apiConfig, undefined, apiClient);

export const UserService = {
  getUsers: () => handleRequest(() => userApi.userControllerFindAll()),
  getMe: () => handleRequest(() => userApi.userControllerGetMe()),
  updateMe: (dto: UpdateUserDto) =>
    handleRequest(() => userApi.userControllerUpdate(dto)),
  updateStatus: (userId: string, dto: UpdateUserStatusDto) =>
    handleRequest(() => userApi.userControllerUpdateStatus(userId, dto)),
  uploadProfilePicture: (file: File) =>
    handleRequest(() => userApi.userControllerUploadProfilePicture(file)),
  changePassword: (password: string, newPassword: string) =>
    userApi.userControllerChangePassword({ password, newPassword }),
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
