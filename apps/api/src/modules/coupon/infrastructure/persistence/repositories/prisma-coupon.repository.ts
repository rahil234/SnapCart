import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';
import { Coupon, CouponUsage } from '@/modules/coupon/domain/entities';
import { CouponType, CouponStatus, Applicability } from '@/modules/coupon/domain/enums';

@Injectable()
export class PrismaCouponRepository implements CouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(coupon: Coupon): Promise<Coupon> {
    const created = await this.prisma.coupon.create({
      data: {
        id: coupon.getId(),
        code: coupon.getCode(),
        type: coupon.getType(),
        discount: coupon.getDiscount(),
        minAmount: coupon.getMinAmount(),
        maxDiscount: coupon.getMaxDiscount() ?? null,
        startDate: coupon.getStartDate(),
        endDate: coupon.getEndDate(),
        status: coupon.getStatus(),
        usageLimit: coupon.getUsageLimit() ?? null,
        usedCount: coupon.getUsedCount(),
        maxUsagePerUser: coupon.getMaxUsagePerUser(),
        applicableTo: coupon.getApplicableTo(),
        isStackable: coupon.getIsStackable(),
        description: coupon.getDescription() ?? null,
        createdAt: coupon.getCreatedAt(),
        updatedAt: coupon.getUpdatedAt(),
      },
    });

    return this.toDomain(created);
  }

  async update(coupon: Coupon): Promise<Coupon> {
    const updated = await this.prisma.coupon.update({
      where: { id: coupon.getId() },
      data: {
        code: coupon.getCode(),
        type: coupon.getType(),
        discount: coupon.getDiscount(),
        minAmount: coupon.getMinAmount(),
        maxDiscount: coupon.getMaxDiscount() ?? null,
        startDate: coupon.getStartDate(),
        endDate: coupon.getEndDate(),
        status: coupon.getStatus(),
        usageLimit: coupon.getUsageLimit() ?? null,
        usedCount: coupon.getUsedCount(),
        maxUsagePerUser: coupon.getMaxUsagePerUser(),
        applicableTo: coupon.getApplicableTo(),
        isStackable: coupon.getIsStackable(),
        description: coupon.getDescription() ?? null,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  async findById(id: string): Promise<Coupon | undefined> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    return coupon ? this.toDomain(coupon) : undefined;
  }

  async findByCode(code: string): Promise<Coupon | undefined> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    return coupon ? this.toDomain(coupon) : undefined;
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ coupons: Coupon[]; total: number }> {
    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count(),
    ]);

    return {
      coupons: coupons.map((c) => this.toDomain(c)),
      total,
    };
  }

  async findActiveCoupons(): Promise<Coupon[]> {
    const now = new Date();
    const coupons = await this.prisma.coupon.findMany({
      where: {
        status: CouponStatus.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    return coupons.map((c) => this.toDomain(c));
  }

  async findAvailableForUser(userId: string): Promise<Coupon[]> {
    const now = new Date();

    // Get all active coupons
    const coupons = await this.prisma.coupon.findMany({
      where: {
        status: CouponStatus.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          { usageLimit: null },
          {
            usageLimit: {
              gt: await this.prisma.coupon
                .findMany({ select: { usedCount: true } })
                .then((c) => c[0]?.usedCount ?? 0),
            },
          },
        ],
      },
      include: {
        couponUsages: {
          where: { userId },
        },
      },
    });

    // Filter coupons based on per-user usage limit
    const availableCoupons = coupons.filter((coupon) => {
      const userUsageCount = coupon.couponUsages.length;
      return userUsageCount < coupon.maxUsagePerUser;
    });

    return availableCoupons.map((c) => this.toDomain(c));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.coupon.delete({
      where: { id },
    });
  }

  async getUserUsageCount(couponId: string, userId: string): Promise<number> {
    return await this.prisma.couponUsage.count({
      where: {
        couponId,
        userId,
      },
    });
  }

  async recordUsage(usage: CouponUsage): Promise<CouponUsage> {
    const created = await this.prisma.couponUsage.create({
      data: {
        id: usage.getId(),
        couponId: usage.getCouponId(),
        userId: usage.getUserId(),
        orderId: usage.getOrderId() ?? null,
        discountApplied: usage.getDiscountApplied(),
        usedAt: usage.getUsedAt(),
      },
    });

    // Increment used count
    await this.prisma.coupon.update({
      where: { id: usage.getCouponId() },
      data: { usedCount: { increment: 1 } },
    });

    return this.usageToDomain(created);
  }

  async getCouponUsageHistory(couponId: string): Promise<CouponUsage[]> {
    const usages = await this.prisma.couponUsage.findMany({
      where: { couponId },
      orderBy: { usedAt: 'desc' },
    });

    return usages.map((u) => this.usageToDomain(u));
  }

  async getUserCouponUsage(userId: string): Promise<CouponUsage[]> {
    const usages = await this.prisma.couponUsage.findMany({
      where: { userId },
      orderBy: { usedAt: 'desc' },
    });

    return usages.map((u) => this.usageToDomain(u));
  }

  private toDomain(prisma: any): Coupon {
    return Coupon.from(
      prisma.id,
      prisma.code,
      prisma.type as CouponType,
      prisma.discount,
      prisma.minAmount,
      prisma.maxDiscount ?? undefined,
      prisma.startDate,
      prisma.endDate,
      prisma.status as CouponStatus,
      prisma.usageLimit ?? undefined,
      prisma.usedCount,
      prisma.maxUsagePerUser,
      prisma.applicableTo as Applicability,
      prisma.isStackable,
      prisma.description ?? undefined,
      prisma.createdAt,
      prisma.updatedAt,
    );
  }

  private usageToDomain(prisma: any): CouponUsage {
    return CouponUsage.from(
      prisma.id,
      prisma.couponId,
      prisma.userId,
      prisma.orderId ?? undefined,
      prisma.discountApplied,
      prisma.usedAt,
    );
  }
}
