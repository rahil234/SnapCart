import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: 'var_ABC123',
    description:
      'The unique identifier of the product variant to be added to the cart',
  })
  @IsString()
  variantId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product to be added to the cart',
  })
  @IsNumber()
  quantity: number;
}
