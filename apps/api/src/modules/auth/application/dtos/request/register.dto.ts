import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  @ValidateIf((o) => o.email || !o.phone)
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.phone || !o.email)
  phone?: string;

  @ApiProperty({
    description: 'Password (min 6 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
