import { Validate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ActorType, AuthMethod } from '@/domain/auth/enums';
import { PasswordOrOtpConstraint } from '@/application/auth/dtos/request/password-or-otp.validator';

export class LoginDto {
  @Validate(PasswordOrOtpConstraint)
  private readonly _passwordOrOtpCheck!: never;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email or phone number',
  })
  identifier: string;

  @ApiPropertyOptional({
    example: 'strongPassword123',
    description: 'User password',
  })
  password?: string;

  @ApiProperty({ example: '0000', description: 'OTP', required: false })
  otp?: string;

  @ApiProperty({
    example: 'customer',
    enum: ActorType,
    description: 'Actor type',
  })
  actor: ActorType;

  @ApiProperty({
    example: 'OTP',
    enum: AuthMethod,
    description: 'Authentication method',
  })
  method: AuthMethod;
}
