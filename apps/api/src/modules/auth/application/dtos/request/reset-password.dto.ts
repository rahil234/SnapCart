import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email or phone number',
    example: 'user@example.com',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'OTP code (4 digits)',
    example: '1234',
  })
  @IsString()
  otp: string;

  @ApiProperty({
    description: 'New password (min 6 characters)',
    example: 'newpassword123',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
