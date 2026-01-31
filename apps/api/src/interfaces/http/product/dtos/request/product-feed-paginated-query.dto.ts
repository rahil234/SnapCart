import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

import { PaginatedQueryDto } from '@/shared/dto/common/paginated-query.dto';

export class ProductFeedPaginatedQueryDto extends PaginatedQueryDto {
  @ApiProperty({ required: false, example: 'blue shirts' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    example: ['S', 'M', 'XL'],
    description: 'Array of sizes',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }: { value: string | string[] }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ required: false, example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({
    required: false,
    example: ['cat123', 'cat456'],
    description: 'Array of category IDs',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
