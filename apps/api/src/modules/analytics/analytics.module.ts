import { Module } from '@nestjs/common';

import { AnalyticsHttpModule } from '@/modules/analytics/interfaces/analytics-http.module';

@Module({
  imports: [AnalyticsHttpModule],
})
export class AnalyticsModule {}
