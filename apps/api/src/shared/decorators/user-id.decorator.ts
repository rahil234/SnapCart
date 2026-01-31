import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userId = request.user.id;
    if (!userId)
      throw new UnauthorizedException('User ID not found in request');
    return userId;
  },
);
