import { ApiProperty } from '@nestjs/swagger';

export class SalesOverviewItemDto {
  @ApiProperty({
    description: 'Month of the sales data',
    example: 'January',
  })
  month: string;

  @ApiProperty({
    description: 'Total sales amount for the month',
    example: 10000,
  })
  amount: number;
}

export class TopSellingProductDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 'PROD987654',
  })
  productId: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Number of units sold',
    example: 150,
  })
  sold: number;

  @ApiProperty({
    description: 'Total revenue generated from the product',
    example: 4500,
  })
  revenue: number;
}

export class RecentOrderDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 'ORD123456',
  })
  orderId: string;

  @ApiProperty({
    description: 'Name of the customer who placed the order',
    example: 'John Doe',
  })
  customerName: string;

  @ApiProperty({
    description: 'Total amount for the order',
    example: 250.75,
  })
  total: number;

  @ApiProperty({
    description: 'Date when the order was placed',
    example: '2024-05-15T10:30:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Current status of the order',
    example: 'Shipped',
  })
  status: string;
}

export class DashboardAnalyticsResponseDto {
  @ApiProperty({
    description: 'Total revenue generated',
    example: 125000,
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Total number of orders',
    example: 3500,
  })
  totalOrders: number;

  @ApiProperty({
    description: 'Total number of products',
    example: 150,
  })
  totalProducts: number;

  @ApiProperty({
    description: 'Total number of customers',
    example: 1200,
  })
  totalCustomers: number;

  @ApiProperty({ type: [SalesOverviewItemDto] })
  salesOverview: SalesOverviewItemDto[];

  @ApiProperty({ type: [TopSellingProductDto] })
  topSellingProducts: TopSellingProductDto[];

  @ApiProperty({ type: [RecentOrderDto] })
  recentOrders: RecentOrderDto[];

  static fromData(data: any): DashboardAnalyticsResponseDto {
    return {
      totalRevenue: data.totalRevenue,
      totalOrders: data.totalOrders,
      totalProducts: data.totalProducts,
      totalCustomers: data.totalCustomers,
      salesOverview: data.salesOverview,
      topSellingProducts: data.topSellingProducts,
      recentOrders: data.recentOrders,
    };
  }
}
