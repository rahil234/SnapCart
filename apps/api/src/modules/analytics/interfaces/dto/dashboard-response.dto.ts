import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total revenue' })
  totalRevenue: number;

  @ApiProperty({ description: 'Total orders' })
  totalOrders: number;

  @ApiProperty({ description: 'Total customers', required: false })
  totalCustomers?: number;

  @ApiProperty({ description: 'Total products sold' })
  totalProductsSold: number;

  @ApiProperty({ description: 'Average order value' })
  averageOrderValue: number;

  @ApiProperty({ description: 'Total discount given' })
  totalDiscount: number;
}

export class RecentOrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  orderStatus: string;

  @ApiProperty()
  placedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  customerName?: string | null;
}

export class TopProductDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  totalSold: number;

  @ApiProperty()
  revenue: number;
}

export class AdminDashboardResponseDto {
  @ApiProperty({ type: DashboardStatsDto })
  stats: DashboardStatsDto;

  @ApiProperty({ type: [RecentOrderDto] })
  recentOrders: RecentOrderDto[];

  @ApiProperty({ type: [TopProductDto] })
  topProducts: TopProductDto[];
}

export class SellerDashboardResponseDto {
  @ApiProperty({ type: DashboardStatsDto })
  stats: DashboardStatsDto;

  @ApiProperty({ type: [RecentOrderDto] })
  recentOrders: RecentOrderDto[];

  @ApiProperty({ type: [TopProductDto] })
  topProducts: TopProductDto[];
}
