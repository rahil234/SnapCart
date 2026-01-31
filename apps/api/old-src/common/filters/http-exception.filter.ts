import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const { message } = exception.getResponse() as { message: string };

    response.status(status).json({
      success: false,
      message: message || 'Something went wrong',
      error: { code: exception.name },
      statusCode: status,
    });
  }
}
