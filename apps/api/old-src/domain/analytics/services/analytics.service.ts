import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async getDashboardAnalytics() {
    const summary = await this.getSummary();
    const salesOverview = await this.getSalesOverview();
    const topSellingProducts = await this.getTopSellingProducts();
    const recentOrders = await this.getRecentOrders();

    return {
      ...summary,
      salesOverview,
      topSellingProducts,
      recentOrders,
    };
  }

  private async getSummary() {
    const [revenue, totalOrders, totalProducts, totalCustomers] =
      await Promise.all([
        this.prisma.order.aggregate({ _sum: { total: true } }),
        this.prisma.order.count(),
        this.prisma.product.count(),
        this.prisma.user.count(),
      ]);

    return {
      totalRevenue: revenue._sum.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
    };
  }

  private async getSalesOverview() {
    const data = await this.prisma.$queryRaw<
      { month: number; amount: number }[]
    >`
      SELECT
        EXTRACT(MONTH FROM "placedAt") AS month,
        SUM("total") AS amount
      FROM "Order"
      WHERE "isDeleted" = false
      GROUP BY month
      ORDER BY month ASC
    `;

    const months = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return data.map((row) => ({
      month: months[row.month],
      amount: Number(row.amount),
    }));
  }

  private async getTopSellingProducts() {
    const rows = await this.prisma.$queryRaw<
      { productId: string; name: string; sold: number; revenue: number }[]
    >`
      SELECT
        item->>'productId' AS "productId",
        item->>'name' AS name,
        SUM(CAST(item->>'quantity' AS INTEGER)) AS sold,
        SUM(CAST(item->>'subtotal' AS FLOAT)) AS revenue
      FROM "Order",
      jsonb_array_elements("items") AS item
      WHERE "isDeleted" = false
      GROUP BY item->>'productId', item->>'name'
      ORDER BY revenue DESC
      LIMIT 4;
    `;

    return rows.map((r) => ({
      productId: r.productId,
      name: r.name,
      sold: Number(r.sold),
      revenue: Number(r.revenue),
    }));
  }

  private async getRecentOrders() {
    const orders = await this.prisma.order.findMany({
      where: { isDeleted: false },
      orderBy: { placedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        placedAt: true,
        orderStatus: true,
        paymentStatus: true,
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: {
        name: o.user?.name,
        email: o.user?.email,
        phone: o.user?.phone,
      },
      total: o.total,
      placedAt: o.placedAt,
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
    }));
  }
}
