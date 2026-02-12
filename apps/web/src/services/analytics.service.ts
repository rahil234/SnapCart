import { apiConfig } from '@/api/client';
import {
  AdminDashboardResponseDto,
  AnalyticsApi,
  AnalyticsControllerGetSalesReportTimeframeEnum,
  SalesReportItemDto,
  SellerDashboardResponseDto,
} from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const analyticsApi = new AnalyticsApi(apiConfig);

export const AnalyticsService = {
  getSalesReport: async (
    timeframe: AnalyticsControllerGetSalesReportTimeframeEnum,
    startDate: string,
    endDate: string
  ): Promise<SalesReportItemDto[]> => {
    const result = await handleRequest(() =>
      analyticsApi.analyticsControllerGetSalesReport(
        timeframe,
        startDate,
        endDate
      )
    );

    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch sales report');
    }

    return result.data || [];
  },

  // Admin Dashboard
  getAdminDashboard: async (): Promise<AdminDashboardResponseDto> => {
    const result = await handleRequest(() =>
      analyticsApi.analyticsControllerGetAdminDashboard()
    );

    if (result.error) {
      throw new Error(
        result.error.message || 'Failed to fetch admin dashboard'
      );
    }

    if (!result.data) {
      throw new Error('No data returned from admin dashboard');
    }

    return result.data;
  },

  // Seller Dashboard
  getSellerDashboard: async (): Promise<SellerDashboardResponseDto> => {
    const result = await handleRequest(() =>
      analyticsApi.analyticsControllerGetSellerDashboard()
    );

    if (result.error) {
      throw new Error(
        result.error.message || 'Failed to fetch seller dashboard'
      );
    }

    if (!result.data) {
      throw new Error('No data returned from seller dashboard');
    }

    return result.data;
  },
};
