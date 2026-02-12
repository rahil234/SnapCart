import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import {
  AdminDashboardResponseDto,
  DashboardStatsDto,
  RecentOrderDto,
  SalesReportItemDto,
  SellerDashboardResponseDto,
  TopProductDto,
} from '@/modules/analytics/interfaces/dto';
import { PrismaService } from '@/shared/prisma/prisma.service';

// Type definitions for order items stored as JSON
interface OrderItem {
  variantId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discountPercent?: number;
  finalPrice?: number;
}

type OrderItemsMap = Record<string, OrderItem>;

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Type guard to validate order items structure
   */
  private isOrderItemsMap(items: unknown): items is OrderItemsMap {
    if (!items || typeof items !== 'object') return false;
    return Object.values(items).every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'variantId' in item &&
        'productId' in item &&
        'quantity' in item &&
        'price' in item,
    );
  }

  /**
   * Safely parse order items from the Prisma JSON field
   */
  private parseOrderItems(items: Prisma.JsonValue): OrderItemsMap {
    if (this.isOrderItemsMap(items)) {
      return items;
    }
    return {};
  }

  /**
   * Calculate the total quantity from order items
   */
  private calculateTotalQuantity(items: OrderItemsMap): number {
    return Object.values(items).reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    );
  }

  /**
   * Calculate total revenue from order items
   */
  private calculateTotalRevenue(items: OrderItemsMap): number {
    return Object.values(items).reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0,
    );
  }

  async getSalesReport(
    timeframe: string,
    startDateStr: string,
    endDateStr: string,
    sellerProfileId?: string,
  ): Promise<SalesReportItemDto[]> {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);

    // Get all orders in the date range
    const orders = await this.prisma.order.findMany({
      where: {
        placedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderStatus: { not: 'canceled' },
        isDeleted: false,
      },
      select: {
        id: true,
        placedAt: true,
        total: true,
        discount: true,
        items: true,
      },
    });

    // If seller-specific, filter orders that contain seller's products
    let filteredOrders = orders;
    if (sellerProfileId) {
      const sellerVariants = await this.prisma.productVariant.findMany({
        where: { sellerProfileId },
        select: { id: true },
      });
      const variantIds = new Set(sellerVariants.map((v) => v.id));

      filteredOrders = orders.filter((order) => {
        const items = this.parseOrderItems(order.items);
        return Object.values(items).some((item) =>
          variantIds.has(item.variantId),
        );
      });
    }

    // Group by timeframe
    const grouped = new Map<string, SalesReportItemDto>();

    filteredOrders.forEach((order) => {
      const date = new Date(order.placedAt);
      let key: string;

      switch (timeframe) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        }
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          break;
        case 'yearly':
          key = `${date.getFullYear()}-01-01`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          date: key,
          startDate: null,
          endDate: null,
          totalOrders: 0,
          totalSales: 0,
          totalDiscountApplied: 0,
          netSales: 0,
          totalItemsSold: 0,
        });
      }

      const group = grouped.get(key)!;
      const items = this.parseOrderItems(order.items);
      const itemsCount = this.calculateTotalQuantity(items);

      if (sellerProfileId) {
        // Calculate seller-specific sales from their items only
        const sellerSales = Object.values(items).reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        group.totalSales += sellerSales;
      } else {
        group.totalSales += order.total;
      }

      group.totalOrders += 1;
      group.totalDiscountApplied += order.discount;
      group.totalItemsSold += itemsCount;
      group.netSales = group.totalSales - group.totalDiscountApplied;
    });

    return Array.from(grouped.values()).sort((a, b) =>
      b.date!.localeCompare(a.date!),
    );
  }

  async getAdminDashboard(): Promise<AdminDashboardResponseDto> {
    // Get stats
    const [orderStats, customerCount] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          orderStatus: { not: 'canceled' },
          isDeleted: false,
        },
        _sum: {
          total: true,
          discount: true,
        },
        _count: true,
      }),
      this.prisma.customerProfile.count(),
    ]);

    // Get orders to calculate items sold
    const orders = await this.prisma.order.findMany({
      where: {
        orderStatus: { not: 'canceled' },
        isDeleted: false,
      },
      select: {
        items: true,
      },
    });

    // Calculate total items sold
    let totalItemsSold = 0;
    orders.forEach((order) => {
      const items = this.parseOrderItems(order.items);
      totalItemsSold += this.calculateTotalQuantity(items);
    });

    const stats: DashboardStatsDto = {
      totalRevenue: orderStats._sum.total || 0,
      totalOrders: orderStats._count || 0,
      totalCustomers: customerCount,
      totalProductsSold: totalItemsSold,
      averageOrderValue:
        orderStats._count && orderStats._count > 0
          ? (orderStats._sum.total || 0) / orderStats._count
          : 0,
      totalDiscount: orderStats._sum.discount || 0,
    };

    // Get recent orders
    const recentOrders = await this.prisma.order.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        customerProfile: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        placedAt: 'desc',
      },
      take: 10,
    });

    // Get top products by analyzing all orders
    const allOrders = await this.prisma.order.findMany({
      where: {
        orderStatus: { not: 'canceled' },
        isDeleted: false,
      },
      select: {
        items: true,
      },
    });

    // Aggregate product sales
    const productMap = new Map<
      string,
      {
        productId: string;
        productName: string;
        totalSold: number;
        revenue: number;
      }
    >();

    allOrders.forEach((order) => {
      const items = this.parseOrderItems(order.items);
      Object.values(items).forEach((item) => {
        const productId = item.productId;
        const productName = item.productName || 'Unknown Product';
        const quantity = item.quantity || 0;
        const revenue = (item.price || 0) * quantity;

        if (productMap.has(productId)) {
          const existing = productMap.get(productId)!;
          existing.totalSold += quantity;
          existing.revenue += revenue;
        } else {
          productMap.set(productId, {
            productId,
            productName,
            totalSold: quantity,
            revenue,
          });
        }
      });
    });

    const topProducts: TopProductDto[] = Array.from(productMap.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);

    return {
      stats,
      recentOrders: recentOrders.map(
        (order): RecentOrderDto => ({
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          orderStatus: order.orderStatus,
          placedAt: order.placedAt,
          customerName: order.customerProfile?.name || null,
        }),
      ),
      topProducts,
    };
  }

  async getSellerDashboard(
    sellerProfileId: string,
  ): Promise<SellerDashboardResponseDto> {
    // Get seller's product and variant IDs
    const sellerVariants = await this.prisma.productVariant.findMany({
      where: { sellerProfileId },
      select: { id: true, productId: true },
    });

    const variantIds = new Set(sellerVariants.map((v) => v.id));

    if (variantIds.size === 0) {
      return {
        stats: {
          totalRevenue: 0,
          totalOrders: 0,
          totalProductsSold: 0,
          averageOrderValue: 0,
          totalDiscount: 0,
        },
        recentOrders: [],
        topProducts: [],
      };
    }

    // Get all orders
    const orders = await this.prisma.order.findMany({
      where: {
        orderStatus: { not: 'canceled' },
        isDeleted: false,
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        discount: true,
        orderStatus: true,
        placedAt: true,
        items: true,
      },
    });

    // Filter orders containing seller's products and calculate stats
    let totalRevenue = 0;
    let totalItemsSold = 0;
    let totalDiscount = 0;
    const orderIdsSet = new Set<string>();
    const recentOrdersList: RecentOrderDto[] = [];
    const productMap = new Map<
      string,
      {
        productId: string;
        productName: string;
        totalSold: number;
        revenue: number;
      }
    >();

    orders.forEach((order) => {
      const items = this.parseOrderItems(order.items);
      if (Object.keys(items).length === 0) return;

      let hasSellerProduct = false;
      let sellerRevenue = 0;
      let sellerItemCount = 0;

      Object.values(items).forEach((item) => {
        if (variantIds.has(item.variantId)) {
          hasSellerProduct = true;
          const quantity = item.quantity || 0;
          const revenue = (item.price || 0) * quantity;

          sellerRevenue += revenue;
          sellerItemCount += quantity;

          // Track for top products
          const productId = item.productId;
          const productName = item.productName || 'Unknown Product';

          if (productMap.has(productId)) {
            const existing = productMap.get(productId)!;
            existing.totalSold += quantity;
            existing.revenue += revenue;
          } else {
            productMap.set(productId, {
              productId,
              productName,
              totalSold: quantity,
              revenue,
            });
          }
        }
      });

      if (hasSellerProduct) {
        orderIdsSet.add(order.id);
        totalRevenue += sellerRevenue;
        totalItemsSold += sellerItemCount;

        // Proportional discount
        const orderTotal = order.total || 1;
        totalDiscount += (order.discount * sellerRevenue) / orderTotal;

        // Add to recent orders if within top 10
        if (recentOrdersList.length < 10) {
          recentOrdersList.push({
            id: order.id,
            orderNumber: order.orderNumber,
            total: order.total,
            orderStatus: order.orderStatus,
            placedAt: order.placedAt,
          });
        }
      }
    });

    const totalOrders = orderIdsSet.size;

    const stats: DashboardStatsDto = {
      totalRevenue,
      totalOrders,
      totalProductsSold: totalItemsSold,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      totalDiscount,
    };

    const topProducts: TopProductDto[] = Array.from(productMap.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);

    return {
      stats,
      recentOrders: recentOrdersList,
      topProducts,
    };
  }
}
