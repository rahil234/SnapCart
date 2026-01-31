import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({
    description: 'Array of products',
    type: [ProductResponseDto]
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: 'Total number of products',
    example: 150
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 15
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false
  })
  hasPrev: boolean;

  constructor(
    data: ProductResponseDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}
