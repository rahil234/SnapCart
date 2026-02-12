import { Module } from '@nestjs/common';

import { AnalyticsRepository } from '@/modules/analytics/infrastructure/analytics.repository';
import { GetSalesReportHandler } from '@/modules/analytics/application/queries/get-sales-report/get-sales-report.handler';
import { GetAdminDashboardHandler } from '@/modules/analytics/application/queries/get-admin-dashboard/get-admin-dashboard.handler';
import { GetSellerDashboardHandler } from '@/modules/analytics/application/queries/get-seller-dashboard/get-seller-dashboard.handler';

const QueryHandlers = [
  GetSalesReportHandler,
  GetAdminDashboardHandler,
  GetSellerDashboardHandler,
];

@Module({
  providers: [AnalyticsRepository, ...QueryHandlers],
})
export class AnalyticsApplicationModule {}
