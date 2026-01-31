import {
  createParamDecorator,
  ExecutionContext,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

export const RawBody = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RawBodyRequest<Request>>();
    const rawBody = request.rawBody;
    if (!rawBody) throw new BadRequestException('Raw body is missing');
    return rawBody;
  },
);
