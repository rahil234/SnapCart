import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginatedQueryDto } from '@/shared/dto/common/paginated-query.dto';

export class ProductPaginatedQueryDto extends PaginatedQueryDto {
  @ApiProperty({ required: false, example: 'john' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    example: 'active',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
