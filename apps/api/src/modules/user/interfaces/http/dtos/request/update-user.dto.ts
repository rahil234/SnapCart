import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { UserGender } from '@/modules/user/domain/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'User email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsDateString()
  @IsOptional()
  dob?: Date;

  @ApiPropertyOptional({ description: 'Gender', enum: UserGender })
  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;
}
