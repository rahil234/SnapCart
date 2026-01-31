import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userId = request.user.role;
    if (!userId)
      throw new UnauthorizedException('User Role not found in request');
    return userId;
  },
);
