import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
  })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email of the user',
  })
  @IsOptional()
  @IsString()
  public email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the user',
  })
  @IsOptional()
  @IsString()
  public phone?: string;

  @ApiProperty({
    example: '2025-11-03T14:40:53Z',
    description: 'Date of birth of the user',
  })
  @IsOptional()
  @IsDateString()
  public dob?: Date;

  @ApiProperty({
    example: 'male',
    description: 'Gender of the user',
  })
  @IsEnum(['male', 'female', 'other'], {
    message: 'Status must be either active or inactive',
  })
  @IsOptional()
  public gender?: 'male' | 'female' | 'other';
}
