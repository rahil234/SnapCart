import { apiConfig } from '@/api/client';
import { AnalyticsApi } from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const analyticsApi = new AnalyticsApi(apiConfig);

export const SalesService = {
  fetchSalesData: (timeframe: string, startDate: string, endDate: string) =>
    handleRequest(() =>
      analyticsApi.analyticsControllerGetSalesData(
        timeframe,
        startDate,
        endDate
      )
    ),

  getDashboardData: () =>
    handleRequest(() => analyticsApi.analyticsControllerGetDashboardData()),
};
