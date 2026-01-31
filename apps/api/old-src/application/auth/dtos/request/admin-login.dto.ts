import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Admin email address',
  })
  public email: string;

  @IsString({ message: 'Password must be a string' })
  @ApiProperty({
    example: 'password',
    description: 'Admin password',
  })
  public password: string;
}
