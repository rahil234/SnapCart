import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email address' })
  email: string;

  @ApiPropertyOptional({
    example: '+910000000000',
    description: 'Phone number',
  })
  phone?: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  password: string;
}
