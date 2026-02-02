import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard error response for 400 Bad Request
 */
export class BadRequestErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: ['name should not be empty', 'email must be an email'],
    description: 'List of validation errors',
    type: [String],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

/**
 * Standard error response for 401 Unauthorized
 */
export class UnauthorizedErrorDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}

/**
 * Standard error response for 403 Forbidden
 */
export class ForbiddenErrorDto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Forbidden resource' })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;
}

/**
 * Standard error response for 404 Not Found
 */
export class NotFoundErrorDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Resource not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}

/**
 * Standard error response for 409 Conflict
 */
export class ConflictErrorDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Resource already exists' })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}

/**
 * Standard error response for 500 Internal Server Error
 */
export class InternalServerErrorDto {
  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({ example: 'Internal server error' })
  message: string;

  @ApiProperty({ example: 'Internal Server Error' })
  error: string;
}
