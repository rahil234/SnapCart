import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  BadRequestErrorDto,
  UnauthorizedErrorDto,
  ForbiddenErrorDto,
  NotFoundErrorDto,
  ConflictErrorDto,
  InternalServerErrorDto,
} from '@/shared/dto/common/error-response.dto';

/**
 * Common error responses decorator
 * Adds standard error response documentation to endpoints
 */
export const ApiCommonErrorResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data or validation failed',
      type: BadRequestErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      type: InternalServerErrorDto,
    }),
  );
};

/**
 * Error responses for authenticated endpoints
 */
export const ApiAuthErrorResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Authentication required',
      type: UnauthorizedErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions',
      type: ForbiddenErrorDto,
    }),
  );
};

/**
 * 404 Not Found error response
 */
export const ApiNotFoundResponse = (resourceName: string = 'Resource') => {
  return ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${resourceName} not found`,
    type: NotFoundErrorDto,
  });
};

/**
 * 409 Conflict error response
 */
export const ApiConflictResponse = (description: string = 'Resource already exists') => {
  return ApiResponse({
    status: HttpStatus.CONFLICT,
    description,
    type: ConflictErrorDto,
  });
};
