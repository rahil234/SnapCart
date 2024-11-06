import { Response } from 'express';
import { signRefreshToken } from './jwtUtils';
import { UserRole } from '@shared/types';

export const setRefreshTokenCookie = (
  res: Response,
  payload: { _id: string; role: UserRole }
) => {
  const refreshToken = signRefreshToken(payload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
};
