import { IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum StockActionEnum {
  SET = 'set',
  ADD = 'add',
  REDUCE = 'reduce',
}

/**
 * Update Variant Stock DTO
 *
 * Dedicated DTO for stock management operations.
 * Most frequent operation in e-commerce.
 */
export class UpdateVariantStockDto {
  @ApiProperty({
    description: 'Stock action type',
    enum: StockActionEnum,
    example: StockActionEnum.ADD,
  })
  @IsEnum(StockActionEnum)
  action: StockActionEnum;

  @ApiProperty({
    description: 'Stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'Quantity cannot be negative' })
  @Type(() => Number)
  quantity: number;
}
