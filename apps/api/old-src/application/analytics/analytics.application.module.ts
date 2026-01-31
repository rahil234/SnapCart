import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnalyticsDomainModule } from '../../domain/analytics/analytics.domain.module';
import { AnalyticsInfrastructureModule } from '../../infrastructure/analytics/analytics.infrastructure.module';
import { GetDashboardAnalyticsHandler } from './queries/handlers';

const QueryHandlers = [GetDashboardAnalyticsHandler];

@Module({
  imports: [
    CqrsModule,
    AnalyticsDomainModule,
    AnalyticsInfrastructureModule,
  ],
  providers: [...QueryHandlers],
  exports: [...QueryHandlers],
})
export class AnalyticsApplicationModule {}
