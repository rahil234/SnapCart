import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AnalyticsController } from '@/modules/analytics/interfaces/analytics.controller';
import { AnalyticsApplicationModule } from '@/modules/analytics/application/analytics-application.module';

@Module({
  imports: [CqrsModule, AnalyticsApplicationModule],
  controllers: [AnalyticsController],
})
export class AnalyticsHttpModule {}
