import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTryOnDto {
  @ApiProperty({
    description: 'ID of the product to be tried on',
    example: 'product-67890',
  })
  @IsString()
  productId: string;
}
