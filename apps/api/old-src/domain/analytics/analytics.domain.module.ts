import { Module } from '@nestjs/common';
import { AnalyticsService } from '@/domain/analytics/services/analytics.service';

@Module({
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsDomainModule {}
