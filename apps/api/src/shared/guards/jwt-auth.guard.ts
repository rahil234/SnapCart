import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { JwtService } from '@/shared/infrastructure/jwt/jwt.service';
import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    let accessToken: string | undefined;
    const authHeader = request.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];
    }

    if (!accessToken) {
      accessToken = request.cookies['access_token'] as string;
    }

    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = this.jwtService.verifyAccessToken(accessToken);
      request.user = {
        id: payload.sub,
        role: payload.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
