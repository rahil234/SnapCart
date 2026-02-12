import {
  CustomerProfile as PrismaCustomer,
  Order as PrismaOrder,
  User as PrismaUser,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { Order } from '../../domain/entities';
import { CustomerInfo } from '../../domain/value-objects';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '../../domain/enums';
import { OrderFilters, OrderRepository } from '../../domain/repositories';

export type OrderWithRelations = PrismaOrder & {
  customerProfile:
    | (Pick<PrismaCustomer, 'id' | 'name'> & {
        user: PrismaUser;
      })
    | null;
};

/**
 * Prisma implementation of OrderRepository
 */
@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customerProfile: {
          select: {
            id: true,
            name: true,
            user: true,
          },
        },
      },
    });

    if (!order) return null;

    return this.toDomain(order);
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customerProfile: {
          select: {
            id: true,
            name: true,
            user: true,
          },
        },
      },
    });

    if (!order) return null;

    return this.toDomain(order);
  }

  async findByCustomerId(
    customerId: string,
    skip: number,
    take: number,
  ): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: {
          customerId,
          isDeleted: false,
        },
        include: {
          customerProfile: {
            select: {
              id: true,
              name: true,
              user: true,
            },
          },
        },
        skip,
        take,
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.order.count({
        where: {
          customerId,
          isDeleted: false,
        },
      }),
    ]);

    return {
      orders: orders.map((order) => this.toDomain(order)),
      total,
    };
  }

  async findAll(
    filters: OrderFilters,
    skip: number,
    take: number,
  ): Promise<{ orders: Order[]; total: number }> {
    const where: any = {
      isDeleted: false,
    };

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.orderStatus) {
      where.orderStatus = filters.orderStatus;
    }

    if (filters.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters.startDate || filters.endDate) {
      where.placedAt = {};
      if (filters.startDate) {
        where.placedAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.placedAt.lte = filters.endDate;
      }
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: {
          customerProfile: {
            select: {
              id: true,
              name: true,
              user: true,
            },
          },
        },
        skip,
        take,
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map((order) => this.toDomain(order)),
      total,
    };
  }

  async findBySellerProducts(
    sellerId: string,
    skip: number,
    take: number,
  ): Promise<{ orders: Order[]; total: number }> {
    // Get all product IDs for this seller
    const sellerProducts = await this.prisma.product.findMany({
      where: {
        sellerProfileId: sellerId,
        isDeleted: false,
      },
      select: { id: true },
    });

    const productIds = sellerProducts.map((p) => p.id);

    if (productIds.length === 0) {
      return { orders: [], total: 0 };
    }

    // Find orders containing these products
    // We need to query JSON field, so we'll fetch all orders and filter
    const [allOrders, totalCount] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          customerProfile: {
            select: {
              id: true,
              name: true,
              user: true,
            },
          },
        },
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.order.count({
        where: {
          isDeleted: false,
        },
      }),
    ]);

    // Filter orders that contain seller's products
    const filteredOrders = allOrders.filter((order) => {
      const items = order.items as any[];
      return items.some((item) => productIds.includes(item.productId));
    });

    // Apply pagination manually
    const paginatedOrders = filteredOrders.slice(skip, skip + take);

    return {
      orders: paginatedOrders.map((order) => this.toDomain(order)),
      total: filteredOrders.length,
    };
  }

  async save(order: Order): Promise<Order> {
    const data = {
      orderNumber: order.getOrderNumber(),
      customerId: order.getCustomerId(),
      subtotal: order.getSubtotal(),
      discount: order.getDiscount(),
      couponDiscount: order.getCouponDiscount(),
      offerDiscount: order.getOfferDiscount(),
      shippingCharge: order.getShippingCharge(),
      tax: order.getTax(),
      total: order.getTotal(),
      appliedCouponCode: order.getAppliedCouponCode(),
      appliedOfferIds: order.getAppliedOfferIds(),
      items: order.getItems().map((item) => item.toJSON()),
      shippingAddressJson: order.getShippingAddressJson(),
      paymentMethod: order.getPaymentMethod(),
      paymentStatus: order.getPaymentStatus(),
      orderStatus: order.getOrderStatus(),
      metadata: order.getMetadata(),
      cancelReason: order.getCancelReason(),
      refundAmount: order.getRefundAmount(),
      deliveredAt: order.getDeliveredAt(),
      cancelledAt: order.getCancelledAt(),
    };

    const saved = await this.prisma.order.upsert({
      where: { id: order.getId() },
      include: {
        customerProfile: {
          select: {
            id: true,
            name: true,
            user: true,
          },
        },
      },
      create: {
        id: order.getId(),
        ...data,
        placedAt: order.placedAt,
      },
      update: data,
    });

    return this.toDomain(saved);
  }

  async getCustomerOrderStats(customerId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    const orders = await this.prisma.order.findMany({
      where: {
        customerId,
        isDeleted: false,
        orderStatus: { not: OrderStatus.CANCELED },
      },
      select: {
        total: true,
      },
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
    };
  }

  /**
   * Map Prisma model to Domain entity
   */
  private toDomain(prismaOrder: OrderWithRelations): Order {
    // Create customer info if customer profile exists
    let customerInfo: CustomerInfo | null = null;
    if (prismaOrder.customerProfile) {
      customerInfo = CustomerInfo.create(
        prismaOrder.customerProfile.id,
        prismaOrder.customerProfile.name,
        prismaOrder.customerProfile.user.email,
        prismaOrder.customerProfile.user.phone,
      );
    }

    // Use items as-is since imageUrl is now stored in order items during creation
    const items = Array.isArray(prismaOrder.items) ? prismaOrder.items : [];

    return Order.from(
      prismaOrder.id,
      prismaOrder.orderNumber,
      prismaOrder.customerProfile?.id || prismaOrder.customerId || '',
      customerInfo,
      items,
      prismaOrder.subtotal,
      prismaOrder.discount,
      prismaOrder.couponDiscount,
      prismaOrder.offerDiscount,
      prismaOrder.shippingCharge,
      prismaOrder.tax,
      prismaOrder.total,
      prismaOrder.appliedCouponCode,
      prismaOrder.appliedOfferIds,
      prismaOrder.shippingAddressJson,
      prismaOrder.paymentMethod,
      prismaOrder.paymentStatus as PaymentStatus,
      prismaOrder.orderStatus as OrderStatus,
      prismaOrder.metadata,
      prismaOrder.cancelReason,
      prismaOrder.refundAmount,
      prismaOrder.placedAt,
      prismaOrder.deliveredAt,
      prismaOrder.cancelledAt,
      prismaOrder.updatedAt,
    );
  }
}
