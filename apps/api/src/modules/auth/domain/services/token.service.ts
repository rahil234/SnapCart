import {
  JwtPayload,
  JwtVerifiedPayload,
} from '@/modules/auth/domain/types/jwt-payload.types';

export interface TokenService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyRefreshToken(token: string): JwtVerifiedPayload;
}
