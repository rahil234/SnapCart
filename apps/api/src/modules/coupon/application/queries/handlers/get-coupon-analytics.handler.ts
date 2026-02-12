import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { GetCouponAnalyticsQuery } from '../get-coupon-analytics.query';

@QueryHandler(GetCouponAnalyticsQuery)
export class GetCouponAnalyticsHandler
  implements IQueryHandler<GetCouponAnalyticsQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCouponAnalyticsQuery): Promise<any> {
    const { startDate, endDate } = query;

    const whereClause: any = {};
    if (startDate || endDate) {
      whereClause.usedAt = {};
      if (startDate) whereClause.usedAt.gte = startDate;
      if (endDate) whereClause.usedAt.lte = endDate;
    }

    // Get usage stats by coupon
    const usageStats = await this.prisma.couponUsage.groupBy({
      by: ['couponId'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        discountApplied: true,
      },
    });

    // Get coupon details
    const couponIds = usageStats.map((s) => s.couponId);
    const coupons = await this.prisma.coupon.findMany({
      where: { id: { in: couponIds } },
      select: {
        id: true,
        code: true,
        type: true,
        discount: true,
        status: true,
        usageLimit: true,
        usedCount: true,
      },
    });

    // Combine stats with coupon details
    const analytics = usageStats.map((stat) => {
      const coupon = coupons.find((c) => c.id === stat.couponId);
      return {
        couponId: stat.couponId,
        couponCode: coupon?.code,
        couponType: coupon?.type,
        couponDiscount: coupon?.discount,
        status: coupon?.status,
        totalUsages: stat._count.id,
        totalDiscountApplied: stat._sum.discountApplied || 0,
        averageDiscountPerUse:
          stat._sum.discountApplied && stat._count.id
            ? stat._sum.discountApplied / stat._count.id
            : 0,
        usageLimit: coupon?.usageLimit,
        currentUsedCount: coupon?.usedCount,
        utilizationRate:
          coupon?.usageLimit
            ? ((coupon.usedCount / coupon.usageLimit) * 100).toFixed(2)
            : null,
      };
    });

    // Sort by total discount applied (most valuable coupons first)
    analytics.sort((a, b) => b.totalDiscountApplied - a.totalDiscountApplied);

    // Calculate summary stats
    const summary = {
      totalCouponsUsed: analytics.length,
      totalUsages: analytics.reduce((sum, a) => sum + a.totalUsages, 0),
      totalDiscountGiven: analytics.reduce(
        (sum, a) => sum + a.totalDiscountApplied,
        0,
      ),
      averageDiscountPerCoupon:
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + a.totalDiscountApplied, 0) /
            analytics.length
          : 0,
      topPerformingCoupon: analytics[0]?.couponCode || null,
    };

    return {
      summary,
      coupons: analytics,
      period: {
        startDate: startDate?.toISOString() || null,
        endDate: endDate?.toISOString() || null,
      },
    };
  }
}
