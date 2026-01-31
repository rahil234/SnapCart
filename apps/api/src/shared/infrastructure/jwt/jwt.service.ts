import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import {
  JwtAccessTokenPayload,
  JwtRefreshTokenPayload,
  JwtVerifiedPayload,
} from '@/domain/auth/types/jwt-payload.types';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  signAccessToken(payload: JwtAccessTokenPayload): string {
    return this.jwt.sign(payload);
  }

  signRefreshToken(
    payload: JwtRefreshTokenPayload,
    expiresIn: ms.StringValue,
  ): string {
    return this.jwt.sign(payload, { expiresIn: expiresIn });
  }

  verifyAccessToken(token: string): JwtVerifiedPayload {
    return this.jwt.verify<JwtVerifiedPayload>(token);
  }
}
