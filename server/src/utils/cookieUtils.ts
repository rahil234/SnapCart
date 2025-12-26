import { Response } from 'express';
import { signRefreshToken } from './jwtUtils';
import { UserRole } from '@snapcart/shared/types';
import * as process from 'node:process';

export const setRefreshTokenCookie = (
  res: Response,
  payload: { _id: string; role: UserRole }
) => {
  const refreshToken = signRefreshToken(payload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
