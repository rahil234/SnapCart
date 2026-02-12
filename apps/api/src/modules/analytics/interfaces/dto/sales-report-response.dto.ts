import { ApiProperty } from '@nestjs/swagger';

export class SalesReportItemDto {
  @ApiProperty({ description: 'Date or period identifier', nullable: true })
  date: string | null;

  @ApiProperty({ description: 'Start date of the period', nullable: true })
  startDate: string | null;

  @ApiProperty({ description: 'End date of the period', nullable: true })
  endDate: string | null;

  @ApiProperty({ description: 'Total number of orders' })
  totalOrders: number;

  @ApiProperty({ description: 'Total sales amount' })
  totalSales: number;

  @ApiProperty({ description: 'Total discount applied' })
  totalDiscountApplied: number;

  @ApiProperty({ description: 'Net sales after discounts' })
  netSales: number;

  @ApiProperty({ description: 'Total items sold' })
  totalItemsSold: number;
}
