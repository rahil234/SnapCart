import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginatedQueryDto } from '@/common/dto/paginated-query.dto';

export class UserPaginatedQueryDto extends PaginatedQueryDto {
  @ApiProperty({ required: false, example: 'john' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    example: 'active',
    enum: ['active', 'suspended'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['active', 'suspended'])
  status?: 'active' | 'suspended';
}
