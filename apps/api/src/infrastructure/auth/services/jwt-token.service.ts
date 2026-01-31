import { Injectable } from '@nestjs/common';

import {
  JwtPayload,
  JwtVerifiedPayload,
} from '@/domain/auth/types/jwt-payload.types';
import { JwtService } from '@/infrastructure/auth/jwt/jwt.service';
import { TokenService } from '@/domain/auth/services/token.service';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.signAccessToken(payload);
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.signRefreshToken(payload, this.REFRESH_TOKEN_EXPIRY);
  }

  verifyRefreshToken(token: string): JwtVerifiedPayload {
    return this.jwtService.verifyAccessToken(token);
  }
}
