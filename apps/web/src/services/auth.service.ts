import {
  AuthenticationApi,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RequestOTPDto,
} from '@/api/generated';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const authApi = new AuthenticationApi(apiConfig);

export const AuthService = {
  userLogin: (payload: { email: string; password: string }) =>
    handleRequest(() =>
      authApi.authControllerLogin({
        identifier: payload.email,
        password: payload.password,
        method: 'PASSWORD',
      })
    ),

  userGoogleLogin: (accessToken: string) =>
    handleRequest(() =>
      authApi.authControllerLoginWithGoogle({
        idToken: accessToken,
      })
    ),

  register: (payload: { email: string; password: string }) =>
    handleRequest(() =>
      authApi.authControllerRegister({
        email: payload.email,
        password: payload.password,
      })
    ),

  refresh: () => handleRequest(() => authApi.authControllerRefreshToken()),

  logout: () => handleRequest(() => authApi.authControllerLogout()),

  adminLogin: (payload: { email: string; password: string }) =>
    handleRequest(() =>
      authApi.authControllerLogin({
        identifier: payload.email,
        password: payload.password,
        method: 'PASSWORD',
      })
    ),

  // Password Management
  changePassword: (dto: ChangePasswordDto) =>
    handleRequest(() => authApi.authControllerChangePassword(dto)),

  forgotPassword: (dto: ForgotPasswordDto) =>
    handleRequest(() => authApi.authControllerForgotPassword(dto)),

  resetPassword: (dto: ResetPasswordDto) =>
    handleRequest(() => authApi.authControllerResetPassword(dto)),

  // OTP Management
  requestOTP: (dto: RequestOTPDto) =>
    handleRequest(() => authApi.authControllerRequestOTP(dto)),

  verifyOTP: (identifier: string, otp: string) =>
    handleRequest(() =>
      authApi.authControllerVerifyOTP({
        identifier,
        otp,
      }),
    ),
};
