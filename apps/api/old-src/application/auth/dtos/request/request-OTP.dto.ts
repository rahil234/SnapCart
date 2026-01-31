import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequestOTPDto {
  @ApiProperty({
    example: '+910000000000',
    description: 'Email or phone number of the user',
  })
  @IsNotEmpty({ message: 'Email or phone number is required' })
  public identifier: string;
}
