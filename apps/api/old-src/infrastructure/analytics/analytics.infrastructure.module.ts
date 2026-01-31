import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';

@Module({
  controllers: [AnalyticsController],
  providers: [],
  exports: [],
})
export class AnalyticsInfrastructureModule {}
