import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOTPDto {
  @ApiProperty({ description: 'Email or phone number', example: 'user@example.com' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'OTP code (4 digits)', example: '1234' })
  @IsString()
  @Length(4, 4)
  otp: string;
}
