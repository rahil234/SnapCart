import {
  JwtPayload,
  JwtVerifiedPayload,
} from '@/domain/auth/types/jwt-payload.types';

export interface TokenService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyRefreshToken(token: string): JwtVerifiedPayload;
}
