import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginatedQueryDto } from '@/common/dto/paginated-query.dto';

export class OrderPaginatedQueryDto extends PaginatedQueryDto {
  @ApiProperty({ required: false, example: 'blue' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 'pending' })
  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'paid', 'shipping', 'delivered', 'canceled'], {
    message:
      'orderStatus must be one of the following values: pending, paid, shipped, delivered, canceled',
  })
  orderStatus?: string;

  @ApiProperty({ required: false, example: 'paid' })
  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'paid', 'failed', 'refunded'], {
    message:
      'paymentStatus must be one of the following values: pending, paid, failed, refunded',
  })
  paymentStatus?: string;

  @ApiProperty({ required: false, example: '2024-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
