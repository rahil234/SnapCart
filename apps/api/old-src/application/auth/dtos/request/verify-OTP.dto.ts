import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginVerifyOTPDto {
  @ApiProperty({
    example: '+910000000000',
    description: 'Phone number of the user',
  })
  @IsNotEmpty({ message: 'Identifier is required' })
  public identifier: string;

  @IsString({ message: 'OTP must be a String' })
  @Length(4, 4, { message: 'OTP must be 6 characters long' })
  @ApiProperty({
    example: '0000',
    description: 'OTP',
  })
  public otp: string;
}
