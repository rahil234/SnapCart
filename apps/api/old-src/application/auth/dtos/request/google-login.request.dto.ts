import { ActorType } from '@/domain/auth/enums';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({ example: '', description: 'Google access token' })
  idToken: string;

  @ApiProperty({
    example: 'customer',
    enum: ActorType,
    description: 'Actor type',
  })
  actor: ActorType;
}
