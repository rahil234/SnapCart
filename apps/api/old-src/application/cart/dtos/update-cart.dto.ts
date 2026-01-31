import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ example: 3, description: 'The new quantity of the cart item' })
  @IsNumber()
  quantity: number;
}
