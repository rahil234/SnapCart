import { Inject, Injectable } from '@nestjs/common';

import {
  JwtPayload,
  JwtVerifiedPayload,
} from '@/modules/auth/domain/types/jwt-payload.types';
import { JwtService } from '@/shared/infrastructure/jwt/jwt.service';
import { TokenService } from '@/modules/auth/domain/services/token.service';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  constructor(@Inject('JwtService') private readonly jwtService: JwtService) {}

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
