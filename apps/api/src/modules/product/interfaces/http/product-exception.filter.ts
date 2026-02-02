import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

@Catch(Prisma.PrismaClientKnownRequestError)
export class ProductPrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let message = 'Product database error';
    let status = 400;

    if (exception.code === 'P2003') {
      switch (exception.meta?.constraint) {
        case 'ProductVariant_sellerProfileId_fkey':
          message = 'Invalid seller profile ID (seller not found)';
          break;
        default:
          message = 'Foreign key constraint failed';
      }
    }

    if (exception.code === 'P2002') {
      message = 'Duplicate value (SKU already exists)';
    }

    res.status(status).json({
      success: false,
      message,
      error: { code: exception.code },
      statusCode: status,
    });
  }
}
