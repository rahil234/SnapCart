import jwt, { SignOptions } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JWTPayload } from '@/common/types';

type JWTSignOptionsExpiresIn = SignOptions['expiresIn'];

@Injectable()
export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiry: JWTSignOptionsExpiresIn;

  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiry: JWTSignOptionsExpiresIn;

  constructor() {
    const configService = new ConfigService();

    this.accessTokenSecret = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );

    this.accessTokenExpiry = configService.getOrThrow<JWTSignOptionsExpiresIn>(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );

    this.refreshTokenSecret = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );

    this.refreshTokenExpiry = configService.getOrThrow<JWTSignOptionsExpiresIn>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
  }

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '7d' });
  }

  verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, this.accessTokenSecret) as JWTPayload;
  }

  verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, this.refreshTokenSecret) as JWTPayload;
  }
}
