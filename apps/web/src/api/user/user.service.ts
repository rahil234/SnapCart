import {
  CreateAddressDto,
  UpdateAddressDto,
  UpdateUserDto,
  UsersApi,
} from '@/api/generated';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const userApi = new UsersApi(apiConfig);

export const UserService = {
  getUsers: () => handleRequest(userApi.userControllerFindAll),
  getMe: () => handleRequest(userApi.userControllerGetMe),
  updateMe: (dto: UpdateUserDto) => userApi.userControllerUpdateMe(dto),
  addAddress: (dto: CreateAddressDto) => userApi.userControllerAddAddress(dto),
  updateAddress: (addressId: string, dto: UpdateAddressDto) =>
    userApi.userControllerUpdateAddress(addressId, dto),
  deleteAddress: (addressId: string) =>
    userApi.userControllerDeleteAddress(addressId),
  setPrimaryAddress: (addressId: string) =>
    userApi.userControllerSetPrimaryAddress(addressId),
  changePassword: (password: string, newPassword: string) =>
    userApi.userControllerChangePassword({ password, newPassword }),
  uploadProfilePicture: (file: File) =>
    userApi.userControllerUploadProfilePicture(file),
  getReferralCode: () => userApi.userControllerGetReferralCode(),
  verifyOtp: (email: string, otp: string) =>
    userApi.userControllerVerifyOtp({ email, otp }),
  userSignUp: (data: any) => userApi.userControllerSignUp(data),
  sendOtp: (email: string) => userApi.userControllerSendOtp({ email }),
  resendOtp: (email: string) => userApi.userControllerResendOtp({ email }),
  forgotPassword: (email: string) =>
    userApi.userControllerForgotPassword({ email }),
  resetPassword: (data: any) => userApi.userControllerResetPassword(data),
  allowUser: (userId: string) => userApi.userControllerAllowUser(userId),
  blockUser: (userId: string) => userApi.userControllerBlockUser(userId),
};
