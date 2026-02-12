import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { CouponStatus } from '@/modules/coupon/domain/enums';
import { OfferStatus } from '@/modules/offer/domain/enums';

/**
 * Scheduler Service
 * Handles automated tasks like expiring coupons and offers
 */
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Auto-expire coupons that have passed their end date
   * Runs daily at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireCoupons() {
    this.logger.log('Running scheduled task: Expire coupons');

    const now = new Date();

    try {
      const result = await this.prisma.coupon.updateMany({
        where: {
          status: CouponStatus.ACTIVE,
          endDate: {
            lt: now,
          },
        },
        data: {
          status: CouponStatus.EXPIRED,
          updatedAt: now,
        },
      });

      this.logger.log(`Expired ${result.count} coupons`);
    } catch (error) {
      this.logger.error('Error expiring coupons:', error);
    }
  }

  /**
   * Auto-expire offers that have passed their end date
   * Runs daily at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireOffers() {
    this.logger.log('Running scheduled task: Expire offers');

    const now = new Date();

    try {
      const result = await this.prisma.offer.updateMany({
        where: {
          status: OfferStatus.ACTIVE,
          endDate: {
            lt: now,
          },
        },
        data: {
          status: OfferStatus.EXPIRED,
          updatedAt: now,
        },
      });

      this.logger.log(`Expired ${result.count} offers`);
    } catch (error) {
      this.logger.error('Error expiring offers:', error);
    }
  }

  /**
   * Generate daily report of coupon usage
   * Runs daily at 1 AM
   */
  @Cron('0 1 * * *')
  async generateCouponUsageReport() {
    this.logger.log('Running scheduled task: Generate coupon usage report');

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date(yesterday);
      today.setDate(today.getDate() + 1);

      const usageStats = await this.prisma.couponUsage.groupBy({
        by: ['couponId'],
        where: {
          usedAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _count: {
          id: true,
        },
        _sum: {
          discountApplied: true,
        },
      });

      this.logger.log(
        `Daily coupon usage report: ${usageStats.length} coupons used`,
      );

      // Could send this to analytics service or email admin
      for (const stat of usageStats) {
        this.logger.log(
          `Coupon ${stat.couponId}: ${stat._count.id} uses, ₹${stat._sum.discountApplied} total discount`,
        );
      }
    } catch (error) {
      this.logger.error('Error generating coupon usage report:', error);
    }
  }

  /**
   * Alert for coupons expiring soon (within 3 days)
   * Runs daily at 8 AM
   */
  @Cron('0 8 * * *')
  async alertExpiringCoupons() {
    this.logger.log('Running scheduled task: Check expiring coupons');

    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const expiringCoupons = await this.prisma.coupon.findMany({
        where: {
          status: CouponStatus.ACTIVE,
          endDate: {
            lte: threeDaysFromNow,
            gte: new Date(),
          },
        },
        select: {
          id: true,
          code: true,
          endDate: true,
          usedCount: true,
          usageLimit: true,
        },
      });

      if (expiringCoupons.length > 0) {
        this.logger.warn(
          `${expiringCoupons.length} coupons expiring within 3 days`,
        );

        // Could send notification to admin or emit event
        for (const coupon of expiringCoupons) {
          this.logger.warn(
            `Coupon '${coupon.code}' expires on ${coupon.endDate.toISOString()} (Used: ${coupon.usedCount}/${coupon.usageLimit || '∞'})`,
          );
        }
      } else {
        this.logger.log('No coupons expiring soon');
      }
    } catch (error) {
      this.logger.error('Error checking expiring coupons:', error);
    }
  }
}
