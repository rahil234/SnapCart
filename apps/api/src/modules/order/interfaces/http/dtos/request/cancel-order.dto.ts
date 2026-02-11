import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelOrderDto {
  @ApiProperty({
    description: 'Reason for cancelling the order',
    example: 'Changed my mind',
  })
  @IsNotEmpty()
  @IsString()
  cancelReason: string;
}
