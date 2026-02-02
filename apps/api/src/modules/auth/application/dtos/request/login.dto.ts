import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateIf, IsIn } from 'class-validator';

import { AuthMethod } from '@/modules/auth/domain/enums';

export class LoginDto {
  @ApiProperty({
    description: 'Email or phone number',
    example: 'user@example.com',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Authentication method (PASSWORD or OTP only)',
    enum: [AuthMethod.PASSWORD, AuthMethod.OTP],
    example: AuthMethod.PASSWORD,
  })
  @IsIn([AuthMethod.PASSWORD, AuthMethod.OTP], {
    message:
      'Method must be PASSWORD or OTP. Use /auth/login/google for Google authentication.',
  })
  method: AuthMethod.PASSWORD | AuthMethod.OTP;

  @ApiPropertyOptional({
    description: 'Password (required for PASSWORD method)',
    example: 'password123',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.method === AuthMethod.PASSWORD)
  password?: string;

  @ApiPropertyOptional({
    description: 'OTP code (required for OTP method)',
    example: '1234',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.method === AuthMethod.OTP)
  otp?: string;
}
