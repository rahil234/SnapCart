import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWithGoogleDto {
  @ApiProperty({ description: 'Google ID token', example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...' })
  @IsString()
  idToken: string;
}
