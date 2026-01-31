import { ApiProperty } from '@nestjs/swagger';

class ProductDto {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the product',
    example: 'product-1',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the product',
    example: 'Smartphone',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'The price of the product',
    example: 699.99,
  })
  price: number;

  @ApiProperty({
    type: Number,
    description: 'The discount percentage of the product',
    example: 10,
    required: false,
  })
  discountPercentage?: number;
}

export class GetCategoryProductFeedResponseDto {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the category',
    example: 'category-123',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the category',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    isArray: true,
    type: ProductDto,
    description: 'List of products in the category',
  })
  products: {
    id: string;
    name: string;
    price: number;
    discountPercentage?: number;
  }[];
}
