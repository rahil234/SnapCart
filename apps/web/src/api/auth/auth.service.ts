import { apiConfig } from '@/api/client';
import { AuthenticationApi } from '@/api/generated';

const authApi = new AuthenticationApi(apiConfig);

export const AuthService = {
  userLogin: (payload: { email: string; password: string }) =>
    authApi.authControllerLogin({
      identifier: payload.email,
      password: payload.password,
      method: 'PASSWORD',
    }),

  userGoogleLogin: (accessToken: string) =>
    authApi.authControllerLogin({
      identifier: accessToken,
      method: 'GOOGLE',
    }),

  register: (payload: { email: string; password: string }) =>
    authApi.authControllerRegister({
      email: payload.email,
      password: payload.password,
    }),

  refresh: () => authApi.authControllerRefreshToken(),

  logout: () => authApi.authControllerLogout(),

  adminLogin: (payload: { email: string; password: string }) =>
    authApi.authControllerLogin({
      identifier: payload.email,
      password: payload.password,
      method: 'PASSWORD',
    }),
};
