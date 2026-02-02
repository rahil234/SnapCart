import { apiConfig } from '@/api/client';
import { AuthenticationApi } from '@/api/generated';
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
};
