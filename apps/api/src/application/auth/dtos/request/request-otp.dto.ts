import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOTPDto {
  @ApiProperty({ description: 'Email or phone number', example: 'user@example.com' })
  @IsString()
  identifier: string;
}
