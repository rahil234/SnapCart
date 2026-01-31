import { IsString, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthMethod } from '@/modules/auth/domain/enums';

export class LoginDto {
  @ApiProperty({ description: 'Email or phone number', example: 'user@example.com' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'Authentication method', enum: AuthMethod, example: AuthMethod.PASSWORD })
  @IsEnum(AuthMethod)
  method: AuthMethod;

  @ApiPropertyOptional({ description: 'Password (required for PASSWORD method)', example: 'password123' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.method === AuthMethod.PASSWORD)
  password?: string;

  @ApiPropertyOptional({ description: 'OTP code (required for OTP method)', example: '1234' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.method === AuthMethod.OTP)
  otp?: string;
}
