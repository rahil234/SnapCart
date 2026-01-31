import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '@/modules/user/domain/enums';

export class CreateUserDto {
  @ApiPropertyOptional({ description: 'User email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
